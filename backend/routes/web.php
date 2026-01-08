<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public route used by the password reset email link
Route::get('/reset-password/{token}', function (Request $request, string $token) {
    $email = $request->query('email');

    // Determine SPA base URL from configured origins (prefer localhost dev ports)
    $origins = array_filter(array_map('trim', explode(',', env('FRONTEND_ORIGINS', ''))));
    $preferred = null;
    foreach ($origins as $o) {
        if (preg_match('/(localhost|127\.0\.0\.1|192\.168\.)/', $o) && preg_match('/:(5173|8080)/', $o)) {
            $preferred = $o; break;
        }
    }
    $base = $preferred ?? ($origins[0] ?? env('APP_URL', '/'));

    $redirect = rtrim($base, '/') . '/reset-password/' . urlencode($token);
    if (! empty($email)) {
        $redirect .= '?email=' . urlencode($email);
    }

    return redirect()->away($redirect);
})->name('password.reset');
