import { useState, useRef } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./register.css";

const INITIAL_FORM_STATE = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  role: "buyer",
};

function Register() {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [avatar, setAvatar] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      if (errors.avatar) setErrors((prev) => ({ ...prev, avatar: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const data = new FormData();
    Object.keys(form).forEach((key) => data.append(key, form[key]));
    if (avatar) data.append("avatar", avatar);

    try {
      await axios.post("http://127.0.0.1:8000/api/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("✅ تم التسجيل بنجاح! جاري تحويلك لصفحة الدخول...");
      
      // 3. الانتظار قليلاً لكي يرى المستخدم رسالة النجاح ثم التوجه لصفحة الـ login
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors);
        toast.error("❌ يرجى تصحيح الأخطاء");
      } else {
        toast.error("❌ حدث خطأ غير متوقع");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <Toaster />
    
      <form className="register-form" onSubmit={handleSubmit}>

        <h2 className="register-title">إنشاء حساب جديد</h2>
        <p className="login-subtitle">مرحباً بك ! قم بإنشاء حسابك</p>
        <div className="input-group">
          <input
            className={`register-input ${errors.name ? "input-error" : ""}`}
            type="text"
            name="name"
            placeholder="الاسم الكامل"
            value={form.name}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.name && <span className="error-text">{errors.name[0]}</span>}
        </div>

        <div className="input-group">
          <input
            className={`register-input ${errors.email ? "input-error" : ""}`}
            type="email"
            name="email"
            placeholder="البريد الإلكتروني"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.email && <span className="error-text">{errors.email[0]}</span>}
        </div>

        <div className="input-group">
          <input
            className={`register-input ${errors.password ? "input-error" : ""}`}
            type="password"
            name="password"
            placeholder="كلمة المرور"
            value={form.password}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.password && <span className="error-text">{errors.password[0]}</span>}
        </div>

        <div className="input-group">
          <input
            className="register-input"
            type="password"
            name="password_confirmation"
            placeholder="تأكيد كلمة المرور"
            value={form.password_confirmation}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="input-group">
          <label className="file-label">الصورة الشخصية:</label>
          <input
            className="register-input-file"
            type="file"
            name="avatar"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={loading}
            accept="image/*"
          />
          {errors.avatar && <span className="error-text">{errors.avatar[0]}</span>}
        </div>

        <div className="input-group">
          <select className="register-select" name="role" value={form.role} onChange={handleChange} disabled={loading}>
            <option value="buyer">Buyer (مشتري)</option>
            <option value="admin">Admin (مدير)</option>
          </select>
        </div>

        <button className="register-btn" type="submit" disabled={loading}>
          {loading ? "جاري المعالجة..." : "تسجيل"}
        </button>
      </form>
    </div>
  );
}

export default Register;