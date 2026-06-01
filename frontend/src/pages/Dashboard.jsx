import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(response.data);
    } catch (error) {
      console.error(error);
      toast.error("فشل في تحميل بيانات لوحة التحكم.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p style={styles.loading}>جاري تحميل لوحة التحكم الإدارية...</p>;

  return (
    <div style={styles.container}>
      <Toaster />
      <h1 style={styles.title}>🛠️ لوحة التحكم الإدارية (Dashboard)</h1>
      <p style={styles.subtitle}>مرحباً بك مجدداً، إليك تقرير شامل عن نشاط الموقع اليوم.</p>

      {/* 📊 بطاقات الإحصائيات السريعة */}
      <div style={styles.statsGrid}>
        <div style={{ ...styles.card, borderRight: "5px solid #1877f2" }}>
          <h3>👥 إجمالي المستخدمين</h3>
          <p style={styles.statNumber}>{data?.stats?.total_users}</p>
        </div>
        <div style={{ ...styles.card, borderRight: "5px solid #22c55e" }}>
          <h3>🎮 الحسابات المعروضة</h3>
          <p style={styles.statNumber}>{data?.stats?.total_accounts}</p>
        </div>
        <div style={{ ...styles.card, borderRight: "5px solid #ffc107" }}>
          <h3>📰 إجمالي الأخبار</h3>
          <p style={styles.statNumber}>{data?.stats?.total_articles}</p>
        </div>
        <div style={{ ...styles.card, borderRight: "5px solid #e11d48" }}>
          <h3>💰 القيمة الإجمالية</h3>
          <p style={styles.statNumber}>{data?.stats?.total_sales} <span style={{fontSize: '16px'}}>MAD</span></p>
        </div>
      </div>

      {/* 🔗 أزرار الإجراءات السريعة (Quick Actions) */}
      <h2 style={styles.sectionTitle}>⚡ إجراءات سريعة</h2>
      <div style={styles.actionsRow}>
        <Link to="/addAccount" style={styles.actionBtn}>➕ إضافة حساب لعبة</Link>
        <Link to="/admin/add-article" style={styles.actionBtn}>✍️ نشر خبر جديد</Link>
        <Link to="/admin/articles" style={styles.actionBtn}>⚙️ إدارة المقالات (Drafts)</Link>
      </div>

      {/* 📑 جداول البيانات الأخيرة */}
      <div style={styles.tablesGrid}>
        
        {/* جدول حسابات الألعاب الأخيرة */}
        <div style={styles.tableCard}>
          <h3>🎮 آخر الحسابات المضافة</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>العنوان / اللعبة</th>
                <th>الثمن</th>
              </tr>
            </thead>
            <tbody>
              {data?.recent_accounts?.map(acc => (
                <tr key={acc.id}>
                  <td>{acc.title || acc.game_name}</td>
                  <td style={{color: '#22c55e', fontWeight: 'bold'}}>{acc.price} MAD</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* جدول الأخبار الأخيرة */}
        <div style={styles.tableCard}>
          <h3>📰 آخر المقالات المكتوبة</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>العنوان</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {data?.recent_articles?.map(art => (
                <tr key={art.id}>
                  <td>{art.title}</td>
                  <td>
                    <span style={art.images === 'published' ? styles.badgeSuccess : styles.badgeWarning}>
                      {art.images === 'published' ? 'منشور' : 'مسودة'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

// 🎨 الستيلات لضمان شكل احترافي متناسق مع باقي الصفحات
const styles = {
  container: { maxWidth: "1100px", margin: "40px auto", padding: "0 20px", direction: "rtl", fontFamily: "Segoe UI, sans-serif" },
  title: { color: "#1e293b", marginBottom: "5px" },
  subtitle: { color: "#64748b", marginBottom: "30px" },
  loading: { textAlign: "center", marginTop: "100px", fontSize: "18px" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "40px" },
  card: { background: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" },
  statNumber: { fontSize: "32px", fontWeight: "bold", color: "#1e293b", marginTop: "10px" },
  sectionTitle: { color: "#1e293b", fontSize: "20px", marginBottom: "15px" },
  actionsRow: { display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "40px" },
  actionBtn: { background: "#1e293b", color: "#fff", padding: "12px 20px", borderRadius: "6px", textDecoration: "none", fontWeight: "600", fontSize: "15px", transition: "0.2s" },
  tablesGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "30px" },
  tableCard: { background: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" },
  table: { width: "100%", borderCollapse: "collapse", marginTop: "15px" },
  badgeSuccess: { background: "#dcfce7", color: "#15803d", padding: "3px 8px", borderRadius: "4px", fontSize: "13px", fontWeight: "bold" },
  badgeWarning: { background: "#fef9c3", color: "#a16207", padding: "3px 8px", borderRadius: "4px", fontSize: "13px", fontWeight: "bold" }
};

// ستايل إضافي للجداول لتبدو نظيفة
const css = `
  table th, table td { padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-size: 15px; }
  table tr:hover { background: #f8fafc; }
  a:hover { opacity: 0.9; }
`;
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = css;
  document.head.appendChild(styleSheet);
}

export default Dashboard;