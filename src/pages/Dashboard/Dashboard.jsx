import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthContext";
import {
  Users,
  UserCheck,
  UserPlus,
  ShoppingBag,
  IndianRupee,
  TrendingUp,
  Sparkles,
  BadgeCheck,
  Clock3,
  ChevronRight,
} from "lucide-react";
import MetaTitle from "../../components/custom/MetaTitle";
import { useState, useEffect } from "react";
import Sidebar from "../../components/custom/Sidebar";
import Header from "../../components/custom/header";
import ConfirmationModal from "../../components/custom/ConfirmationModal";
import Profile from "../Profile/Profile";
import Products from "../Products/ProductList";
import Orders from "../Orders/Orders";
import Enquiries from "../Enquiries/Enquiries";
import Revenue from "../Revenue/Revenue";
import Settings from "../Settings/Settings";
import { showApiSuccess } from "../../Utils/Utils";

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 1024 : false
  );

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth < 1024;
      setIsMobile(mobileView);

      if (mobileView) {
        setIsSidebarCollapsed(false);
      } else {
        setIsMobileSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const loginData = JSON.parse(localStorage.getItem("login") || "null");
  const shouldForceProfileCompletion =
    loginData?.isSellerProfileComplete === false && activeTab === "profile";

  const data = {
    totalUsers: 120,
    totalSellers: 45,
    totalBuyers: 75,
    totalOrders: 60,
    totalRevenue: 250000,
  };

  const highlights = [
    {
      title: "Direct Artisan Connection",
      desc: "Connect buyers and Paithani artisans directly without extra layers.",
      icon: <Sparkles size={18} />,
    },
    {
      title: "Authentic Products",
      desc: "Maintain trust with carefully listed handcrafted Paithani sarees.",
      icon: <BadgeCheck size={18} />,
    },
    {
      title: "Operational Momentum",
      desc: "Track orders, enquiries, and revenue from one responsive control panel.",
      icon: <TrendingUp size={18} />,
    },
  ];

  const recentActivity = [
    { title: "New user registered", time: "5 min ago" },
    { title: "A fresh Paithani listing was submitted", time: "18 min ago" },
    { title: "Order payment confirmed", time: "42 min ago" },
    { title: "Seller profile updated", time: "1 hr ago" },
  ];

  const statCards = [
    {
      title: "Total Users",
      value: data.totalUsers,
      icon: <Users size={20} />,
      accent: "from-[#7a1e2c] to-[#a52b39]",
      note: "+12% this month",
    },
    {
      title: "Sellers",
      value: data.totalSellers,
      icon: <UserCheck size={20} />,
      accent: "from-[#c28b1e] to-[#e0b44b]",
      note: "8 active today",
    },
    {
      title: "Buyers",
      value: data.totalBuyers,
      icon: <UserPlus size={20} />,
      accent: "from-[#8e3b46] to-[#bf5862]",
      note: "+6 new signups",
    },
    {
      title: "Orders",
      value: data.totalOrders,
      icon: <ShoppingBag size={20} />,
      accent: "from-[#69452f] to-[#9b6b48]",
      note: "14 pending review",
    },
    {
      title: "Revenue",
      value: `Rs ${data.totalRevenue.toLocaleString()}`,
      icon: <IndianRupee size={20} className="dashboard-icon-rupee" />,
      accent: "from-[#5d1228] to-[#ca8a04]",
      note: "+18.4% vs last month",
    },
  ];

  const confirmLogout = () => {
    logout();
    localStorage.removeItem("login");
    localStorage.removeItem("token");
    localStorage.removeItem("UserId");
    localStorage.removeItem("RoleId");
    setIsLogoutModalOpen(false);
    showApiSuccess("Logout successful");
    window.setTimeout(() => {
      navigate("/");
    }, 350);
  };

  const toggleSidebar = () => {
    if (shouldForceProfileCompletion) return;

    if (isMobile) {
      setIsMobileSidebarOpen((prev) => !prev);
      return;
    }

    setIsSidebarCollapsed((prev) => !prev);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  const renderDashboardHome = () => (
    <div className="space-y-6 sm:space-y-8">
      <section className="dashboard-fade-up relative overflow-hidden rounded-[30px] border border-[#f3dfd6] bg-gradient-to-br from-[#fff9f4] via-[#fff3eb] to-[#fdf7ef] p-6 shadow-[0_20px_70px_rgba(122,30,44,0.09)] sm:p-8 lg:p-10">
        <div className="absolute -right-14 top-0 h-36 w-36 rounded-full bg-[#f3d283]/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-[#7a1e2c]/10 blur-3xl" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b28a6f]">
              Welcome Back
            </p>
            <h1 className="mt-3 font-serif text-3xl font-bold leading-tight text-[#6f1827] sm:text-4xl xl:text-5xl">
              Manage Majhi Paithani with a cleaner, faster dashboard.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#6c5b54] sm:text-base">
              Keep an eye on buyers, sellers, orders, and marketplace growth from a responsive workspace designed for quick actions.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:min-w-[320px]">
            <MiniMetric label="Growth" value="18.4%" />
            <MiniMetric label="Pending" value="14" />
            <MiniMetric label="Conversion" value="68%" />
            <MiniMetric label="Response" value="2.4h" />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {statCards.map((card, index) => (
          <StatCard key={card.title} {...card} delay={index * 90} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="dashboard-fade-up rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(94,35,23,0.08)] sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#a0806d]">
                Platform Overview
              </p>
              <h2 className="mt-2 text-2xl font-bold text-[#3d1e17]">What is moving today</h2>
            </div>
            <span className="rounded-full bg-[#fff6df] px-3 py-1 text-xs font-semibold text-[#9b6a08]">
              Live Insights
            </span>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {highlights.map((item, index) => (
              <InfoCard key={item.title} {...item} delay={index * 120} />
            ))}
          </div>
        </div>

        <div className="dashboard-fade-up rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(94,35,23,0.08)] sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#a0806d]">
                Recent Activity
              </p>
              <h2 className="mt-2 text-2xl font-bold text-[#3d1e17]">Latest updates</h2>
            </div>
            <Clock3 size={18} className="dashboard-animated-icon text-[#a57b4f]" />
          </div>

          <div className="mt-6 space-y-3">
            {recentActivity.map((activity, index) => (
              <div
                key={activity.title}
                className="dashboard-fade-up flex items-start gap-4 rounded-2xl border border-[#f1e8e4] bg-[#fffaf7] px-4 py-4 transition hover:-translate-y-1 hover:shadow-lg"
                style={{ animationDelay: `${index * 110}ms` }}
              >
                <div className="dashboard-icon-shell mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f6d37e] to-[#7a1e2c] text-white shadow-md">
                  <ChevronRight size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#3d1e17] sm:text-base">{activity.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[#9b7b69]">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <Profile />;
      case "products":
        return <Products />;
      case "orders":
        return <Orders />;
      case "enquiries":
        return <Enquiries />;
      case "revenue":
        return <Revenue />;
      case "settings":
        return <Settings />;
      default:
        return renderDashboardHome();
    }
  };

  return (
    <>
      <MetaTitle title="Dashboard" />

      <div className="min-h-screen overflow-x-hidden bg-[#f7f1ed]">
        <Header
          onMenuClick={toggleSidebar}
          activeTab={activeTab}
          showMenuButton={!shouldForceProfileCompletion}
          showLogoutButton={shouldForceProfileCompletion}
          onLogout={() => setIsLogoutModalOpen(true)}
        />

        {!shouldForceProfileCompletion && (
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onLogout={() => setIsLogoutModalOpen(true)}
            isCollapsed={isSidebarCollapsed}
            isMobile={isMobile}
            isOpen={isMobileSidebarOpen}
            onClose={closeMobileSidebar}
          />
        )}

        <main
          className={[
            "relative min-h-screen overflow-x-hidden px-4 pb-8 pt-[94px] transition-all duration-300 ease-out sm:px-6 lg:px-8",
            shouldForceProfileCompletion
              ? "ml-0"
              : isMobile
                ? "ml-0"
                : isSidebarCollapsed
                  ? "lg:ml-[92px]"
                  : "lg:ml-[280px]",
          ].join(" ")}
        >
          <div className="absolute inset-x-0 top-[74px] -z-10 h-[320px] bg-[radial-gradient(circle_at_top_right,_rgba(201,162,39,0.18),_transparent_34%),radial-gradient(circle_at_top_left,_rgba(122,30,44,0.12),_transparent_30%)]" />
          {renderContent()}
        </main>

        <ConfirmationModal
          open={isLogoutModalOpen}
          title="Logout now?"
          message="Do you want to logout from your account?"
          confirmLabel="Logout"
          cancelLabel="Stay Here"
          onConfirm={confirmLogout}
          onClose={() => setIsLogoutModalOpen(false)}
        />
      </div>
    </>
  );
};

const StatCard = ({ title, value, icon, accent, note, delay }) => (
  <div
    className="dashboard-fade-up group rounded-[26px] border border-white/70 bg-white/90 p-5 shadow-[0_18px_50px_rgba(94,35,23,0.08)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_70px_rgba(94,35,23,0.12)]"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-[#8b6c60]">{title}</p>
        <p className="mt-3 text-2xl font-bold text-[#2f1d18] sm:text-[1.9rem]">{value}</p>
      </div>
      <div className={`dashboard-icon-shell flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-lg`}>
        <span className="dashboard-icon-glyph">{icon}</span>
      </div>
    </div>
    <div className="mt-5 flex items-center justify-between">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b08b6d]">Overview</p>
      <p className="text-xs font-medium text-[#6f1827]">{note}</p>
    </div>
  </div>
);

const InfoCard = ({ title, desc, icon, delay }) => (
  <div
    className="dashboard-fade-up rounded-[24px] border border-[#f0e4de] bg-gradient-to-br from-[#fffdfa] via-[#fff8f4] to-[#fef0e4] p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="dashboard-icon-shell flex h-11 w-11 items-center justify-center rounded-2xl bg-[#7a1e2c] text-white shadow-md">
      <span className="dashboard-icon-glyph">{icon}</span>
    </div>
    <h3 className="mt-4 text-lg font-semibold text-[#5a1822]">{title}</h3>
    <p className="mt-2 text-sm leading-7 text-[#6d5b55]">{desc}</p>
  </div>
);

const MiniMetric = ({ label, value }) => (
  <div className="rounded-2xl border border-white/60 bg-white/75 px-4 py-4 shadow-sm backdrop-blur-sm">
    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a67d65]">{label}</p>
    <p className="mt-2 text-xl font-bold text-[#3d1e17] sm:text-2xl">{value}</p>
  </div>
);

export default Dashboard;
