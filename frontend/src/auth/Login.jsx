import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast"; // استيراد التنبيهات
import "./login.css";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // مسح الخطأ عند الكتابة
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login", form);
      // ✅ نجاح تسجيل الدخول
      toast.success("✅ تم تسجيل الدخول بنجاح! جاري تحويلك...");
      // تخزين بيانات المستخدم والتوكن
      localStorage.setItem("user", JSON.stringify(res.data.user));
      // إذا كان الباكيند يرسل Token، يفضل تخزينه أيضاً
      if(res.data.token) localStorage.setItem("token", res.data.token);
      setTimeout(() => {
        navigate("/");
        window.location.reload(); // لتحديث الحالة العامة للموقع (Header مثلاً)
      }, 1500);

    } catch (err) {
      if (err.response) {
        if (err.response.status === 422) {
          setErrors(err.response.data.errors);
          toast.error("❌ يرجى التأكد من البيانات المدخلة");
        } else if (err.response.status === 401) {
          toast.error("❌ البريد الإلكتروني أو كلمة المرور غير صحيحة");
        } else {
          toast.error("❌ حدث خطأ في السيرفر");
        }
      } else {
        toast.error("❌ فشل الاتصال بالإنترنت");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Toaster position="top-center" />
      
      <div className="login-card">
        <h2 className="login-title">تسجيل الدخول</h2>
        <p className="login-subtitle">مرحباً بك مجدداً! قم بالدخول لحسابك</p>

        <form className="login-form" onSubmit={handleSubmit}>
          
          <div className="input-group">
            <label>البريد الإلكتروني</label>
            <input
              className={`login-input ${errors.email ? "input-error" : ""}`}
              type="email"
              name="email"
              placeholder="example@mail.com"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.email && <span className="error-text">{errors.email[0]}</span>}
          </div>

          <div className="input-group">
            <label>كلمة المرور</label>
            <input
              className={`login-input ${errors.password ? "input-error" : ""}`}
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.password && <span className="error-text">{errors.password[0]}</span>}
          </div>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "جاري الدخول..." : "دخول"}
          </button>

          <div className="login-footer">
            <span>ليس لديك حساب؟</span>
            <button type="button" onClick={() => navigate("/register")} className="link-btn">
              إنشاء حساب جديد
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;