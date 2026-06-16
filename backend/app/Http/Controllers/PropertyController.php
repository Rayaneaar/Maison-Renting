<?php

namespace App\Http\Controllers;

use App\Http\Resources\PropertyResource;
use App\Models\Property;
use App\Models\PropertyImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class PropertyController extends Controller
{
    
    public function index(Request $request)
    {
        $query = Property::query()
            ->with(['images', 'owner'])
            ->latest();

        if ($request->filled('city')) {
            $query->where('city', 'like', '%'.$request->string('city').'%');
        }

        if ($request->filled('q')) {
            $term = '%'.$request->string('q').'%';
            $query->where(function ($q) use ($term) {
                $q->where('title', 'like', $term)
                    ->orWhere('description', 'like', $term)
                    ->orWhere('address', 'like', $term);
            });
        }

        if ($request->filled('type')) {
            $query->where('type', $request->string('type'));
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->float('min_price'));
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->float('max_price'));
        }

        if ($request->filled('bedrooms')) {
            $query->where('bedrooms', '>=', $request->integer('bedrooms'));
        }

        return PropertyResource::collection($query->paginate(12));
    }

    
    public function show(Property $property)
    {
        $property->increment('views_count');
        $property->load([
            'images',
            'owner.reviews',
            'owner.properties.images',
        ]);

        if ($property->type === 'rent') {
            $booked = $property->offers()
                ->where('status', 'accepted')
                ->whereNotNull('start_date')
                ->whereNotNull('end_date')
                ->select('start_date', 'end_date')
                ->get();
            $property->setAttribute('booked_dates', $booked);
        }

        return new PropertyResource($property);
    }

    
    public function mine(Request $request)
    {
        $properties = $request->user()
            ->properties()
            ->with('images')
            ->withCount('offers')
            ->latest()
            ->get();

        return PropertyResource::collection($properties);
    }

    public function store(Request $request)
    {
        abort_unless($request->user()->isSeller(), 403, 'Only sellers can create listings.');

        $data = $this->validateData($request);

        $property = $request->user()->properties()->create($data);

        $this->handleImages($request, $property);

        return new PropertyResource($property->load('images'));
    }

    public function update(Request $request, Property $property)
    {
        $this->authorize('manage', $property);

        $data = $this->validateData($request);
        $property->update($data);

        $this->handleImages($request, $property);

        return new PropertyResource($property->fresh('images'));
    }

    public function destroy(Request $request, Property $property)
    {
        $this->authorize('manage', $property);

        foreach ($property->images as $image) {
            if (! str_starts_with($image->path, 'http')) {
                Storage::disk('public')->delete($image->path);
            }
        }

        $property->delete();

        return response()->json(['message' => 'Property deleted']);
    }

    private function validateData(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'type' => ['required', Rule::in(['buy', 'rent'])],
            'status' => ['nullable', Rule::in(['available', 'pending', 'sold'])],
            'bedrooms' => ['nullable', 'integer', 'min:0'],
            'bathrooms' => ['nullable', 'integer', 'min:0'],
            'area' => ['nullable', 'integer', 'min:0'],
            'address' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:120'],
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
        ]);
    }

    private function handleImages(Request $request, Property $property): void
    {
        if (! $request->hasFile('images')) {
            return;
        }

        $hasPrimary = $property->images()->where('is_primary', true)->exists();

        foreach ($request->file('images') as $file) {
            $path = $file->store('properties', 'public');
            PropertyImage::create([
                'property_id' => $property->id,
                'path' => $path,
                'is_primary' => ! $hasPrimary,
            ]);
            $hasPrimary = true;
        }
    }
}
