import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function AddArticle() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("published"); // published أو draft (حسب الـ Enum لي عندك سميتو images ف الـ migration)
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error("المرجو ملء جميع الحقول الأساسية!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("images", status); // حيت فـ الـ Migration سميتي الحقل 'images' كـ enum
    if (image) formData.append("image", image);

    const token = localStorage.getItem("token");

    try {
      await axios.post("http://127.0.0.1:8000/api/articles", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        }
      });
      toast.success("تم حفظ المقال بنجاح!");
      navigate("/news"); // العودة لصفحة الأخبار
    } catch (error) {
      toast.error("حدث خطأ أثناء الحفظ.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Toaster />
      <h2>✍️ إنشاء مقال جديد</h2>
      <form onSubmit={handlePublish} style={styles.form}>
        <input type="text" placeholder="عنوان المقال..." value={title} onChange={e => setTitle(e.target.value)} style={styles.input} />
        
        <textarea placeholder="محتوى المقال..." value={content} onChange={e => setContent(e.target.value)} style={styles.textarea} />
        
        <div style={styles.row}>
          <label>صورة المقال: </label>
          <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />
        </div>

        <div style={styles.row}>
          <label>حالة النشر: </label>
          <select value={status} onChange={e => setStatus(e.target.value)} style={styles.select}>
            <option value="published">منشور (Published)</option>
            <option value="draft">مسودة (Draft)</option>
          </select>
        </div>

        <button type="submit" disabled={loading} style={styles.btn}>
          {loading ? "جاري الحفظ..." : "حفظ المقال"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: { maxWidth: "600px", margin: "40px auto", padding: "20px", background: "#fff", borderRadius: "12px", border: "1px solid #ddd", direction: "rtl", fontFamily: "sans-serif" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  input: { padding: "10px", fontSize: "16px", borderRadius: "6px", border: "1px solid #ccc" },
  textarea: { padding: "10px", fontSize: "16px", height: "200px", borderRadius: "6px", border: "1px solid #ccc", resize: "none" },
  row: { display: "flex", alignItems: "center", gap: "15px" },
  select: { padding: "8px", borderRadius: "6px" },
  btn: { padding: "12px", background: "#1877f2", color: "#fff", border: "none", borderRadius: "6px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }
};

export default AddArticle;