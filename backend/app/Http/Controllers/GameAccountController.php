<?php

namespace App\Http\Controllers;

use App\Models\GameAccount;
use Illuminate\Http\Request;

class GameAccountController extends Controller
{

// ----------------------------------------------------------
    public function store(Request $request)
    {
        // التحقق من البيانات القادمة من الـ React
        $request->validate([
            'game_name'   => 'required|string',
            'whatsapp'    => 'required|string', // تغيير من category إلى whatsapp
            'description' => 'required|string',
            'price'       => 'required|numeric',
            'images'      => 'required|array', // التأكد من إرسال مصفوفة صور
            'images.*'    => 'image|mimes:jpeg,png,jpg,webp|max:2048' // التحقق من كل صورة داخل المصفوفة
        ]);

        $imagePaths = [];

        // التعامل مع الصور المرفوعة عبر الـ FormData (images[])
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('accounts', 'public');
                $imagePaths[] = $path;
            }
        }

        // إنشاء السجل في قاعدة البيانات
        $account = GameAccount::create([
            'game_name'   => $request->game_name,
            'whatsapp'    => $request->whatsapp, // حفظ رقم الواتساب
            'description' => $request->description,
            'price'       => $request->price,
            'images'      => $imagePaths, // ستحول تلقائيا لـ JSON إذا وضعت casts في الموديل
            'status'      => 'available',
            'created_by'  => 1, // مؤقتاً نستخدم ID 1 حتى تربط نظام الحماية
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Account created successfully!',
            'data'    => $account
        ], 201);
    }

// ----------------------------------------------------------
    public function index()
    {
        return response()->json(GameAccount::orderBy('created_at', 'desc')->get());
    }

// ----------------------------------------------------------
    public function destroy($id)
    {
        // التأكد من أن المستخدم هو أدمن
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'غير مسموح لك بالقيام بهذه العملية'], 403);
        }

        $account = GameAccount::findOrFail($id);
        $account->delete();

        return response()->json(['message' => 'تم الحذف بنجاح']);
    }


// ----------------------------------------------------------
    public function show($id)
    {
        $account = GameAccount::find($id);

        if (!$account) {
            return response()->json(['message' => 'الحساب غير موجود'], 404);
        }

        // لارايفل كتحول الـ JSON تلقائياً لمصفوفة يلا كنتي مداير ليها cast في الموديل
        return response()->json($account, 200);
    }

// ----------------------------------------------------------
   public function toggleLike(Request $request, $id)
    {
        try {
            $account = GameAccount::find($id);
            if (!$account) {
                return response()->json(['message' => 'العرض غير موجود'], 404);
            }

            // غادين نعتمدو على الـ IP كـ معرف فريد للمستخدم يلا مكانش مسجل
            $userIp = $request->ip();
            
            // هنا غادين نخدمو بـ الـ Session أو جدول منفصل مستقبلاً،
            // ولكن كحل سريع وذكي دابا غانخلو لارايفل يتعامل مع الـ Toggle ف الفرونت إند
            // ونقادو الدالة تزيد أو تنقص على حساب شنو صيفط لينا الـ React:
            
            $action = $request->input('action'); // 'like' أو 'unlike'

            if ($action === 'like') {
                $account->increment('likes_count');
            } elseif ($action === 'unlike' && $account->likes_count > 0) {
                $account->decrement('likes_count');
            }

            return response()->json([
                'success' => true,
                'likes_count' => $account->likes_count
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error_message' => $e->getMessage()
            ], 500);
        }
    }

}