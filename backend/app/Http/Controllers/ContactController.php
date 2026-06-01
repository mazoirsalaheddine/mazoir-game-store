namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contact;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{

// ----------------------------------------------------------
    public function store(Request $request)
    {
        // التحقق من صحة البيانات المدخلة
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'يرجى ملء جميع الحقول بشكل صحيح.',
                'errors' => $validator->errors()
            ], 422);
        }

        // حفظ الرسالة في قاعدة البيانات
        $contact = Contact::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'تم حفظ الرسالة بنجاح!',
            'data' => $contact
        ], 201);
    }
}