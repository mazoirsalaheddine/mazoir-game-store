import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import "./AddArticle.css"; // استيراد الـ CSS من الملف الجديد

function AddArticle() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("published"); 
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
    formData.append("images", status); 
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
      navigate("/news"); 
    } catch (error) {
      toast.error("حدث خطأ أثناء الحفظ.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-article-container">
      <Toaster />
      <h2>✍️ إنشاء مقال جديد</h2>
      <form onSubmit={handlePublish} className="article-form">
        <input 
          type="text" 
          placeholder="عنوان المقال..." 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          className="form-input" 
        />
        
        <textarea 
          placeholder="محتوى المقال..." 
          value={content} 
          onChange={e => setContent(e.target.value)} 
          className="form-textarea" 
        />
        
        <div className="form-row">
          <label>صورة المقال: </label>
          <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />
        </div>

        <div className="form-row">
          <label>حالة النشر: </label>
          <select value={status} onChange={e => setStatus(e.target.value)} className="form-select">
            <option value="published">منشور (Published)</option>
            <option value="draft">مسودة (Draft)</option>
          </select>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "جاري الحفظ..." : "حفظ المقال"}
        </button>
      </form>
    </div>
  );
}

export default AddArticle;