<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->wishlist()->with('images')->get();
    }

    public function toggle(Request $request, Property $property)
    {
        $request->user()->wishlist()->toggle($property->id);
        return response()->json(['message' => 'Toggled']);
    }
}
