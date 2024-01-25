<?php

namespace App\Http\Controllers\DystoniaTreatment;


use App\Mail\ResetPassword;
use App\Models\Patient;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;


class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string|min:8'
        ]);

        $credentials = $request->only('username', 'password');

        if (!Auth::guard('patients')->attempt($credentials)) {
            return response()->json([
                'message' => 'Credentials not match'
            ], 401);
        }

        return response()->json([
            'token' => auth()->guard('patients')->user()->createToken('API Token')->plainTextToken,
            'patient_id' => auth()->guard('patients')->id()
        ]);
    }

    public function logout()
    {
        Auth::guard('patients_api')->user()->currentAccessToken()->delete();

        return response()->json(null, 204);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'old_password' => ['required', 'string'],
            'new_password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = Auth::guard('patients_api')->user();

        if(!Hash::check($request->old_password, $user->password)) {
            return response()->json([
                'message' => 'Given old password is incorrect'
            ], 401);
        }

        $user->password = bcrypt($request->new_password);
        $user->save();

        return response()->json(null, 204);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:patients']);

        $patient = Patient::where('email', $request->email)->first();

        $password = Str::random(8);

        $patient->forceFill([
            'password' => bcrypt($password)
        ]);

        DB::transaction(function () use ($patient)
        {
            $patient->save();
            $patient->tokens()->delete();
        });

        $mailData = [
            'password' => $password
        ];
        Mail::to($patient)->send(new ResetPassword($mailData));

        if( count(Mail::failures()) > 0 ) {
            return response()->json(["message" => "Error"]);
        } else {
            return response()->json(["message" => "Success"], 500);
        }
    }
}
