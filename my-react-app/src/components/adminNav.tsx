import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Bus,
  Route,
  CalendarCheck,
  Users,
  Wallet,
  LogOut,
  Menu,
} from 'lucide-react';



export default function AdminSidebar({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    alert('You have been logged out.');
    
    sessionStorage.clear();
    navigate('/Login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { text: 'Manage Buses', icon: Bus, path: '/manageBus' },
    { text: 'Manage Routes', icon: Route, path: '/manageRoutes' },
    { text: 'Manage Schedule', icon: CalendarCheck, path: '/manageSch' },
    { text: 'Seat Generator', icon: Bus, path: '/seat' },
    {text:'SendNoti',icon:Bus,path:'/SendNoti'},
    { text: 'Manage Payment', icon: Wallet, path: '/managePayment' },
    { text: 'Users', icon: Users, path: '/users' },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <div className="p-5 border-b border-gray-700 text-xl font-bold">
        Admin Panel
      </div>
      <nav className="flex-1 overflow-y-auto py-4 ">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.text}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-3 me-2 py-3 rounded-lg transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span className=''>{item.text}</span>
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Top Bar for Mobile */}
      <header className="fixed sm:hidden top-0 left-0 right-0 z-40 bg-blue-600 text-white shadow-md">
        <div className="flex items-center h-16 px-4">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Sidebar"
            className="mr-4 p-2 rounded hover:bg-blue-700 focus:outline-none"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">Admin Panel</h1>
        </div>
      </header>

      {/* Sidebar: Desktop */}
      <aside className="hidden sm:flex flex-col w-[240px] fixed inset-y-0 z-30 bg-gray-900 shadow-lg">
        {sidebarContent}
      </aside>

      {/* Sidebar: Mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 flex sm:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setMobileOpen(false)}
          ></div>
          <div className="relative w-64 bg-gray-900 shadow-lg z-50">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 sm:ml-[240px] pt-16 sm:pt-6 px-4 pb-6">
        {children}
      </main>
    </div>
  );
}
