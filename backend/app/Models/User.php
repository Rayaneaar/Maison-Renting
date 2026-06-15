<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'avatar',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isSeller(): bool
    {
        return $this->role === 'seller';
    }

    public function isClient(): bool
    {
        return $this->role === 'client';
    }

    public function properties(): HasMany
    {
        return $this->hasMany(Property::class);
    }

    public function offers(): HasMany
    {
        return $this->hasMany(Offer::class, 'client_id');
    }

    public function wishlist(): BelongsToMany
    {
        return $this->belongsToMany(Property::class, 'wishlists', 'user_id', 'property_id')->withTimestamps();
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(SellerReview::class);
    }
}
