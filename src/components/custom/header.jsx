import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Bell, ChevronDown, LogOut, Menu, UserCircle, X } from "lucide-react";
import MessageNotificationBell from './MessageNotificationBell';
import { getCustomizationList } from '../../ServiceCustmer/CustomDesign/CustomDesignApi';
import { useChatConnection } from '../../hooks/useChatConnection';

/* ─── helpers ────────────────────────────────────────────────────────────── */

const getLoginUser = () => {
  try {
    const d = JSON.parse(localStorage.getItem('login') || '{}');
    const firstName = d.sFirstName || d.firstName || d.name?.split(' ')[0] || 'User';
    const lastName  = d.sLastName  || d.lastName  || d.name?.split(' ').slice(1).join(' ') || '';
    const fullName  = `${firstName} ${lastName}`.trim();
    const role      = d.roleName || (Number(d.roleId) === 3 ? 'Buyer' : 'Seller');
    const initials  = [firstName[0], lastName[0]].filter(Boolean).join('').toUpperCase() || 'U';
    return { fullName, role, initials };
  } catch {
    return { fullName: 'User', role: 'Seller', initials: 'U' };
  }
};

/**
 * calcPortalStyle
 * Returns an inline style object for a fixed-position portal popup.
 *
 * Strategy:
 *  - Always anchor below the trigger (top = trigger.bottom + gap).
 *  - Prefer right-aligned to the trigger's right edge.
 *  - On narrow viewports clamp so the popup never overflows either side:
 *      left  = max(8, triggerRight - popupWidth)
 *      right = max(8, viewportWidth - triggerRight)
 *    whichever keeps it fully on screen.
 */
const calcPortalStyle = (triggerRef, popupWidth = 320) => {
  if (!triggerRef.current) return { top: 80, right: 8, zIndex: 9999 };
  const rect   = triggerRef.current.getBoundingClientRect();
  const vw     = window.innerWidth;
  const gap    = 8;
  const margin = 8; // min distance from viewport edge

  const top       = rect.bottom + gap;
  const idealLeft = rect.right - popupWidth;
  const safeLeft  = Math.max(margin, idealLeft);
  return { position: 'fixed', top, left: safeLeft, zIndex: 9999 };
};

const useDropdownPosition = (triggerRef, open, popupWidth = 320) => {
  const [style, setStyle] = useState({ position: 'fixed', top: 80, left: 8, zIndex: 9999 });

  useEffect(() => {
    if (!open || !triggerRef.current) return;
    setStyle(calcPortalStyle(triggerRef, popupWidth));
  }, [open, triggerRef, popupWidth]);

  return style;
};

/* ─── Notification Panel ─────────────────────────────────────────────────── */

