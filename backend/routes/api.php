<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashbordController;
use App\Http\Controllers\GameAccountController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\ContactController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| هنا كيتم تعريف كاع الـ الروابط (Routes) الخاصة بـ الـ API ديال المشروع.
|
*/

use Illuminate\Support\Facades\Artisan;

if (!file_exists(public_path('storage'))) {
    Artisan::call('storage:link');
}
// ================= 🔐 روابط الـ Authentication العامة =================
Route::post('/login', [AuthController::class, 'login_post']);
Route::post('/register', [AuthController::class, 'registration_post']);


// ================= 🛡️ الروابط المحمية (تتطلب تفعيل الـ Token) =================
Route::middleware('auth:sanctum')->group(function() {

    // جلب بيانات المستخدم الحالي
    Route::get('/user', [AuthController::class, 'user']);
    
    // 📊 رابط لوحة التحكم (Dashboard) - غايجيب الإحصائيات لـ React
    Route::get('/admin/dashboard', [DashbordController::class, 'dashboard']);
    
    // روابط التحكم فـ حسابات الألعاب المحمية
    Route::get('/store', [GameAccountController::class, 'store']);
    Route::delete('/game-accounts/{id}', [GameAccountController::class, 'destroy']);
    

    // 📰 روابط إدارة الأخبار (خاص بالأدمن)
    Route::get('/admin/articles', [ArticleController::class, 'adminIndex']); // جلب المسودات والأخبار كاملة
    Route::post('/articles', [ArticleController::class, 'store']);          // إضافة خبر جديد
    Route::put('/articles/{id}', [ArticleController::class, 'update']);      // تعديل خبر
    Route::delete('/articles/{id}', [ArticleController::class, 'destroy']);  // حذف خبر

});


// ================= 🌍 الروابط العامة (يقدر أي زائر يشوفها بلا Token) =================

// 🎮 روابط حسابات الألعاب العامة
Route::post('/game-accounts', [GameAccountController::class, 'store']);
Route::get('/game-accounts', [GameAccountController::class, 'index']);


// 📰 روابط الأخبار العامة
Route::get('/articles', [ArticleController::class, 'index']);        // جلب المقالات المنشورة فقط لصفحة News.jsx
Route::get('/articles/{slug}', [ArticleController::class, 'show']);  // جلب مقال واحد كامل لصفحة التفاصيل




Route::get('/game-accounts/{id}', [GameAccountController::class, 'show']);

Route::post('/game-accounts/{id}/like', [GameAccountController::class, 'toggleLike']);


Route::post('/contact', [ContactController::class, 'store']);