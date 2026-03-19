import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  MessageSquare, 
  DollarSign, 
  User, 
  Settings, 
  LogOut,
  Bell,
  Mail
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, onLogout, isCollapsed }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'products', label: 'Products', icon: <Package size={18} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingCart size={18} /> },
    { id: 'enquiries', label: 'Enquiries', icon: <MessageSquare size={18} /> },
    { id: 'revenue', label: 'Revenue', icon: <DollarSign size={18} /> },
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <div className={`fixed top-16 left-0 h-[calc(100vh-64px)] bg-[#f5f6f8] border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out z-10 ${
      isCollapsed ? 'w-[70px]' : 'w-[220px]'
    }`}>
      {/* Navigation Menu */}
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-[#fde9e2] text-orange-600'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                {item.icon}
                {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-600 transition-all duration-200"
          title={isCollapsed ? 'Logout' : ''}
        >
          <LogOut size={18} />
          {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;