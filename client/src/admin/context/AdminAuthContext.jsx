import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    try {
      const stored = localStorage.getItem('ct_admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('ct_admin_token') || '');
  const [loading, setLoading] = useState(true);

  // Set default authorization header for axios admin calls
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check current session on mount
  useEffect(() => {
    const verifySession = async () => {
      const savedToken = localStorage.getItem('ct_admin_token');
      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('/api/admin/auth/me', {
          headers: { Authorization: `Bearer ${savedToken}` },
          withCredentials: true,
        });
        if (res.data?.success && res.data?.admin) {
          setAdmin(res.data.admin);
          localStorage.setItem('ct_admin_user', JSON.stringify(res.data.admin));
        }
      } catch (err) {
        console.warn('Admin session expired or invalid:', err?.response?.data?.message);
        localStorage.removeItem('ct_admin_token');
        localStorage.removeItem('ct_admin_user');
        setAdmin(null);
        setToken('');
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const adminLogin = async (adminId, password) => {
    try {
      const res = await axios.post(
        '/api/admin/auth/login',
        { adminId, password },
        { withCredentials: true }
      );

      if (res.data?.success) {
        const { token: receivedToken, admin: adminData } = res.data;
        setToken(receivedToken);
        setAdmin(adminData);
        localStorage.setItem('ct_admin_token', receivedToken);
        localStorage.setItem('ct_admin_user', JSON.stringify(adminData));
        axios.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;
        toast.success(`Welcome back, ${adminData.name}!`);
        return { success: true, admin: adminData };
      }
      return { success: false, message: res.data?.message || 'Login failed.' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Authentication error. Please check your credentials.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const adminLogout = async () => {
    try {
      await axios.post('/api/admin/auth/logout', {}, { withCredentials: true });
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('ct_admin_token');
      localStorage.removeItem('ct_admin_user');
      delete axios.defaults.headers.common['Authorization'];
      setAdmin(null);
      setToken('');
      toast.success('Logged out from administrative portal.');
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await axios.put(
        '/api/admin/auth/change-password',
        { currentPassword, newPassword },
        { withCredentials: true }
      );
      if (res.data?.success) {
        toast.success('Password changed successfully.');
        return { success: true };
      }
      return { success: false, message: res.data?.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update password.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!admin && !!token,
        loading,
        adminLogin,
        adminLogout,
        changePassword,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export default AdminAuthContext;
