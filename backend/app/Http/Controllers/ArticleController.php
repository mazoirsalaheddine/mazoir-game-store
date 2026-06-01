<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ArticleController extends Controller
{
    // ----------------------------------------------------------
    // 1. جلب المقالات المنشورة فقط (لي كيرجعها لـ News.jsx)
    public function index()
    {
        // تأكدنا بلي الحقل سميتو 'images' وقيمتو 'published' كيفما عندك فـ الـ migration
        $articles = Article::where('images', 'published')
                           ->latest() 
                           ->get();
                           
        return response()->json($articles, 200);
    }


    // ----------------------------------------------------------
    // 2. دالة حفظ المقال الجديد (store)
    public function store(Request $request)
    {
        $request->validate([
            'title'   => 'required|string|max:255',
            'content' => 'required|string',
            'images'  => 'required|in:published,draft', // هادي حالة النشر واش published ولا draft
            'image'   => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048' // هادي الصورة
        ]);

        $article = new Article();
        $article->title = $request->title;    
        // توليد الـ slug أوتوماتيكياً من العنوان باش يخدم الرابط فـ React
        $article->slug = Str::slug($request->title) . '-' . time();         
        $article->content = $request->content;        
        // هنا الـ Enum لي عندك فـ الـ Migration سميتو images
        $article->images = $request->images;         
        // الـ Admin لي مسجل الدخول دابا
        $article->created_by = auth()->id() ?? 1; // إيلا ماكانش الـ auth واجد ديريكت، كيدير ID 1 مؤقتاً لحين تجريب الـ Token
        // رفع الصورة إيلا كانت كاينا
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('articles', 'public');
            $article->image = asset('storage/' . $path);
        }
        $article->save();
        return response()->json([
            'message' => 'تم حفظ المقال بنجاح!',
            'article' => $article
        ], 201);
    }

    
    // ----------------------------------------------------------
    // 3. جلب مقال واحد بالـ slug (لصفحة التفاصيل)
    public function show($slug)
    {
        $article = Article::where('slug', $slug)->firstOrFail();
        return response()->json($article, 200);
    }
    

    // ----------------------------------------------------------
    // 1. جلب كاع المقالات (Published + Draft) خاصة بـ الأدمن
    public function adminIndex()
    {
        // كيجيب كلشي وتربط مع الـ Admin لي صاوب المقال
        $articles = Article::with('creator')->latest()->get();
        return response()->json($articles, 200);
    }

    // ----------------------------------------------------------
    public function destroy($id)
    {
        $article = Article::findOrFail($id);
        $article->delete();

        return response()->json(['message' => 'تم حذف المقال بنجاح!'], 200);
    }
}