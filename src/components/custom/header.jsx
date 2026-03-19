import React from "react";
import { Bell, Mail, Menu, User } from "lucide-react";

const Header = ({ onMenuClick, activeTab }) => {
  const currentTabLabel = activeTab
    ? activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
    : "Dashboard";

  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-[#eadfda] bg-white/85 backdrop-blur-xl">
      <div className="flex h-[74px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#e9d7cf] bg-[#fff8f3] text-[#6a1825] shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0">
            <p className="truncate font-serif text-lg font-bold text-[#7a1e2c] sm:text-xl">
              Majhi Paithani
            </p>
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[#9a7b64] sm:text-[11px]">
              <span>Admin Dashboard</span>
              <span className="hidden h-1 w-1 rounded-full bg-[#c9a227] sm:inline-block" />
              <span className="truncate">{currentTabLabel}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button className="relative hidden h-11 w-11 items-center justify-center rounded-2xl border border-[#eee2db] bg-white text-[#6a1825] transition hover:-translate-y-0.5 hover:bg-[#fff8f3] sm:flex">
            <Bell size={18} />
            <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-[#d97706]" />
          </button>

          <button className="relative hidden h-11 w-11 items-center justify-center rounded-2xl border border-[#eee2db] bg-white text-[#6a1825] transition hover:-translate-y-0.5 hover:bg-[#fff8f3] sm:flex">
            <Mail size={18} />
            <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-[#be123c]" />
          </button>

          <div className="flex items-center gap-3 rounded-2xl border border-[#eee2db] bg-white px-3 py-2 shadow-sm sm:px-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-[#38211b]">Rajesh Kumar</p>
              <p className="text-xs text-[#8d6e63]">Administrator</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#c9a227] via-[#e0b44b] to-[#7a1e2c] text-white shadow-md">
              <User size={18} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
