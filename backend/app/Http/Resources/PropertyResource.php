<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PropertyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => (float) $this->price,
            'type' => $this->type,
            'status' => $this->status,
            'bedrooms' => $this->bedrooms,
            'bathrooms' => $this->bathrooms,
            'area' => $this->area,
            'address' => $this->address,
            'city' => $this->city,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'views_count' => $this->views_count,
            'video_url' => $this->video_url,
            'available_from' => $this->available_from?->format('Y-m-d'),
            'available_to' => $this->available_to?->format('Y-m-d'),
            'created_at' => $this->created_at,
            'images' => $this->whenLoaded('images', fn () => $this->images->map(fn ($img) => [
                'id' => $img->id,
                'url' => $img->url,
                'is_primary' => $img->is_primary,
            ])),
            'primary_image' => $this->whenLoaded('images', fn () => optional(
                $this->images->firstWhere('is_primary', true) ?? $this->images->first()
            )->url),
            'owner' => $this->whenLoaded('owner', fn () => [
                'id' => $this->owner->id,
                'name' => $this->owner->name,
                'email' => $this->owner->email,
                'phone' => $this->owner->phone,
                'rating' => $this->owner->reviews ? round($this->owner->reviews->avg('rating'), 1) : null,
                'reviews_count' => $this->owner->reviews ? $this->owner->reviews->count() : 0,
                'reviews' => $this->whenLoaded('owner.reviews', fn () => $this->owner->reviews->map(fn ($r) => [
                    'id' => $r->id,
                    'reviewer_name' => $r->reviewer_name,
                    'rating' => $r->rating,
                    'comment' => $r->comment,
                    'date' => $r->created_at->format('M Y'),
                ])),
                'other_properties' => $this->whenLoaded('owner.properties', fn () => $this->owner->properties->where('id', '!=', $this->id)->take(3)->values()->map(fn ($p) => [
                    'id' => $p->id,
                    'slug' => $p->slug,
                    'title' => $p->title,
                    'price' => (float) $p->price,
                    'type' => $p->type,
                    'primary_image' => optional($p->images->firstWhere('is_primary', true) ?? $p->images->first())->url,
                ])),
            ]),
            'offers_count' => $this->whenCounted('offers'),
            'booked_dates' => $this->when(isset($this->booked_dates), $this->booked_dates),
        ];
    }
}
