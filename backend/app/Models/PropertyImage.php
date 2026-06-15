<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class PropertyImage extends Model
{
    protected $fillable = [
        'property_id',
        'path',
        'is_primary',
    ];

    protected $appends = ['url'];

    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
        ];
    }

    public function getUrlAttribute(): string
    {
        // Allow external seed URLs to pass through unchanged.
        if (str_starts_with($this->path, 'http')) {
            return $this->path;
        }

        return Storage::url($this->path);
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }
}
