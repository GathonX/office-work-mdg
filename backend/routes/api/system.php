<?php

use Illuminate\Support\Facades\Route;

// System and health endpoints
Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});
