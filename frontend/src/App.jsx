import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AddAccount from './pages/AddAccount';
import Games from './pages/Games';
import News from './pages/News';
import Login from './auth/Login';
import Register from './auth/Register';

import Contact from './pages/Contact';

// استيراد الصفحات العامة للمستخدمين
import NewsDetails from "./pages/NewsDetails";

// استيراد صفحات التحكم الخاصة بالـ Admin
import AddArticle from "./admin/AddArticle";
import EditArticle from "./admin/EditArticle";
import ArticleManagement from "./admin/ArticleManagement";
import AccountDetails from "./pages/AccountDetails";


import ProtectedRoute from './pages/ProtectedRoute'; // استيراد المكون المحمي


 import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      {/* الـ Navbar غايبقا يبان ديما لفوق فـ كاع الصفحات */}
      <Navbar /> 
      
      <Routes>
        {/* الصفحات اللي كانت عندك ديجا */}
        <Route path="/" element={<Home />} />

        <Route path="/games"  element={
            <ProtectedRoute>
              <Games />
            </ProtectedRoute>
          }/>

        <Route path="/news" element={
            <ProtectedRoute>
              <News />
            </ProtectedRoute>}
          />

        {/* مسار تفاصيل الحساب الديناميكي عبر الـ ID */}
        <Route path="/games/:id" element={<AccountDetails />} />
        <Route path="/addAccount" element={<AddAccount />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* ================= الصفحات الجديدة ديال الـ News System ================= */}
        
        {/* صفحة تفاصيل المقال (الملف: pages/NewsDetails.jsx) */}
        <Route path="/news/:slug" element={<NewsDetails />} />
        {/* صفحة إضافة مقال جديد للأدمن (الملف: admin/AddArticle.jsx) */}
        <Route path="/admin/add-article" element={<AddArticle />} />
        {/* صفحة تعديل مقال قديم للأدمن (الملف: admin/EditArticle.jsx) */}
        <Route path="/admin/edit-article/:id" element={<EditArticle />} />
        <Route path="/admin/articles" element={<ArticleManagement />} />      
        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App;