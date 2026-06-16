<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use App\Models\OfferMessage;
use App\Models\Property;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class OfferController extends Controller
{
    
    public function store(Request $request, Property $property)
    {
        $data = $request->validate([
            'amount' => ['nullable', 'numeric', 'min:0'],
            'message' => ['nullable', 'string', 'max:2000'],
            'type' => ['nullable', Rule::in(['offer', 'inquiry', 'viewing', 'booking'])],
            'viewing_date' => ['nullable', 'date'],
            'start_date' => ['nullable', 'date', 'after_or_equal:today'],
            'end_date' => ['nullable', 'date', 'after:start_date'],
        ]);

        $offer = $property->offers()->create([
            'client_id' => $request->user()->id,
            'amount' => $data['amount'] ?? null,
            'message' => $data['message'] ?? null, 
            'type' => $data['type'] ?? 'offer',
            'viewing_date' => $data['viewing_date'] ?? null,
            'start_date' => $data['start_date'] ?? null,
            'end_date' => $data['end_date'] ?? null,
            'status' => 'pending',
        ]);

        
        $offer->messages()->create([
            'user_id' => $request->user()->id,
            'message' => $data['message'] ?? 'Submitted a new ' . $offer->type . ' request.',
            'proposed_amount' => $data['amount'] ?? null,
        ]);

        $offer->load('client:id,name,email,phone');

        
        Notification::create([
            'user_id' => $property->user_id,
            'type' => 'offer_received',
            'data' => [
                'property_id' => $property->id,
                'property_title' => $property->title,
                'client_name' => $request->user()->name,
                'amount' => $offer->amount,
                'message' => 'You received a new ' . $offer->type . ' from ' . $request->user()->name,
            ],
        ]);

        return response()->json($offer, 201);
    }

    
    public function sent(Request $request)
    {
        $offers = Offer::query()
            ->where('client_id', $request->user()->id)
            ->with(['property:id,title,slug,user_id', 'messages.user:id,name'])
            ->latest()
            ->get();

        return response()->json($offers);
    }

    
    public function received(Request $request)
    {
        $offers = Offer::query()
            ->whereHas('property', fn ($q) => $q->where('user_id', $request->user()->id))
            ->with(['client:id,name,email,phone', 'property:id,title,slug', 'messages.user:id,name'])
            ->latest()
            ->get();

        return response()->json($offers);
    }

    
    public function reply(Request $request, Offer $offer)
    {
        
        if ($offer->client_id !== $request->user()->id && $offer->property->user_id !== $request->user()->id) {
            abort(403);
        }

        $data = $request->validate([
            'message' => ['required', 'string', 'max:2000'],
            'status' => ['nullable', Rule::in(['pending', 'accepted', 'rejected', 'countered', 'withdrawn'])],
            'proposed_amount' => ['nullable', 'numeric', 'min:0'],
        ]);

        $offer->messages()->create([
            'user_id' => $request->user()->id,
            'message' => $data['message'],
            'proposed_amount' => $data['proposed_amount'] ?? null,
        ]);

        if (isset($data['status'])) {
            $offer->update(['status' => $data['status']]);
            if (isset($data['proposed_amount'])) {
                $offer->update(['amount' => $data['proposed_amount']]);
            }
        }

        
        $recipientId = ($request->user()->id === $offer->client_id) ? $offer->property->user_id : $offer->client_id;
        
        Notification::create([
            'user_id' => $recipientId,
            'type' => 'offer_reply',
            'data' => [
                'property_id' => $offer->property->id,
                'property_title' => $offer->property->title,
                'message' => $request->user()->name . ' sent a message regarding ' . $offer->property->title,
            ],
        ]);

        return response()->json($offer->load('messages.user:id,name'));
    }

    
    public function update(Request $request, Offer $offer)
    {
        $this->authorize('manage', $offer->property);

        $data = $request->validate([
            'status' => ['required', Rule::in(['pending', 'accepted', 'rejected', 'countered'])],
        ]);

        $offer->update($data);

        
        if ($data['status'] !== 'pending') {
            Notification::create([
                'user_id' => $offer->client_id,
                'type' => 'offer_' . $data['status'],
                'data' => [
                    'property_id' => $offer->property->id,
                    'property_title' => $offer->property->title,
                    'message' => 'Your request on ' . $offer->property->title . ' was ' . $data['status'],
                ],
            ]);
        }

        return response()->json($offer);
    }
}
