import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import "./ArticleManagement.css"; // استيراد الـ CSS من الملف الجديد

function ArticleManagement() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminArticles();
  }, []);

  const fetchAdminArticles = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/admin/articles", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setArticles(response.data);
    } catch (error) {
      toast.error("فشل في جلب المقالات الإدارية.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المقال نهائياً؟")) {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`http://127.0.0.1:8000/api/articles/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("تم حذف المقال!");
        setArticles(articles.filter(article => article.id !== id));
      } catch (error) {
        toast.error("فشل في حذف المقال.");
      }
    }
  };

  return (
    <div className="article-mgmt-container">
      <Toaster />
      <div className="article-mgmt-header">
        <h2>🛠️ إدارة وتسيير المقالات</h2>
        <Link to="/admin/add-article" className="add-article-btn">+ إضافة مقال جديد</Link>
      </div>

      {loading ? (
        <p className="loading-text">جاري التحميل...</p>
      ) : (
        <table className="mgmt-table">
          <thead>
            <tr className="mgmt-th-row">
              <th className="mgmt-th">العنوان</th>
              <th className="mgmt-th">الحالة</th>
              <th className="mgmt-th">تاريخ الإنشاء</th>
              <th className="mgmt-th">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} className="mgmt-tr">
                <td className="mgmt-td">{article.title}</td>
                <td className="mgmt-td">
                  <span className={`badge ${article.images === "published" ? "badge-published" : "badge-draft"}`}>
                    {article.images === "published" ? "منشور 🟢" : "مسودة 🟡"}
                  </span>
                </td>
                <td className="mgmt-td">{new Date(article.created_at).toLocaleDateString("ar-MA")}</td>
                <td className="mgmt-td">
                  <Link to={`/admin/edit-article/${article.id}`} className="action-edit-link">تعديل 📝</Link>
                  <button onClick={() => handleDelete(article.id)} className="action-delete-btn">حذف ❌</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ArticleManagement;