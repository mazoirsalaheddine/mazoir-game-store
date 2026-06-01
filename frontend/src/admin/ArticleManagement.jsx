import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

function ArticleManagement() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminArticles();
  }, []);

  const fetchAdminArticles = async () => {
    const token = localStorage.getItem("token");
    try {
      // عيطنا للرابط المحمي ديال الأدمن
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

  // دالة حذف المقال
  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المقال نهائياً؟")) {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`http://127.0.0.1:8000/api/articles/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("تم حذف المقال!");
        // تحديث القائمة فـ البلاصة
        setArticles(articles.filter(article => article.id !== id));
      } catch (error) {
        toast.error("فشل في حذف المقال.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <Toaster />
      <div style={styles.header}>
        <h2>🛠️ إدارة وتسيير المقالات</h2>
        <Link to="/admin/add-article" style={styles.addBtn}>+ إضافة مقال جديد</Link>
      </div>

      {loading ? (
        <p>جاري التحميل...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr style={styles.thRow}>
              <th style={styles.th}>العنوان</th>
              <th style={styles.th}>الحالة</th>
              <th style={styles.th}>تاريخ الإنشاء</th>
              <th style={styles.th}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} style={styles.tr}>
                <td style={styles.td}>{article.title}</td>
                <td style={styles.td}>
                  {/* شارة ملونة تبين واش منشور ولا مسودة */}
                  <span style={article.images === "published" ? styles.publishedBadge : styles.draftBadge}>
                    {article.images === "published" ? "منشور 🟢" : "مسودة 🟡"}
                  </span>
                </td>
                <td style={styles.td}>{new Date(article.created_at).toLocaleDateString("ar-MA")}</td>
                <td style={styles.td}>
                  <Link to={`/admin/edit-article/${article.id}`} style={styles.editLink}>تعديل 📝</Link>
                  <button onClick={() => handleDelete(article.id)} style={styles.deleteBtn}>حذف ❌</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "900px", margin: "40px auto", padding: "20px", direction: "rtl", fontFamily: "sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  addBtn: { background: "#1877f2", color: "#fff", padding: "10px 15px", borderRadius: "6px", textDecoration: "none", fontWeight: "bold" },
  table: { width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" },
  thRow: { background: "#f4f6f8", textAlign: "right" },
  th: { padding: "12px", borderBottom: "2px solid #eaeaea", color: "#333" },
  tr: { borderBottom: "1px solid #eaeaea" },
  td: { padding: "12px", color: "#555" },
  publishedBadge: { background: "#e2f9e1", color: "#28a745", padding: "4px 8px", borderRadius: "4px", fontSize: "13px", fontWeight: "bold" },
  draftBadge: { background: "#fff3cd", color: "#856404", padding: "4px 8px", borderRadius: "4px", fontSize: "13px", fontWeight: "bold" },
  editLink: { marginLeft: "15px", color: "#007bff", textDecoration: "none", fontSize: "14px" },
  deleteBtn: { background: "none", border: "none", color: "#dc3545", cursor: "pointer", fontSize: "14px" }
};

export default ArticleManagement;