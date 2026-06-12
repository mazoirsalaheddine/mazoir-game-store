<?php

use Illuminate\Support\Facades\Route;

// هاد الـ Route غايبان فاش تدخل للرابط الرئيسي ديال قاعدة البيانات فـ Railway
Route::get('/test', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'Mazoir Game Store API is running perfectly!',
        'environment' => app()->environment()
    ]);
});