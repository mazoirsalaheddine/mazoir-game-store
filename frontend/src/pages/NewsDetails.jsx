import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function NewsDetails() {
  const { slug } = useParams(); // جلب الـ slug من الرابط
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/articles/${slug}`)
      .then(res => {
        setArticle(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>جاري تحميل المقال...</p>;
  if (!article) return <p style={{ textAlign: "center", marginTop: "50px" }}>المقال غير موجود ❌</p>;

  return (
    <div style={styles.container}>
      <Link to="/news" style={styles.backLink}>← العودة للأخبار</Link>
      
      <h1 style={styles.title}>{article.title}</h1>
      
      <div style={styles.meta}>
        <span>👤 الكاتب: {article.creator?.name}</span> | 
        <span>📅 نشر في: {new Date(article.created_at).toLocaleDateString("ar-MA")}</span>
      </div>

      {article.image && <img src={article.image} alt={article.title} style={styles.img} />}

      <div style={styles.content}>
        {/* whiteSpace: "pre-wrap" ضرورية باش تحافظ على الـ سطور لي هبط فيها الأدمن فـ التكست */}
        <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.8" }}>{article.content}</p>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: "800px", margin: "40px auto", padding: "0 20px", direction: "rtl", fontFamily: "Segoe UI, sans-serif" },
  backLink: { color: "#1877f2", textDecoration: "none", fontWeight: "bold" },
  title: { fontSize: "32px", color: "#111", marginTop: "20px" },
  meta: { color: "#65676B", fontSize: "14px", margin: "10px 0 20px 0" },
  img: { width: "100%", borderRadius: "12px", marginBottom: "25px" },
  content: { fontSize: "18px", color: "#222" }
};

export default NewsDetails;