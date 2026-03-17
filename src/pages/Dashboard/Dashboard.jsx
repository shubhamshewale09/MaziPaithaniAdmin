import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthContext";
import { Users, UserCheck, UserPlus, ShoppingBag, IndianRupee } from "lucide-react";
import MetaTitle from "../../components/custom/MetaTitle"; 

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // update context
    localStorage.removeItem("login"); // clear storage
    navigate("/"); // redirect to landing page
  };

  const data = {
    totalUsers: 120,
    totalSellers: 45,
    totalBuyers: 75,
    totalOrders: 60,
    totalRevenue: 250000,
  };

  return (
    <>
      <MetaTitle title="Dashboard" />

      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-red-50 p-6">
        
        {/* Header with Logout */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-[#C9A227]">
            माझी पैठणी Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition"
          >
            Logout
          </button>
        </div>

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