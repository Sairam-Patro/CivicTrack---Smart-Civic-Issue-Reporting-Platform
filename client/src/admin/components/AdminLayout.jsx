import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';
import { useAdminSocket } from '../hooks/useAdminSocket';

export const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { connected } = useAdminSocket();

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#102544] flex antialiased">
      {/* Sidebar */}
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        {/* Top Navbar */}
        <AdminNavbar setMobileOpen={setMobileOpen} connected={connected} />

        {/* Page Content with generous desktop spacing */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 xl:p-8 max-w-[1680px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
