<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Article; // جدول المقالات
// افترضت أن هادو هما أسماء الـ Models ديال الألعاب والحسابات عندك:
use App\Models\GameAccount; 

class DashbordController extends Controller
{

// ----------------------------------------------------------
    public function dashboard()
    {
        // 1. جلب الإحصائيات العامة
        $totalUsers = User::count();
        $totalArticles = Article::count();
        $totalAccounts = GameAccount::count();
        // إحصائيات خاصة بحسابات الألعاب (مثلاً إجمالي الأرباح المتوقعة بالـ MAD)
        $totalSalesVolume = GameAccount::sum('price'); 
        // 2. جلب آخر الحسابات لي تضافوا للموقع مؤخراً
        $recentAccounts = GameAccount::latest()->take(5)->get();
        // 3. جلب آخر المقالات (الأخبار) لي تضافوا
        $recentArticles = Article::latest()->take(5)->get();

        return response()->json([
            'stats' => [
                'total_users' => $totalUsers,
                'total_articles' => $totalArticles,
                'total_accounts' => $totalAccounts,
                'total_sales' => $totalSalesVolume,
            ],
            'recent_accounts' => $recentAccounts,
            'recent_articles' => $recentArticles
        ], 200);
    }
}