import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

export const AdminProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, loading, admin } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#07845F] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-[#102544]">Authenticating CivicTrack Administrator...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && admin?.role !== 'super_admin' && !allowedRoles.includes(admin?.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] p-6">
        <div className="max-w-md bg-white p-8 rounded-2xl shadow-lg border border-red-100 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            !
          </div>
          <h2 className="text-xl font-bold text-[#102544] mb-2">Access Restricted</h2>
          <p className="text-sm text-gray-600 mb-6">
            Your role (<span className="font-semibold">{admin?.role}</span>) does not have authorization to view this administrative sector.
          </p>
          <a
            href="/admin/dashboard"
            className="inline-block px-5 py-2.5 bg-[#102544] text-white rounded-xl text-sm font-medium hover:bg-opacity-90"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminProtectedRoute;
