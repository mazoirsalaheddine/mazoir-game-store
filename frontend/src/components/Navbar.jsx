import { Link } from "react-router-dom";
import { useState } from "react";
import "./navbar.css";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    // جلب بيانات المستخدم من الـ localStorage
    const user = JSON.parse(localStorage.getItem("user")) || null;

    // تشيك واش المستخدم أدمن
    const isAdmin = user && user.role === "admin";

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <nav className="navbar">
            <div className="logo">
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <span>متجر الألعاب</span>
                </Link>
            </div>

            <div className="menu-btn" onClick={toggleMenu}>
                ☰
            </div>

            <ul className={menuOpen ? "nav-links active" : "nav-links"}>
                <li>
                    <Link to="/" onClick={() => setMenuOpen(false)}>الرئيسية</Link>
                </li>
                <li>
                    <Link to="/games" onClick={() => setMenuOpen(false)}>الحسابات</Link>
                </li>
                <li>
                    <Link to="/contact" onClick={() => setMenuOpen(false)}>اتصل بنا</Link>
                </li>

                <li>
                    {/* <Link to="/news" onClick={() => setMenuOpen(false)}>الأخبار</Link> */}
                </li>
                
                {/* روابط الإدارة: غاتبان غير للـ Admin ومترجمة للعربية */}
                {isAdmin && (
                    <>
                        <li>
                            <Link to="/dashboard" onClick={() => setMenuOpen(false)}>لوحة التحكم</Link>
                        </li>
                        <li>
                            <Link to="/addAccount" onClick={() => setMenuOpen(false)}>إضافة حساب</Link>
                        </li>
                        <li>
                            <Link to="/admin/articles" onClick={() => setMenuOpen(false)}>
                                تسيير الأخبار
                            </Link>
                        </li>
                    </>
                )}

                {/* روابط الزوار (إيلا مكانش مسجل الدخول) */}
                {!user && (
                    <>
                        <li>
                            <Link to="/login" className="login-links" onClick={() => setMenuOpen(false)}>تسجيل الدخول</Link>
                        </li>
                        <li>
                            <Link to="/register" className="register-links" onClick={() => setMenuOpen(false)}>إنشاء حساب</Link>
                        </li>
                    </>
                )}

                {/* زر تسجيل الخروج إيلا كان مسجل الدخول */}
                {user && (
                    <li>
                        <button onClick={handleLogout} className="logout-btn">
                            تسجيل الخروج
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;