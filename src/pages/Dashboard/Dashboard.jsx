import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthContext";
import { Users, UserCheck, UserPlus, ShoppingBag, IndianRupee, Menu } from "lucide-react";
import MetaTitle from "../../components/custom/MetaTitle";
import { useState, useEffect } from "react";
import Sidebar from "../../components/custom/Sidebar";
import Header from "../../components/custom/header";
import Profile from "../Profile/Profile"; 

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Handle tab parameter from URL
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const data = {
    totalUsers: 120,
    totalSellers: 45,
    totalBuyers: 75,
    totalOrders: 60,
    totalRevenue: 250000,
  };

  const handleLogout = () => {
    logout(); // update context
    localStorage.removeItem("login"); // clear storage
    localStorage.removeItem("token"); // clear token
    localStorage.removeItem("UserId"); // clear UserId
    localStorage.removeItem("RoleId"); // clear RoleId
    navigate("/"); // redirect to landing page
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'profile':
        return <Profile />;
      case 'products':
        return <div className="p-6"><h2 className="text-2xl font-bold">Products</h2><p className="text-gray-600 mt-2">Manage your products here</p></div>;
      case 'orders':
        return <div className="p-6"><h2 className="text-2xl font-bold">Orders</h2><p className="text-gray-600 mt-2">View and manage orders</p></div>;
      case 'enquiries':
        return <div className="p-6"><h2 className="text-2xl font-bold">Enquiries</h2><p className="text-gray-600 mt-2">Handle customer enquiries</p></div>;
      case 'revenue':
        return <div className="p-6"><h2 className="text-2xl font-bold">Revenue</h2><p className="text-gray-600 mt-2">Track revenue and analytics</p></div>;
      case 'settings':
        return <div className="p-6"><h2 className="text-2xl font-bold">Settings</h2><p className="text-gray-600 mt-2">Configure system settings</p></div>;
      default:
        return (
          <>
            <div className="p-6">
              <h1 className="text-3xl md:text-5xl font-bold text-[#C9A227]">
                माझी पैठणी Dashboard
              </h1>
              <p className="text-gray-600 mb-8">
                Welcome to your management panel
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                <Card title="Total Users" value={data.totalUsers} icon={<Users />} />
                <Card title="Sellers" value={data.totalSellers} icon={<UserCheck />} />
                <Card title="Buyers" value={data.totalBuyers} icon={<UserPlus />} />
                <Card title="Orders" value={data.totalOrders} icon={<ShoppingBag />} />
                <Card title="Revenue" value={`₹${data.totalRevenue}`} icon={<IndianRupee />} />
              </div>

              <div className="bg-white rounded-2xl shadow p-6 mt-8">
                <h2 className="text-xl font-semibold text-red-800 mb-4">
                  Platform Overview
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <InfoCard
                    title="Direct Artisan Connection"
                    desc="Connect directly with Paithani artisans without middlemen."
                  />
                  <InfoCard
                    title="Authentic Products"
                    desc="Only genuine handcrafted Paithani sarees."
                  />
                  <InfoCard
                    title="Fair Pricing"
                    desc="Transparent pricing ensuring artisans get fair value."
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow p-6 mt-8">
                <h2 className="text-xl font-semibold text-red-800 mb-4">
                  Recent Activity
                </h2>
                <ul className="space-y-3 text-gray-600">
                  <li>🧑 New user registered</li>
                  <li>🛍️ Order placed</li>
                  <li>👗 New Paithani listed</li>
                  <li>💰 Payment received</li>
                </ul>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <>
      <MetaTitle title="Dashboard" />
      
      {/* Fixed Hamburger Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 w-10 h-10 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-50 transition-all duration-200 z-30"
        title="Toggle Menu"
      >
        <Menu size={18} className="text-gray-600" />
      </button>

      {/* Fixed Header */}
      <Header />
      
      {/* Fixed Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
        isCollapsed={isSidebarCollapsed}
      />
      
      {/* Main Content Area */}
      <div className={`pt-16 transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'ml-[70px]' : 'ml-[220px]'
      }`}>
        <div className="min-h-screen bg-gray-50">
          {renderContent()}
        </div>
      </div>
    </>
  );
};

const Card = ({ title, value, icon }) => (
  <div className="bg-white rounded-xl shadow hover:shadow-xl transition p-5 flex items-center gap-4">
    <div className="p-3 bg-gradient-to-tr from-yellow-400 to-yellow-600 text-white rounded-xl">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const InfoCard = ({ title, desc }) => (
  <div className="p-5 bg-gradient-to-br from-red-50 to-yellow-50 rounded-xl shadow hover:shadow-lg transition">
    <h3 className="font-semibold text-red-700">{title}</h3>
    <p className="text-gray-600 mt-2 text-sm">{desc}</p>
  </div>
);

export default Dashboard;