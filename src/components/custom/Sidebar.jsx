import React from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquare,
  DollarSign,
  User,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

const Sidebar = ({
  activeTab,
  setActiveTab,
  onLogout,
  isCollapsed,
  isMobile,
  isOpen,
  onClose,
  disableTabs = false,
}) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { id: "products", label: "Products", icon: <Package size={18} /> },
    { id: "orders", label: "Orders", icon: <ShoppingCart size={18} /> },
    { id: "enquiries", label: "Enquiries", icon: <MessageSquare size={18} /> },
    { id: "revenue", label: "Revenue", icon: <DollarSign size={18} /> },
    { id: "profile", label: "Profile", icon: <User size={18} /> },
    { id: "settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  const handleTabClick = (tabId) => {
    if (disableTabs && tabId !== "profile") {
      toast.error("Please complete your profile first");
      return;
    }
    setActiveTab(tabId);
    if (isMobile) {
      onClose();
    }
  };

  return (
    <>
      {isMobile && isOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={onClose}
          className="fixed inset-0 top-[74px] z-10 bg-[#2d140f]/45 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        className={[
          "fixed left-0 top-[74px] z-30 flex h-[calc(100vh-74px)] flex-col border-r border-white/40",
          "bg-gradient-to-b from-[#5f1320] via-[#7b1d2a] to-[#24090f] text-white shadow-2xl",
          "transition-all duration-300 ease-out",
          isMobile
            ? `w-[290px] ${isOpen ? "translate-x-0" : "-translate-x-full"}`
            : isCollapsed
              ? "w-[92px] translate-x-0"
              : "w-[280px] translate-x-0",
        ].join(" ")}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 pb-5 pt-6">
          <div className="overflow-hidden">
            <p className="font-serif text-xl font-bold tracking-wide text-[#f8d98c]">
              {isCollapsed && !isMobile ? "MP" : "Majhi Paithani"}
            </p>
            {(!isCollapsed || isMobile) && (
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.24em] text-white/55">
                Admin Console
              </p>
            )}
          </div>

          {isMobile && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/10 bg-white/10 p-2 text-white transition hover:bg-white/20"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="px-4 py-5">
          {(!isCollapsed || isMobile) && (
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 shadow-lg backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-white/55">Overview</p>
              <p className="mt-2 text-sm leading-6 text-white/80">
                Manage sellers, buyers, orders, and profile updates from one place.
              </p>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleTabClick(item.id)}
                    className={[
                      "group relative flex w-full items-center rounded-2xl px-4 py-3 text-left transition-all duration-200",
                      isCollapsed && !isMobile ? "justify-center" : "gap-3",
                      isActive
                        ? "bg-gradient-to-r from-[#f5d47c] to-[#f0bc54] text-[#52111d] shadow-lg shadow-[#120408]/20"
                        : "text-white/80 hover:bg-white/10 hover:text-white",
                    ].join(" ")}
                    title={isCollapsed && !isMobile ? item.label : ""}
                  >
                    <span
                      className={[
                        "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200",
                        isActive ? "bg-white/55" : "bg-white/8 group-hover:bg-white/15",
                      ].join(" ")}
                    >
                      {item.icon}
                    </span>

                    {(!isCollapsed || isMobile) && (
                      <span>
                        <span className="block text-sm font-semibold">{item.label}</span>
                        <span className="block text-xs text-current/70">
                          Open {item.label.toLowerCase()} panel
                        </span>
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={onLogout}
            className={[
              "flex w-full items-center rounded-2xl px-4 py-3 transition-all duration-200",
              isCollapsed && !isMobile ? "justify-center" : "gap-3",
              "bg-white/6 text-white/85 hover:bg-[#fff1] hover:text-white",
            ].join(" ")}
            title={isCollapsed && !isMobile ? "Logout" : ""}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff1]">
              <LogOut size={18} />
            </span>
            {(!isCollapsed || isMobile) && (
              <span>
                <span className="block text-sm font-semibold">Logout</span>
                <span className="block text-xs text-white/60">Sign out from dashboard</span>
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
