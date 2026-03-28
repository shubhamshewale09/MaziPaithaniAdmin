import React from "react";
import { Bell, LogOut, Menu, User } from "lucide-react";
import MessageNotificationBell from './MessageNotificationBell';

const Header = ({
  onMenuClick,
  activeTab,
  showMenuButton = true,
  showLogoutButton = false,
  onLogout,
  onOpenEnquiry,
}) => {
  const currentTabLabel = activeTab
    ? activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
    : "Dashboard";

  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-[#eadfda] bg-white/85 backdrop-blur-xl">
      <div className="flex h-[68px] items-center justify-between gap-2 overflow-hidden px-3 sm:h-[74px] sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
          {showMenuButton && (
            <button
              type="button"
              onClick={onMenuClick}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e9d7cf] bg-[#fff8f3] text-[#6a1825] shadow-sm transition hover:-translate-y-0.5 hover:bg-white sm:h-11 sm:w-11 sm:rounded-2xl"
              aria-label="Toggle sidebar"
            >
              <Menu size={18} className="sm:h-5 sm:w-5" />
            </button>
          )}

          <div className="min-w-0 overflow-hidden">
            <div className="flex min-w-0 items-center gap-2 overflow-hidden sm:hidden">
              <div className="min-w-0 leading-tight text-[#7a1e2c]">
                <p className="truncate font-serif text-sm font-bold">{"\u092e\u093e\u091d\u0940"}</p>
                <p className="truncate font-serif text-sm font-bold">{"\u092a\u0948\u0920\u0923\u0940"}</p>
              </div>
              <span className="max-w-[96px] truncate rounded-full bg-[#fff4dc] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#9b6a08]">
                {currentTabLabel}
              </span>
            </div>

            <div className="hidden sm:block">
              <p className="truncate font-serif text-base font-bold text-[#7a1e2c] sm:text-xl">
                {"\u092e\u093e\u091d\u0940 \u092a\u0948\u0920\u0923\u0940"}
              </p>
              <div className="hidden items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[#9a7b64] sm:flex sm:text-[11px]">
                <span>Admin Dashboard</span>
                <span className="hidden h-1 w-1 rounded-full bg-[#c9a227] sm:inline-block" />
                <span className="truncate">{currentTabLabel}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          {showLogoutButton ? (
            <button
              type="button"
              onClick={onLogout}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-[#f2d7d3] bg-[#7a1e2c] px-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white shadow-sm transition hover:bg-[#651623] sm:h-auto sm:gap-2 sm:rounded-2xl sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.14em]"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          ) : (
            <>
              <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#eee2db] bg-white text-[#6a1825] transition hover:-translate-y-0.5 hover:bg-[#fff8f3] sm:h-11 sm:w-11 sm:rounded-2xl">
                <Bell size={16} className="sm:h-[18px] sm:w-[18px]" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#d97706] sm:right-3 sm:top-3 sm:h-2.5 sm:w-2.5" />
              </button>

              {onOpenEnquiry && <MessageNotificationBell onOpenEnquiry={onOpenEnquiry} />}

              <div className="flex items-center gap-2 rounded-xl border border-[#eee2db] bg-white px-2 py-2 shadow-sm sm:gap-3 sm:rounded-2xl sm:px-4">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold text-[#38211b]">Rajesh Kumar</p>
                  <p className="text-xs text-[#8d6e63]">Administrator</p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#c9a227] via-[#e0b44b] to-[#7a1e2c] text-white shadow-md sm:h-10 sm:w-10 sm:rounded-2xl">
                  <User size={16} className="sm:h-[18px] sm:w-[18px]" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
