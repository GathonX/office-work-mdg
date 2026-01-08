<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NotificationController;

// System and health endpoints
Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});

// Notifications API (authenticated)
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllRead']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markRead']);
});
