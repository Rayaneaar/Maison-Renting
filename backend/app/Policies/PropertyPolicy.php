<?php

namespace App\Policies;

use App\Models\Property;
use App\Models\User;

class PropertyPolicy
{
    public function manage(User $user, Property $property): bool
    {
        return $user->id === $property->user_id;
    }
}
