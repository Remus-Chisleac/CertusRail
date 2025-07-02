<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use PragmaRX\Google2FA\Google2FA;

class TwoFactorController extends Controller
{
    /**
     * Show the two-factor authentication challenge page.
     */
    public function show()
    {
        // Ensure the user has passed the password check first
        if (! session()->has('2fa_user_id')) {
            return redirect()->route('login');
        }

        return Inertia::render('auth/two-factor-challenge');
    }

    /**
     * Verify the two-factor authentication code.
     */
    public function verify(Request $request)
    {
        $request->validate([
            'code' => ['required', 'string'],
        ]);

        $userId = session('2fa_user_id');
        $user = User::find($userId);

        if (!$user) {
            return Redirect::route('login')->withErrors(['email' => 'An error occurred. Please try again.']);
        }

        $google2fa = new Google2FA();
        $isValid = $google2fa->verifyKey($user->google2fa_secret, $request->input('code'));

        if ($isValid) {
            // Code is valid, log the user in
            Auth::login($user);
            $request->session()->regenerate();
            session()->forget('2fa_user_id'); // Clean up the session

            return redirect()->intended(route('dashboard'));
        }

        // Code is invalid, redirect back with an error
        return Redirect::back()->withErrors(['code' => 'The two-factor authentication code is invalid.']);
    }
}
