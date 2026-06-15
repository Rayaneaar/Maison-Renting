<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display the specified user profile.
     */
    public function show(User $user)
    {
        // Load relationships based on role
        if ($user->isSeller()) {
            $user->load([
                'properties' => fn($q) => $q->where('status', 'available')->with('images'),
                'reviews'
            ]);
            
            // Calculate average rating
            $user->average_rating = $user->reviews->avg('rating');
            $user->reviews_count = $user->reviews->count();
        }

        // Hide sensitive info if any, though model handles passwords.
        return response()->json($user);
    }
}
