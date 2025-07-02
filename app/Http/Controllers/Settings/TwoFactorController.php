<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use PragmaRX\Google2FA\Google2FA;

class TwoFactorController extends Controller
{
    /**
     * Enable two-factor authentication for the user.
     *
     * This method generates a new secret and a QR code SVG.
     */
    public function enable(Request $request)
    {
        $google2fa = new Google2FA();
        $user = $request->user();

        // Generate a new secret key for the user
        $secret = $google2fa->generateSecretKey();
        $user->google2fa_secret = $secret;
        $user->save();

        // Generate the QR code SVG
        $qrCodeUrl = $google2fa->getQRCodeUrl(
            config('app.name'),
            $user->email,
            $user->google2fa_secret
        );

        $qrCodeSvg = (new \BaconQrCode\Writer(
            new \BaconQrCode\Renderer\ImageRenderer(
                new \BaconQrCode\Renderer\RendererStyle\RendererStyle(400),
                new \BaconQrCode\Renderer\Image\SvgImageBackEnd()
            )
        ))->writeString($qrCodeUrl);

        return response()->json([
            'secret' => $secret,
            'qrCodeSvg' => $qrCodeSvg,
        ]);
    }

    /**
     * Confirm and activate two-factor authentication.
     */
    public function confirm(Request $request)
    {
        $request->validate([
            'code' => ['required', 'string'],
        ]);

        $google2fa = new Google2FA();
        $user = $request->user();

        // Verify the code is correct
        $isValid = $google2fa->verifyKey($user->google2fa_secret, $request->input('code'));

        if (!$isValid) {
            throw ValidationException::withMessages([
                'code' => 'The verification code is invalid. Please try again.',
            ]);
        }

        // Mark 2FA as enabled
        $user->google2fa_enabled = true;
        $user->save();

        return redirect()->back()->with('status', 'two-factor-authentication-enabled');
    }

    /**
     * Disable two-factor authentication for the user.
     */
    public function disable(Request $request)
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();
        $user->google2fa_enabled = false;
        $user->google2fa_secret = null; // Clear the secret for security
        $user->save();

        return redirect()->back()->with('status', 'two-factor-authentication-disabled');
    }
}
