import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AccountDetails.css";

function AccountDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(""); 
  
  // الإحداثيات ديال الزوم وسط الصورة
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: "center center" });

  useEffect(() => {
    axios.get(`https://mazoir-game-store-production.up.railway.app/api/game-accounts/${id}`)
      .then((res) => {
        setAccount(res.data);
        if (res.data.images && res.data.images.length > 0) {
          setActiveImage(res.data.images[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, [id]);

  // دالة تحريك الماوس وحساب مكان الزوم على السكنات
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%` });
  };

  // إرجاع الصورة للوضع الطبيعي عند خروج الماوس
  const handleMouseLeave = () => {
    setZoomStyle({ transformOrigin: "center center" });
  };

  if (loading) return <div className="loader">جاري تحميل تفاصيل الحساب...</div>;
  if (!account) return <div className="loader">⚠️ هاد الحساب مابقاش متوفر.</div>;

  // معرفة واش الحساب فيه تصويرة واحدة فقط
  const isSingleImage = account.images && account.images.length === 1;

  return (
    <div className="details-container" dir="rtl">
      <button className="back-action-btn" onClick={() => navigate("/games")}>
        ← العودة لعروض الحسابات
      </button>
      
      <div className="details-layout">
        
        {/* شق الميديا مع ميزة زوم السكنات الذكي */}
        <div className="media-gallery-section">
          {/* الكلاس الديناميكي single-image-layout كيتزاد غير يلا كانت تصويرة واحدة */}
          <div 
            className={`main-preview-viewport ${isSingleImage ? "single-image-layout" : ""}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {activeImage ? (
              <img 
                src={`http://127.0.0.1:8000/storage/${activeImage}`} 
                alt={account.game_name} 
                className="zoomable-skin-img" 
                style={zoomStyle}
              />
            ) : (
              <div className="placeholder">🎮</div>
            )}
            <div className="zoom-hint">حرك الماوس لرؤية السكنات بوضوح 🔍</div>
          </div>

          {/* شريط المصغرات - كيبان غير يلا كانوا كتر من تصويرة واحدة */}
          {account.images && account.images.length > 1 && (
            <div className="thumbnails-horizontal-rack">
              {account.images.map((img, index) => (
                <div 
                  key={index} 
                  className={`rack-thumb-item ${activeImage === img ? "selected-rack-item" : ""}`}
                  onClick={() => setActiveImage(img)}
                >
                  <img src={`http://127.0.0.1:8000/storage/${img}`} alt={`thumb-${index}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* شق معلومات الحساب */}
        <div className="specs-info-section">
          <div className="info-main-card">
            <h1 className="account-main-title">{account.game_name}</h1>
            
            <div className="price-container-box">
              <span className="price-label">الثمن المطلوب:</span>
              <h2 className="price-value-amount">{account.price} <span className="mad-curr">درهم</span></h2>
            </div>

            <div className="description-rich-box">
              <h3 className="desc-header-title">📋 تفاصيل ومميزات الحساب:</h3>
              <p className="desc-text-body">{account.description}</p>
            </div>

            {account.whatsapp && (
              <a 
                href={`https://wa.me/${account.whatsapp.replace(/[^0-9]/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="direct-whatsapp-action-btn"
              >
                💬 تواصل مع البائع عبر الواتساب
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default AccountDetails;