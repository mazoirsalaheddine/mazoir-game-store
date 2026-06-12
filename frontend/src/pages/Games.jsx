import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./games.css";

function Games() {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // جلب قائمة اللايكات اللي دارها هاد المستخدم من الـ LocalStorage باش نعقلو عليه وميديرش كثر من لايك
  const [likedAccounts, setLikedAccounts] = useState(() => {
    const savedLikes = localStorage.getItem("user_liked_cards");
    return savedLikes ? JSON.parse(savedLikes) : [];
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/game-accounts")
      .then((res) => {
        setAccounts(res.data);
        setFilteredAccounts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching accounts:", err);
        setLoading(false);
      });
  }, []);

  const handleFilterChange = (e) => {
    const game = e.target.value;
    setSelectedGame(game);
    setFilteredAccounts(game === "" ? accounts : accounts.filter(acc => acc.game_name === game));
  };

  // دالة اللايك الطائرة والسريعة (Optimistic UI Update)
  const toggleLike = async (id, e) => {
    e.stopPropagation();
    
    const hasLiked = likedAccounts.includes(id);
    const actionType = hasLiked ? 'unlike' : 'like';

    // 1. [تحديث فوري ف الشاشة] - كنزيدو أو ننقصو ف البلاصة بلا ما نتسناو السيرفر باش تحس بالسرعة
    const updatedAccounts = accounts.map(acc => {
      if (acc.id === id) {
        const currentLikes = acc.likes_count || 0;
        return { 
          ...acc, 
          likes_count: actionType === 'like' ? currentLikes + 1 : Math.max(0, currentLikes - 1) 
        };
      }
      return acc;
    });

    setAccounts(updatedAccounts);
    setFilteredAccounts(selectedGame === "" ? updatedAccounts : updatedAccounts.filter(acc => acc.game_name === selectedGame));

    // تحديث الـ LocalStorage والـ State للمستخدم فوراً لمنع التكرار
    let newLikedAccounts = hasLiked ? likedAccounts.filter(accId => accId !== id) : [...likedAccounts, id];
    setLikedAccounts(newLikedAccounts);
    localStorage.setItem("user_liked_cards", JSON.stringify(newLikedAccounts));

    // 2. [إرسال للسيرفر ف الخلفية (Background)]
    try {
      const res = await axios.post(`http://127.0.0.1:8000/api/game-accounts/${id}/like`, {
        action: actionType
      });
      
      // إذا رجع السيرفر داتا حقيقية ومختلفة لسبب ما، كنعاودو نقادوها بدقة
      if (res.data.success) {
        setAccounts(prevAccounts => prevAccounts.map(acc => {
          if (acc.id === id) {
            return { ...acc, likes_count: res.data.likes_count };
          }
          return acc;
        }));
      }
    } catch (err) {
      console.error("مشكل ف السيرفر، غنعاودو نرجعو الحالة الاصلية:", err);
      alert("وقع خطأ ف السيرفر، يرجى إعادة المحاولة.");
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (window.confirm("واش بصح بغيتي تمسح هاد الحساب نهائياً؟")) {
      try {
        await axios.delete(`https://mazoir-game-store.vercel.app/api/game-accounts/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAccounts(prev => prev.filter(acc => acc.id !== id));
        setFilteredAccounts(prev => prev.filter(acc => acc.id !== id));
        alert("تم الحذف بنجاح.");
      } catch (error) {
        alert("خطأ في الصلاحيات.");
        console.log(error);
      }
    }
  };

  const formatListingDate = (dateString) => {
    if (!dateString) return "قبل قليل";
    const createdDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (createdDate.toDateString() === today.toDateString()) return "اليوم";
    if (createdDate.toDateString() === yesterday.toDateString()) return "أمس";
    return createdDate.toLocaleDateString("fr-FR").replace(/\//g, "-");
  };

  if (loading) return <div className="loader">جاري التحميل...</div>;

  return (
    <div className="games-container" dir="rtl">
      <div className="section-header">
        <h2 className="section-title">عروض الحسابات</h2>
      </div>

      <div className="filter-container">
        <select className="game-filter-select" value={selectedGame} onChange={handleFilterChange}>
          <option value="">كل الألعاب المتاحة</option>
          <option value="Free Fire">Free Fire</option>
          <option value="PES">eFootball (PES)</option>
        </select>
      </div>

      <div className="listings-grid">
        {filteredAccounts.map((acc) => (
          <div className="listing-card" key={acc.id}>
            
            <div className="listing-top-bar">
              <span className="listing-date">{formatListingDate(acc.created_at)}</span>
            </div>

            <div className="listing-body">
              <div className="listing-info">
                <h3 className="listing-price">{acc.price} <span className="currency">درهم</span></h3>
                <h2 className="listing-title">{acc.game_name}</h2>
                <p className="listing-meta">{acc.game_name} متوفر حالياً</p>
              </div>

              <div className="listing-image-wrapper">
                {acc.images && acc.images.length > 0 ? (
                  <>
                    <img src={`https://mazoir-game-store-production.up.railway.app/storage/${acc.images[0]}`} alt={acc.game_name} />
                    <span className="image-count-badge">📷 {acc.images.length}</span>
                  </>
                ) : (
                  <div className="placeholder">🎮</div>
                )}
              </div>
            </div>

            <div className="listing-actions">
              <button className="details-action-btn" onClick={() => navigate(`/games/${acc.id}`)}>
                💬 عرض التفاصيل الكاملة
              </button>

              {user && user.role === 'admin' ? (
                <button className="admin-delete-btn" onClick={(e) => handleDelete(acc.id, e)}>
                  🗑️ مسح العرض ({acc.likes_count || 0})
                </button>
              ) : (
                <button 
                  className={`fb-like-btn ${likedAccounts.includes(acc.id) ? "liked" : ""}`} 
                  onClick={(e) => toggleLike(acc.id, e)}
                >
                  {/* العداد يظهر هنا بشكل نظيف داخل الزر فقط */}
                  {likedAccounts.includes(acc.id) 
                    ? `👍 تم الإعجاب (${acc.likes_count || 0})` 
                    : `👍 لايك (${acc.likes_count || 0})`}
                </button>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default Games;