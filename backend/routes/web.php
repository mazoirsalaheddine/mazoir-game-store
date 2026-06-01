<?php
/*
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashbordController;
use App\Http\Controllers\GameAccountController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;


Route::get('/', function () {
    return view('pages.index');
})->name('index');

// regestretion
Route::get('/register', [AuthController::class, 'showRegister'])->name('showRegister');
Route::post('/registration_post', [AuthController::class, 'registration_post']);

// login
Route::get('/login', [AuthController::class, 'login'])->name('login');
Route::post('/login_post', [AuthController::class, 'login_post'])->name('login.post');

// logout
Route::post('/logout',[AuthController::class, 'logout'])->name('logout');


// ----------------------------- Forget Password --------------------------//
// Route::controller(ForgotPasswordController::class)->group(function () {
//     Route::post('forget-password', 'sendResetLinkEmail')->name('password.email');
// });

// // ---------------- Forget Password ---------------- //
// Route::controller(ForgotPasswordController::class)->group(function () {

//     // عرض الفورم
//     Route::get('forget-password', 'showLinkRequestForm')
//         ->name('password.request');

//     // إرسال الإيميل
//     Route::post('forget-password', 'sendResetLinkEmail')
//         ->name('password.email');
// });
// // ---------------------------- Reset Password ----------------------------//
// Route::controller(ResetPasswordController::class)->group(function () {
//     Route::get('reset-password/{token}', 'showResetForm')->name('password.reset');
//     Route::post('reset-password', 'reset')->name('password.update');
// });



Route::get('forget-password', [ForgotPasswordController::class, 'showLinkRequestForm'])->name('password.request');
Route::post('forget-password', [ForgotPasswordController::class, 'sendResetLinkEmail'])->name('password.email');

Route::get('reset-password/{token}', [ResetPasswordController::class, 'showResetForm'])->name('password.reset');
Route::post('reset-password', [ResetPasswordController::class, 'reset'])->name('password.update');

// verefication middleware
Route::group(['middleware' => 'admin'], function(){
    Route::get('admin/dashboard',[DashbordController::class,'dashboard'])->name('admin.dashboard');
});

Route::group(['middleware' => 'user'], function(){
    Route::get('pages/store',[GameAccountController::class, 'store'])->name('pages.store');
});
*/