const NotificationPanel = ({ pendingCustomizationCount: initialCount = 0, onOpenCustomizations, connection }) => {
  const [open, setOpen] = useState(false);
  const [liveCount, setLiveCount] = useState(initialCount);
  const triggerRef = useRef(null);
  const panelRef   = useRef(null);
  const style = useDropdownPosition(triggerRef, open, 320);

  // Keep liveCount in sync when parent re-fetches and passes a new prop value
  useEffect(() => { setLiveCount(initialCount); }, [initialCount]);

  /*
   * SignalR: listen for CustomizationRequestCreated.
   * The backend fires this event on the seller's connection after the DB
   * trigger inserts the notification row.
   * When received → call GET /api/customization/list to get the real count.
   */
  useEffect(() => {
    if (!connection) return;

    const handleNewCustomization = () => {
      // Read seller id at call time (not at hook setup time)
      const sid = (() => {
        try {
          const d = JSON.parse(localStorage.getItem('login') || '{}');
          return d?.userId ?? d?.UserId ?? d?.iUserId ?? null;
        } catch { return null; }
      })();
      getCustomizationList(sid)
        .then((res) => {
          const raw = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
          const pending = raw.filter(
            (r) => ['requested','pending'].includes((r.sStatus ?? r.status ?? '').toLowerCase()),
          ).length;
          setLiveCount(pending);
        })
        .catch(() => {
          setLiveCount((prev) => prev + 1);
        });
    };

    connection.on('CustomizationRequestCreated', handleNewCustomization);
    // Also listen on a generic notification event some backends use
    connection.on('NewCustomizationNotification', handleNewCustomization);

    return () => {
      connection.off('CustomizationRequestCreated', handleNewCustomization);
      connection.off('NewCustomizationNotification', handleNewCustomization);
    };
  }, [connection]);

  const totalNotifications = liveCount;

  /* close on outside click */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        panelRef.current  && !panelRef.current.contains(e.target) &&
        triggerRef.current && !triggerRef.current.contains(e.target)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleMarkAllRead = () => {
    setLiveCount(0);
    setOpen(false);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#eee2db] bg-white text-[#6a1825] transition hover:-translate-y-0.5 hover:bg-[#fff8f3] sm:h-11 sm:w-11 sm:rounded-2xl"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell size={16} className="sm:h-[18px] sm:w-[18px]" />
        {totalNotifications > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#f97316] px-0.5 text-[9px] font-bold text-white shadow">
            {totalNotifications > 99 ? '99+' : totalNotifications}
          </span>
        )}
        {totalNotifications === 0 && (
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#d97706] sm:right-2 sm:top-2" />
        )}
      </button>

      {open && createPortal(
        <div
          ref={panelRef}
          style={style}
          className="w-[min(320px,calc(100vw-1rem))] overflow-hidden rounded-2xl border border-[#f1e2d8] bg-white shadow-[0_16px_48px_rgba(122,30,44,0.18)]"
        >
          {/* header */}
          <div className="flex items-center justify-between border-b border-[#f5ece8] px-4 py-3">
            <div className="flex items-center gap-2">
              <Bell size={14} className="text-[#7a1e2c]" />
              <span className="text-sm font-bold text-[#2f1d18]">Notifications</span>
              {totalNotifications > 0 && (
                <span className="rounded-full bg-[#7a1e2c] px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {totalNotifications}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fff7f2] text-[#7a1e2c] hover:bg-[#fde8e0]"
            >
              <X size={13} />
            </button>
          </div>

          {/* list */}
          <div className="divide-y divide-[#fdf0ea]">
            {/* Customization requests notification */}
            {liveCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onOpenCustomizations?.();
                }}
                className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-[#fffaf6]"
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff0e4] text-[#f97316]">
                  <Bell size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#2f1d18]">
                    {liveCount} new customization{liveCount > 1 ? ' requests' : ' request'}
                  </p>
                  <p className="mt-0.5 text-xs text-[#8d6e63]">
                    Buyers are waiting for your review and quotation
                  </p>
                  <p className="mt-1 text-[10px] font-medium text-[#b19588]">Just now</p>
                </div>
              </button>
            )}

            {/* Default order notification */}
            <div className="flex items-start gap-3 px-4 py-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff0e4] text-[#7a1e2c]">
                <Bell size={14} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#2f1d18]">New order received</p>
                <p className="mt-0.5 text-xs text-[#8d6e63]">Order #ORD-250522-001 is awaiting confirmation</p>
                <p className="mt-1 text-[10px] font-medium text-[#b19588]">Just now</p>
              </div>
            </div>
          </div>

          {/* footer */}
          <div className="border-t border-[#f5ece8] px-4 py-2.5">
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="w-full rounded-xl bg-[#7a1e2c] py-2 text-xs font-bold text-white transition hover:bg-[#651623]"
            >
              Mark all as read
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

/* ─── User Dropdown (desktop) ────────────────────────────────────────────── */

const UserDropdown = ({ user, onViewProfile, onLogout }) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const panelRef   = useRef(null);
  const style = useDropdownPosition(triggerRef, open, 224); // w-56 = 224px

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        panelRef.current  && !panelRef.current.contains(e.target) &&
        triggerRef.current && !triggerRef.current.contains(e.target)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleViewProfile = () => { setOpen(false); onViewProfile?.(); };
  const handleLogout      = () => { setOpen(false); onLogout?.(); };

  return (
    <>
      {/* trigger button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 rounded-2xl border border-[#eee2db] bg-white px-3 py-2 shadow-sm transition hover:bg-[#fff8f3]"
        aria-label="User menu"
        aria-expanded={open}
      >
        <div className="text-right">
          <p className="text-sm font-semibold text-[#38211b]">{user.fullName}</p>
          <p className="text-xs text-[#8d6e63]">{user.role}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#c9a227] via-[#e0b44b] to-[#7a1e2c] text-sm font-bold text-white shadow-md">
          {user.initials}
        </div>
        <ChevronDown
          size={14}
          className={`text-[#8d6e63] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* portal dropdown */}
      {open && createPortal(
        <div
          ref={panelRef}
          style={style}
          className="w-56 overflow-hidden rounded-2xl border border-[#f1e2d8] bg-white shadow-[0_16px_48px_rgba(122,30,44,0.18)]"
        >
          {/* user card */}
          <div className="flex items-center gap-3 border-b border-[#f5ece8] px-4 py-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#c9a227] via-[#e0b44b] to-[#7a1e2c] text-sm font-bold text-white shadow">
              {user.initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[#2f1d18]">{user.fullName}</p>
              <p className="truncate text-xs text-[#8d6e63]">{user.role}</p>
            </div>
          </div>

          {/* actions */}
          <div className="p-1.5">
            <button
              type="button"
              onClick={handleViewProfile}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#3d1e17] transition hover:bg-[#fff4ec]"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fff0e4] text-[#7a1e2c]">
                <UserCircle size={15} />
              </span>
              View Profile
            </button>

            <div className="my-1 h-px bg-[#f5ece8]" />

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#b42318] transition hover:bg-[#fff0ee]"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fff0ee] text-[#b42318]">
                <LogOut size={15} />
              </span>
              Logout
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

/* ─── Main Header ────────────────────────────────────────────────────────── */

const Header = ({
  onMenuClick,
  activeTab,
  showMenuButton = true,
  showLogoutButton = false,
  onLogout,
  onOpenEnquiry,
  onOpenProfile,
  onOpenCustomizations,
  pendingCustomizationCount = 0,
}) => {
  const currentTabLabel = activeTab
    ? activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
    : "Dashboard";

  const user = getLoginUser();
  // Use the shared SignalR connection so the notification bell gets real-time events
  const connection = useChatConnection();

  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-[#eadfda] bg-white/85 backdrop-blur-xl">
      {/* NOTE: no overflow-hidden here — dropdowns escape via portals */}
      <div className="flex h-[68px] items-center justify-between gap-2 px-3 sm:h-[74px] sm:px-6 lg:px-8">

        {/* ── Left: menu + brand ── */}
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
            {/* mobile brand */}
            <div className="flex min-w-0 items-center gap-2 overflow-hidden sm:hidden">
              <div className="min-w-0 leading-tight text-[#7a1e2c]">
                <p className="truncate font-serif text-sm font-bold">माझी</p>
                <p className="truncate font-serif text-sm font-bold">पैठणी</p>
              </div>
              <span className="max-w-[96px] truncate rounded-full bg-[#fff4dc] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#9b6a08]">
                {currentTabLabel}
              </span>
            </div>

            {/* desktop brand */}
            <div className="hidden sm:block">
              <p className="truncate font-serif text-base font-bold text-[#7a1e2c] sm:text-xl">
                माझी पैठणी
              </p>
              <div className="hidden items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[#9a7b64] sm:flex sm:text-[11px]">
                <span>Admin Dashboard</span>
                <span className="hidden h-1 w-1 rounded-full bg-[#c9a227] sm:inline-block" />
                <span className="truncate">{currentTabLabel}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: actions ── */}
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
              {/* notification bell — portal-based popup */}
              <NotificationPanel
                pendingCustomizationCount={pendingCustomizationCount}
                onOpenCustomizations={onOpenCustomizations}
                connection={connection}
              />

              {/* message bell — already portal-safe via its own ref */}
              {onOpenEnquiry && (
                <MessageNotificationBell onOpenEnquiry={onOpenEnquiry} />
              )}

              {/* mobile: avatar → direct profile navigation */}
              <button
                type="button"
                onClick={() => onOpenProfile?.()}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#c9a227] via-[#e0b44b] to-[#7a1e2c] text-xs font-bold text-white shadow-md transition hover:opacity-90 sm:hidden"
                aria-label="View profile"
              >
                {user.initials}
              </button>

              {/* desktop: avatar + name + portal dropdown */}
              <div className="hidden sm:block">
                <UserDropdown
                  user={user}
                  onViewProfile={onOpenProfile}
                  onLogout={onLogout}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
