import { createPortal } from 'react-dom';
import { useMemo, useRef, useState, useEffect } from 'react';
import {
  Bell,
  Grid2X2,
  Heart,
  Home,
  Menu,
  MessageSquare,
  Package,
  Palette,
  Search,
  ShoppingCart,
  User,
  X,
} from 'lucide-react';

export const NAV_LINKS = [
  { id: 'home',        label: 'Home',        icon: Home },
  { id: 'categories',  label: 'Shop',        icon: Grid2X2 },
  { id: 'custom',      label: 'Custom',      icon: Palette },
  { id: 'my-requests', label: 'My Requests', icon: Package },
  { id: 'wishlist',    label: 'Wishlist',    icon: Heart },
  { id: 'orders',      label: 'Orders',      icon: Package },
  { id: 'messages',    label: 'Messages',    icon: MessageSquare },
  { id: 'profile',     label: 'Profile',     icon: User },
];

// Bottom nav shows only 5 primary items; rest accessible via hamburger menu
const BOTTOM_NAV = [
  { id: 'home',        label: 'Home',    icon: Home },
  { id: 'categories',  label: 'Shop',    icon: Grid2X2 },
  { id: 'cart',        label: 'Cart',    icon: ShoppingCart },
  { id: 'my-requests', label: 'Requests',icon: Palette },
  { id: 'profile',     label: 'Profile', icon: User },
];

const quickFilters = ['Bridal', 'Pure Silk', 'Under 20k', 'Ready to Ship'];
const iconTooltipClassName =
  'pointer-events-none absolute -top-12 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-2xl border border-[#f2d7c5] bg-gradient-to-br from-[#fffaf6] via-[#fff4ec] to-[#fde7d7] px-3 py-1.5 text-[11px] font-semibold text-[#7a1e2c] opacity-0 shadow-[0_12px_30px_rgba(94,35,23,0.16)] transition duration-200 group-hover:-translate-y-1 group-hover:opacity-100';

