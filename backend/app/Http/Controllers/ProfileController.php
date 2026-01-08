<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redirect;
use Illuminate\View\View;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): View
    {
        return view('profile.edit', [
            'user' => $request->user(),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request)
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'profile-updated',
                'user' => $request->user(),
            ]);
        }

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request)
    {
        $request->validateWithBag('userDeletion', [
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        // Use session guard to properly logout in stateful Sanctum (cookie-based)
        Auth::guard('web')->logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        if ($request->expectsJson()) {
            return response()->json(['message' => 'account-deleted']);
        }

        return Redirect::to('/');
    }

    /**
     * Upload and set the authenticated user's avatar.
     */
    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => ['required', 'file', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'],
        ]);

        $user = $request->user();

        // Remove previous avatar if exists
        if (! empty($user->avatar_path)) {
            try { Storage::disk('public')->delete($user->avatar_path); } catch (\Throwable $e) {}
        }

        $path = $request->file('avatar')->store('avatars', 'public');
        $user->avatar_path = $path;
        $user->save();

        return response()->json([
            'message' => 'avatar-updated',
            'user' => $user->fresh(),
        ]);
    }

    /**
     * Return authenticated user's preferences (merged with defaults)
     */
    public function getPreferences(Request $request)
    {
        $defaults = [
            'theme' => 'light',
            'email_notifications' => true,
            'push_notifications' => false,
        ];
        $prefs = $request->user()->preferences ?? [];
        if (! is_array($prefs)) { $prefs = []; }
        $merged = array_merge($defaults, $prefs);
        return response()->json(['preferences' => $merged]);
    }

    /**
     * Update authenticated user's preferences
     */
    public function updatePreferences(Request $request)
    {
        $data = $request->validate([
            'theme' => ['sometimes', 'in:light,dark'],
            'email_notifications' => ['sometimes', 'boolean'],
            'push_notifications' => ['sometimes', 'boolean'],
        ]);

        $user = $request->user();
        $prefs = $user->preferences ?? [];
        if (! is_array($prefs)) { $prefs = []; }
        $new = array_merge($prefs, $data);
        $user->preferences = $new;
        $user->save();

        return response()->json([
            'preferences' => $new,
            'user' => $user->fresh(),
        ]);
    }
}
