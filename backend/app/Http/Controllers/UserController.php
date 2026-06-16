<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    
    public function show(User $user)
    {
        
        if ($user->isSeller()) {
            $user->load([
                'properties' => fn($q) => $q->where('status', 'available')->with('images'),
                'reviews'
            ]);
            
            
            $user->average_rating = $user->reviews->avg('rating');
            $user->reviews_count = $user->reviews->count();
        }

        
        return response()->json($user);
    }
}
