<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\PasswordController;

// Profile & account management
Route::middleware('auth:sanctum')->group(function () {
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/password', [PasswordController::class, 'update']);
    Route::delete('/user', [ProfileController::class, 'destroy']);
});
