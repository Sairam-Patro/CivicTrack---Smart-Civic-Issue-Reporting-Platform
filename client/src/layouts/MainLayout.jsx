import { Outlet } from 'react-router-dom';

/**
 * MainLayout — wraps all pages.
 * Add a shared Navbar, Footer, or sidebar here when the project grows.
 */
function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
