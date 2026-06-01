import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // كنشوفو واش كاين التوكن في الكاش باش نعرفوه واش مسجل
  const token = localStorage.getItem("token");

  if (!token) {
    // يلا مكانش مسجل، كنصيفطوه لصفحة التسجيل أو اللوچين
    return <Navigate to="/register" replace />;
  }

  // يلا كان مسجل، كنخليوه يشوف الصفحة عادي
  return children;
};

export default ProtectedRoute;