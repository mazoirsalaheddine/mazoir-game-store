<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use App\Mail\ForgotPasswordMail;
use Mail;

class AuthController extends Controller
{
   
// ----------------------------------------------------------
    public function registration_post(Request $request)
    {        
        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required|unique:users',
            'password' => 'required',
            'password_confirmation' => 'required_with:password|same:password',
            'avatar' => 'mimes:jpg,png,jpeg',
            'role' => 'required',
        ]);

         $avatarPath = null;

        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $request->role,
            'avatar' => $avatarPath,
        ]);

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user,
        ]);
    }


// ----------------------------------------------------------
//     public function login_post(Request $request){
//     $credentials = $request->only('email', 'password');

//     if(Auth::attempt($credentials)){
//         $user = Auth::user();
//         return response()->json([
//             'message' => 'Login successful',
//             'user' => $user
//         ], 200);
//     }

//     return response()->json([
//         'message' => 'Email or password incorrect'
//     ], 401);
// }


// ----------------------------------------------------------
    public function login_post(Request $request) {
        $fields = $request->validate([
            'email' => 'required|string',
            'password' => 'required|string'
        ]);

        $user = User::where('email', $fields['email'])->first();

        if(!$user || !Hash::check($fields['password'], $user->password)) {
            return response(['message' => 'بيانات الدخول خاطئة'], 401);
        }

        // مسح التوكنات القديمة للأمان
        $user->tokens()->delete();

        // توليد التوكن الحقيقي
        $token = $user->createToken('myapptoken')->plainTextToken;

        return response([
            'user' => $user,
            'token' => $token
        ], 200);
    }


// ----------------------------------------------------------
    public function forgot_post(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        return $status === Password::RESET_LINK_SENT
            ? back()->with('status', __($status))
            : back()->withErrors(['email' => __($status)]);
    }

// ----------------------------------------------------------
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('login');
    }

// ----------------------------------------------------------


}
