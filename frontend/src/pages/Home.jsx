import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./home.css";

function Home() {
  // جلب معلومات المستخدم من الـ localStorage إذا كان مسجلاً
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  return (
    <div className="home-wrapper">
      {/* شبكة الخلفية (Background Grid) */}
      <div className="bg-grid"></div>
      <div className="bg-gradient-glow"></div>

      {/* HERO SECTION */}
      <header className="hero-section">
        <div className="container">
          
          {/* هنا التعديل الذكي: يلا كان مسجل كيطبع اسمو، يلا مكانش كيطبع الرسالة العادية */}
          <div className="badge-glow">
            {user ? `مرحباً بك ${user.name} في Game Store` : "Welcome To Game Store"}
          </div>
          
          <h1 className="hero-title">
            سوق الألعاب <span className="text-gradient">الأكثر موثوقية</span>
          </h1>
          <p className="hero-desc">
            اكتشف آلاف الحسابات النادرة والمميزة. نظام دفع آمن، تسليم فوري، ودعم فني على مدار الساعة.
          </p>
          <div className="hero-actions">
            <Link to="/games" className="btn-neon">تصفح المتجر</Link>
            <a 
              href="https://wa.me/212612345678" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-outline"
            >
              انضم إلينا
            </a>
          </div>
        </div>
      </header>

      {/* FEATURES GRID */}
      <section className="features-grid">
        <div className="feature-card">
          <div className="icon-box">⚡</div>
          <h3>تسليم فوري</h3>
          <p>بمجرد إتمام الدفع، تصلك بيانات الحساب مباشرة عبر بريدك.</p>
        </div>
        <div className="feature-card highlight">
          <div className="icon-box">🛡️</div>
          <h3>حماية كاملة</h3>
          <p>ضمان شامل على جميع الحسابات المباعة ضد الاسترجاع.</p>
        </div>
        <div className="feature-card">
          <div className="icon-box">💎</div>
          <h3>أسعار تنافسية</h3>
          <p>نقدم أفضل قيمة مقابل السعر في السوق العربي.</p>
        </div>
      </section>

      {/* CTA FOOTER */}
      <section className="bottom-cta">
        <div className="cta-content">
          <h2>ابدأ رحلتك الاحترافية الآن</h2>
          <p>انضم لآلاف اللاعبين الذين يثقون بـ Game Store</p>
          <a 
            href="https://wa.me/212612345678" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-neon large"
          >
            انضم إلينا
          </a>
        </div>
      </section>
    </div>
  );
}

export default Home;