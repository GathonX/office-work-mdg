<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\PublicVerifyEmailController;
use App\Http\Controllers\Auth\PublicResendVerificationController;

// Authentication (Sanctum, cookie-based)
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/register', [RegisteredUserController::class, 'store']);

// Password reset (public)
Route::post('/forgot-password', [PasswordResetLinkController::class, 'store']);
Route::post('/reset-password', [NewPasswordController::class, 'store']);

// Email verification link (public, signed)
Route::get('/email/verify/{id}/{hash}', PublicVerifyEmailController::class)
    ->middleware(['signed', 'throttle:6,1'])
    ->name('verification.verify');

// Public resend verification email (by email)
Route::post('/email/resend-verification', [PublicResendVerificationController::class, 'store'])
    ->middleware(['throttle:6,1']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);

    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });

    Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store']);

    // Confirm password (protected)
    Route::post('/confirm-password', [ConfirmablePasswordController::class, 'store']);
});
