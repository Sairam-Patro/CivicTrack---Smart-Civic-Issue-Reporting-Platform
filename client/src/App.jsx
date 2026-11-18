import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ReportIssuePage from './pages/ReportIssuePage';
import MapPage from './pages/MapPage';
import IssuesPage from './pages/IssuesPage';
import IssueDetailPage from './pages/IssueDetailPage';
import MyIssuesPage from './pages/MyIssuesPage';
import AboutPage from './pages/AboutPage';
import HowItWorksPage from './pages/HowItWorksPage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';

// Admin Portal Imports
import { AdminAuthProvider } from './admin/context/AdminAuthContext';
import AdminProtectedRoute from './admin/components/AdminProtectedRoute';
import AdminLayout from './admin/components/AdminLayout';
import AdminLoginPage from './admin/pages/AdminLoginPage';
import AdminDashboardPage from './admin/pages/AdminDashboardPage';
import AdminIssuesPage from './admin/pages/AdminIssuesPage';
import AdminLiveMonitoringPage from './admin/pages/AdminLiveMonitoringPage';
import AdminMapPage from './admin/pages/AdminMapPage';
import AdminVerificationPage from './admin/pages/AdminVerificationPage';
import AdminDepartmentsPage from './admin/pages/AdminDepartmentsPage';
import AdminOfficersPage from './admin/pages/AdminOfficersPage';
import AdminCitizensPage from './admin/pages/AdminCitizensPage';
import AdminLocalBodiesPage from './admin/pages/AdminLocalBodiesPage';
import AdminStatesPage from './admin/pages/AdminStatesPage';
import AdminEscalationsPage from './admin/pages/AdminEscalationsPage';
import AdminResolutionsPage from './admin/pages/AdminResolutionsPage';
import AdminNotificationsPage from './admin/pages/AdminNotificationsPage';
import AdminAnalyticsPage from './admin/pages/AdminAnalyticsPage';
import AdminAuditLogsPage from './admin/pages/AdminAuditLogsPage';
import AdminManagementPage from './admin/pages/AdminManagementPage';
import AdminSettingsPage from './admin/pages/AdminSettingsPage';
import AdminProfilePage from './admin/pages/AdminProfilePage';

/**
 * App.jsx — Root router for CivicTrack with Complete Admin Portal.
 */
function App() {
  return (
    <AdminAuthProvider>
      <Routes>
        {/* ─── Public Citizen Pages ────────────────────────────────────────── */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/report-issue" element={<ReportIssuePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/issues" element={<IssuesPage />} />
        <Route path="/issues/:id" element={<IssueDetailPage />} />
        <Route path="/my-issues" element={<MyIssuesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* ─── Dedicated Admin Authentication ──────────────────────────────── */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* ─── Protected Administrative Portal ─────────────────────────────── */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          {/* Default /admin redirects to /admin/dashboard */}
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="live" element={<AdminLiveMonitoringPage />} />
          <Route path="issues" element={<AdminIssuesPage />} />
          <Route path="map" element={<AdminMapPage />} />
          <Route path="verification" element={<AdminVerificationPage />} />
          <Route path="departments" element={<AdminDepartmentsPage />} />
          <Route path="officers" element={<AdminOfficersPage />} />
          <Route path="citizens" element={<AdminCitizensPage />} />
          <Route path="local-bodies" element={<AdminLocalBodiesPage />} />
          <Route path="states" element={<AdminStatesPage />} />
          <Route path="escalations" element={<AdminEscalationsPage />} />
          <Route path="resolutions" element={<AdminResolutionsPage />} />
          <Route path="notifications" element={<AdminNotificationsPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="audit-logs" element={<AdminAuditLogsPage />} />
          <Route
            path="administrators"
            element={
              <AdminProtectedRoute allowedRoles={['super_admin', 'state_admin']}>
                <AdminManagementPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <AdminProtectedRoute allowedRoles={['super_admin']}>
                <AdminSettingsPage />
              </AdminProtectedRoute>
            }
          />
          <Route path="profile" element={<AdminProfilePage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </AdminAuthProvider>
  );
}

export default App;
