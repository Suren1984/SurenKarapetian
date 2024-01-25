<?php

namespace App\Http\Controllers\BodyMotion;

use App\Models\User;
use App\Traits\ApiResponser;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    use ApiResponser;

    public function register(Request $request)
    {
        $attr = $request->validate([
            'name' => 'required|string|max:255',
            'workplace' => 'string|max:255',
            'email' => 'required|string|max:255',
            'password' => 'required|string|min:6|max:255|confirmed'
        ]);

        $user = User::create([
            'name' => $attr['name'],
            'workplace' => $attr['workplace'],
            'email' => $attr['email'],
            'password' => bcrypt($attr['password'])
        ]);

        return response()->json([
            'token' => $user->createToken('API Token')->plainTextToken
        ]);
    }

    public function login(Request $request)
    {
        $attr = $request->validate([
            'email' => 'required|string|max:50',
            'password' => 'required|string|min:6'
        ]);

        if (!Auth::attempt($attr)) {
            return response()->json([
                'message' => 'Credentials not match'
            ], 401);
        }

        return response()->json([
            'token' => auth()->user()->createToken('API Token')->plainTextToken
        ]);
    }

    public function logout()
    {
        Auth::user()->currentAccessToken()->delete();

        return response()->json(null, 204);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'old_password' => ['required', 'string'],
            'new_password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        if(!Hash::check($request->old_password, Auth::user()->password)) {
            return response()->json([
                'message' => 'Given old password is incorrect'
            ], 401);
        }

        $user = Auth::user();
        $user->password = bcrypt($request->new_password);
        $user->save();

        return response()->json(null, 204);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        return $status === Password::RESET_LINK_SENT
            ? response()->json(["message" => "Success"])
            : response()->json(["message" => "Error"], 500);
    }

    public function resetPassword(Request $request) {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|max:255|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));

                DB::transaction(function () use ($user)
                {
                    $user->save();
                    $user->tokens()->delete();
                });

                event(new PasswordReset($user));
            }
        );

        return $status === Password::PASSWORD_RESET
            ? response()->json(["message" => "Success"])
            : response()->json(["message" => "Error"], 500);
    }
}
