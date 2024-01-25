<?php

namespace App\Http\Controllers\BodyMotion;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function showProfile()
    {
        $user = Auth::user();
        $user_data = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'registration_date' => $user->created_at->toDateString(),
            'is_admin' => $user->is_admin
        ];

        return response()->json($user_data);
    }

    public function indexDoctors(){
        $doctors = User::all();
        return response()->json($doctors);
    }

    public function forgottenPassword(){

    }
}
