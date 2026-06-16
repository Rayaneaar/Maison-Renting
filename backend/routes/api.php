<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\PropertyController;
use Illuminate\Support\Facades\Route;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/properties', [PropertyController::class, 'index']);
Route::get('/properties/{property}', [PropertyController::class, 'show']);
Route::get('/users/{user}', [App\Http\Controllers\UserController::class, 'show']);


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    
    Route::post('/properties/{property}/offers', [OfferController::class, 'store']);
    Route::get('/my/requests', [OfferController::class, 'sent']);

    
    Route::get('/my/properties', [PropertyController::class, 'mine']);
    Route::post('/properties', [PropertyController::class, 'store']);
    Route::post('/properties/{property}', [PropertyController::class, 'update']); 
    Route::put('/properties/{property}', [PropertyController::class, 'update']);
    Route::delete('/properties/{property}', [PropertyController::class, 'destroy']);

    
    Route::get('/my/analytics', [DashboardController::class, 'analytics']);

    
    Route::get('/my/offers', [OfferController::class, 'received']);
    Route::patch('/offers/{offer}', [OfferController::class, 'update']);
    Route::post('/offers/{offer}/reply', [OfferController::class, 'reply']);
});


Route::middleware('auth:sanctum')->group(function () {
    
    Route::get('/notifications', [App\Http\Controllers\NotificationController::class, 'index']);
    Route::post('/notifications/{notification}/read', [App\Http\Controllers\NotificationController::class, 'markAsRead']);
    
    
    Route::get('/wishlist', [App\Http\Controllers\WishlistController::class, 'index']);
    Route::post('/wishlist/{property}', [App\Http\Controllers\WishlistController::class, 'toggle']);
});
