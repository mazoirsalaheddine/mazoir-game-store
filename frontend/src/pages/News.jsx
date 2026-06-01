import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import "./news.css"; // استيراد الستيلات الجديدة هنا

function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = "http://127.0.0.1:8000/api";

  // جلب بيانات المستخدم لمعرفة واش هو أدمن
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const isAdmin = user && user.role === "admin";

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/articles`);
      setArticles(response.data);
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error("فشل في جلب الأخبار.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="news-container">
      <Toaster position="top-center" />
      
      <h2 className="news-page-title">📰 آخر الأخبار والمستجدات</h2>

      <div className="articles-list">
        {loading ? (
          <p style={{ textAlign: "center" }}>جاري تحميل الأخبار...</p>
        ) : articles.length === 0 ? (
          <p style={{ textAlign: "center", color: "#65676B" }}>لا توجد أخبار منشورة حالياً.</p>
        ) : (
          articles.map((article) => (
            <div key={article.id} className="article-card">
              
              {/* صورة المقال */}
              {article.image && (
                <div className="article-image-container">
                  <img src={article.image} alt={article.title} className="article-image" />
                </div>
              )}

              <div className="card-body">
                <h3 className="article-title">{article.title}</h3>
                
                <div className="meta-info">
                  <span>👤 بقلم: {article.creator?.name || "المدير"}</span>
                  <span>📅 {new Date(article.created_at).toLocaleDateString("ar-MA")}</span>
                </div>

                <p className="article-excerpt">
                  {article.content.substring(0, 150)}...
                </p>

                <Link to={`/news/${article.slug}`} className="read-more-btn">
                  إقرأ المقال كاملاً ←
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 🔐 حماية الزر: غايبان فقط وحصرياً يلا كان الـ isAdmin كايساوي true */}
      {isAdmin && (
        <Link to="/admin/add-article" className="floating-admin-btn" title="إضافة مقال جديد">
          +
        </Link>
      )}
    </div>
  );
}

export default News;