const CustomerLayout = ({
  children,
  activeTab,
  setActiveTab,
  cartCount = 0,
  unreadCount = 0,
  customizationNotifCount = 0,
  customizationNotifs = [],
  onClearCustomizationNotifs,
  onOpenMyRequests,
  searchTerm = '',
  onSearchChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bellOpen, setBellOpen]             = useState(false);
  const bellRef  = useRef(null);
  const panelRef = useRef(null);
  const [bellStyle, setBellStyle] = useState({ position: 'fixed', top: 80, right: 8, zIndex: 9999 });

  /* position the bell popup */
  useEffect(() => {
    if (!bellOpen || !bellRef.current) return;
    const rect = bellRef.current.getBoundingClientRect();
    const popW = Math.min(320, window.innerWidth - 16);
    setBellStyle({
      position: 'fixed',
      top:  rect.bottom + 8,
      left: Math.max(8, rect.right - popW),
      zIndex: 9999,
      width: popW,
    });
  }, [bellOpen]);

  /* close on outside click */
  useEffect(() => {
    if (!bellOpen) return;
    const handler = (e) => {
      if (
        panelRef.current  && !panelRef.current.contains(e.target) &&
        bellRef.current   && !bellRef.current.contains(e.target)
      ) setBellOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [bellOpen]);

  const totalBellCount = customizationNotifCount;

  const handleBellClick = () => setBellOpen((v) => !v);

  const handleMarkAllRead = () => {
    onClearCustomizationNotifs?.();
    setBellOpen(false);
  };

  const handleGoToRequests = () => {
    onClearCustomizationNotifs?.();
    setBellOpen(false);
    onOpenMyRequests?.();
  };

  const fmtTime = (iso) => {
    if (!iso) return '';
    try {
      const diff = Math.floor((Date.now() - new Date(iso)) / 60000);
      if (diff < 1) return 'Just now';
      if (diff < 60) return `${diff}m ago`;
      return `${Math.floor(diff / 60)}h ago`;
    } catch { return ''; }
  };

  const title = useMemo(() => {
    const currentItem = NAV_LINKS.find((item) => item.id === activeTab);
    return currentItem?.label || 'Majhi Paithani';
  }, [activeTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <div className='min-h-screen bg-[#f7efe8] text-[#34160f]'>
      <div className='pointer-events-none fixed inset-x-0 top-0 -z-10 h-[380px] bg-[radial-gradient(circle_at_top_right,_rgba(194,139,30,0.2),_transparent_32%),radial-gradient(circle_at_top_left,_rgba(122,30,44,0.16),_transparent_34%)]' />

      <header className='sticky top-0 z-40 border-b border-[#ead9cf] bg-[#fffaf6]/95 backdrop-blur-xl'>
        <div className='mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8'>
          <button
            type='button'
            className='flex h-11 w-11 items-center justify-center rounded-2xl border border-[#ead9cf] bg-white text-[#7a1e2c] lg:hidden'
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label='Open customer menu'
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <button
            type='button'
            onClick={() => handleTabChange('home')}
            className='flex min-w-0 items-center gap-3 text-left'
          >
            <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7a1e2c] via-[#9e3140] to-[#c28b1e] text-lg text-white shadow-lg shadow-[#7a1e2c]/20'>
              MP
            </div>
            <div className='min-w-0'>
              <p className='truncate font-serif text-lg font-bold text-[#6b1725]'>
                Majhi Paithani
              </p>
              <p className='truncate text-[11px] uppercase tracking-[0.28em] text-[#a6806f]'>
                Customer Studio
              </p>
            </div>
          </button>

          <div className='hidden flex-1 items-center lg:flex'>
            <div className='mx-6 flex w-full max-w-xl items-center gap-3 rounded-full border border-[#ead9cf] bg-white px-4 py-3 shadow-sm'>
              <Search size={16} className='text-[#9b7b69]' />
              <input
                type='text'
                value={searchTerm}
                onChange={(event) => onSearchChange?.(event.target.value)}
                placeholder='Search Paithani sarees, colors, motifs, artisans...'
                className='w-full bg-transparent text-sm text-[#34160f] outline-none placeholder:text-[#b19588]'
              />
            </div>
          </div>

          <div className='ml-auto flex items-center gap-2'>
            {/* ── Notification Bell ── */}
            <button
              ref={bellRef}
              type='button'
              onClick={handleBellClick}
              className='group relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[#ead9cf] bg-white text-[#7a1e2c]'
              aria-label='Notifications'
              aria-expanded={bellOpen}
            >
              <span className={iconTooltipClassName}>Notifications</span>
              <Bell size={17} />
              {totalBellCount > 0 && (
                <span className='absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#7a1e2c] px-0.5 text-[9px] font-bold text-white shadow'>
                  {totalBellCount > 99 ? '99+' : totalBellCount}
                </span>
              )}
            </button>

            {/* Bell portal popup */}
            {bellOpen && createPortal(
              <div
                ref={panelRef}
                style={bellStyle}
                className='overflow-hidden rounded-2xl border border-[#f1e2d8] bg-white shadow-[0_16px_48px_rgba(122,30,44,0.18)]'
              >
                {/* header */}
                <div className='flex items-center justify-between border-b border-[#f5ece8] px-4 py-3'>
                  <div className='flex items-center gap-2'>
                    <Bell size={14} className='text-[#7a1e2c]' />
                    <span className='text-sm font-bold text-[#2f1d18]'>Notifications</span>
                    {totalBellCount > 0 && (
                      <span className='rounded-full bg-[#7a1e2c] px-1.5 py-0.5 text-[10px] font-bold text-white'>
                        {totalBellCount}
                      </span>
                    )}
                  </div>
                  <button
                    type='button'
                    onClick={() => setBellOpen(false)}
                    className='flex h-7 w-7 items-center justify-center rounded-full bg-[#fff7f2] text-[#7a1e2c] hover:bg-[#fde8e0]'
                  >
                    <X size={13} />
                  </button>
                </div>

                {/* list */}
                <div className='max-h-[320px] divide-y divide-[#fdf0ea] overflow-y-auto [scrollbar-width:thin]'>
                  {customizationNotifs.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-10 text-center'>
                      <Bell size={24} className='text-[#d4b5a8]' />
                      <p className='mt-3 text-sm font-semibold text-[#8b6759]'>No notifications yet</p>
                      <p className='mt-1 text-xs text-[#b19588]'>Quotations and updates will appear here</p>
                    </div>
                  ) : (
                    customizationNotifs.map((n, i) => (
                      <button
                        key={i}
                        type='button'
                        onClick={handleGoToRequests}
                        className='flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-[#fffaf6]'
                      >
                        <div className='mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600'>
                          <Bell size={13} />
                        </div>
                        <div className='min-w-0 flex-1'>
                          <p className='text-sm font-semibold text-[#2f1d18]'>{n.msg}</p>
                          <p className='mt-0.5 text-[10px] text-[#b19588]'>{fmtTime(n.time)}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>

                {/* footer */}
                <div className='border-t border-[#f5ece8] px-4 py-2.5 flex gap-2'>
                  <button
                    type='button'
                    onClick={handleGoToRequests}
                    className='flex-1 rounded-xl bg-[#7a1e2c] py-2 text-xs font-bold text-white transition hover:bg-[#651623]'
                  >
                    View My Requests
                  </button>
                  {totalBellCount > 0 && (
                    <button
                      type='button'
                      onClick={handleMarkAllRead}
                      className='rounded-xl border border-[#ead9cf] px-3 py-2 text-xs font-semibold text-[#6b5048] hover:border-[#7a1e2c]'
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>,
              document.body
            )}

            <button
              type='button'
              title='Open cart'
              onClick={() => handleTabChange('cart')}
              className='group relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[#ead9cf] bg-white text-[#7a1e2c]'
              aria-label='Open cart'
            >
              <span className={iconTooltipClassName}>Open cart</span>
              <ShoppingCart size={17} />
              {cartCount > 0 && (
                <span className='absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#7a1e2c] px-1 text-[10px] font-bold text-white'>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className='border-t border-[#f1e4dc] px-4 py-2 lg:hidden'>
          <div className='mx-auto max-w-7xl space-y-2'>
            <div className='flex items-center gap-3 rounded-full border border-[#ead9cf] bg-white px-4 py-2.5 shadow-sm'>
              <Search size={16} className='text-[#9b7b69]' />
              <input
                type='text'
                value={searchTerm}
                onChange={(event) => onSearchChange?.(event.target.value)}
                placeholder='Search sarees, artisans, motifs...'
                className='w-full bg-transparent text-sm text-[#34160f] outline-none placeholder:text-[#b19588]'
              />
            </div>

            <div className='flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
              {quickFilters.map((item) => (
                <button
                  key={item}
                  type='button'
                  className='shrink-0 rounded-full border border-[#ead9cf] bg-white px-3 py-1.5 text-xs font-semibold text-[#8b6759] transition hover:border-[#7a1e2c] hover:text-[#7a1e2c]'
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className='hidden border-t border-[#f1e4dc] lg:block'>
          <div className='mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3 lg:px-8'>
            <nav className='flex flex-wrap items-center gap-2'>
              {NAV_LINKS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const showBadge = item.id === 'messages' && unreadCount > 0;

                return (
                  <button
                    key={item.id}
                    type='button'
                    onClick={() => handleTabChange(item.id)}
                    className={[
                      'relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition',
                      isActive
                        ? 'bg-[#7a1e2c] text-white shadow-md shadow-[#7a1e2c]/20'
                        : 'text-[#6b5048] hover:bg-[#fff1e7] hover:text-[#7a1e2c]',
                    ].join(' ')}
                  >
                    <Icon size={15} />
                    {item.label}
                    {showBadge && (
                      <span className='flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#c28b1e] px-1 text-[10px] font-bold text-white'>
                        {unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className='flex flex-wrap items-center gap-2'>
              {quickFilters.map((item) => (
                <button
                  key={item}
                  type='button'
                  className='rounded-full border border-[#ead9cf] bg-white px-3 py-1.5 text-xs font-semibold text-[#8b6759] transition hover:border-[#7a1e2c] hover:text-[#7a1e2c]'
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className='border-t border-[#f1e4dc] bg-white px-4 py-4 lg:hidden'>
            <div className='mx-auto max-w-7xl space-y-4'>
              <div className='flex items-center justify-between rounded-[24px] bg-[#fff5ed] px-4 py-3'>
                <div>
                  <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#a6806f]'>
                    Current Section
                  </p>
                  <p className='mt-1 text-lg font-bold text-[#6b1725]'>{title}</p>
                </div>
                <button
                  type='button'
                  onClick={() => handleTabChange('cart')}
                  className='rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#7a1e2c] shadow-sm'
                >
                  Cart {cartCount > 0 ? `(${cartCount})` : ''}
                </button>
              </div>

              <div className='grid grid-cols-2 gap-3'>
                {NAV_LINKS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      type='button'
                      onClick={() => handleTabChange(item.id)}
                      className={[
                        'rounded-[22px] border px-4 py-4 text-left transition',
                        isActive
                          ? 'border-[#7a1e2c] bg-[#7a1e2c] text-white'
                          : 'border-[#ead9cf] bg-[#fffaf6] text-[#5d4038]',
                      ].join(' ')}
                    >
                      <Icon size={18} />
                      <p className='mt-3 text-sm font-semibold'>{item.label}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </header>

      <main className='px-3 pt-4 pb-28 sm:px-6 lg:px-8 lg:pb-8'>
        <div className='mx-auto max-w-7xl'>{children}</div>
      </main>

      {/* Bottom nav — 5 primary items only */}
      <nav className='fixed bottom-0 left-0 right-0 z-40 border-t border-[#ead9cf] bg-[#fffaf6]/95 backdrop-blur-xl lg:hidden'>
        <div className='flex items-center justify-around px-1 py-2'>
          {BOTTOM_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const showBadge = item.id === 'messages' && unreadCount > 0;

            return (
              <button
                key={item.id}
                type='button'
                onClick={() => handleTabChange(item.id)}
                className='flex flex-1 flex-col items-center gap-0.5 py-2'
              >
                <span
                  className={[
                    'relative flex h-9 w-9 items-center justify-center rounded-xl transition',
                    isActive
                      ? 'bg-[#7a1e2c] text-white shadow-md shadow-[#7a1e2c]/20'
                      : 'text-[#9b7b69]',
                  ].join(' ')}
                >
                  <Icon size={18} />
                  {item.id === 'cart' && cartCount > 0 && (
                    <span className='absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#7a1e2c] px-0.5 text-[9px] font-bold text-white'>
                      {cartCount}
                    </span>
                  )}
                  {showBadge && (
                    <span className='absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#c28b1e] px-0.5 text-[9px] font-bold text-white'>
                      {unreadCount}
                    </span>
                  )}
                </span>
                <span
                  className={[
                    'text-[9px] font-semibold',
                    isActive ? 'text-[#7a1e2c]' : 'text-[#9b7b69]',
                  ].join(' ')}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default CustomerLayout;
