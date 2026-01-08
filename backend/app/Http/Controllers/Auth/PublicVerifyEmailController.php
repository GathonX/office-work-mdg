<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class PublicVerifyEmailController extends Controller
{
    public function __invoke(Request $request, $id, $hash)
    {
        if (! URL::hasValidSignature($request)) {
            return response()->json(['message' => 'Invalid or expired verification link'], 403);
        }

        $user = User::findOrFail($id);

        if (! hash_equals((string) $hash, sha1($user->email))) {
            return response()->json(['message' => 'Invalid verification hash'], 403);
        }

        if (! $user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
            event(new Verified($user));
        }

        // Determine SPA redirect target (prefer dev frontend origins)
        $origins = array_filter(array_map('trim', explode(',', env('FRONTEND_ORIGINS', ''))));
        $preferred = null;
        foreach ($origins as $o) {
            if (preg_match('/(localhost|127\\.0\\.0\\.1|192\\.168\\.)/', $o) && preg_match('/:(5173|8080)/', $o)) {
                $preferred = $o; break;
            }
        }
        $base = $preferred ?? ($origins[0] ?? env('APP_URL', '/'));
        $redirect = rtrim($base, '/') . '/login?verified=1';

        if ($request->expectsJson() || $request->wantsJson()) {
            return response()->json(['message' => 'Email verified']);
        }

        return redirect()->away($redirect);
    }
}
