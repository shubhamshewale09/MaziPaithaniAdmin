import { useMemo, useState } from 'react';
import {
  Bell,
  Grid2X2,
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
  { id: 'home', label: 'Home', icon: Home },
  { id: 'categories', label: 'Shop', icon: Grid2X2 },
  { id: 'custom', label: 'Custom', icon: Palette },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'profile', label: 'Profile', icon: User },
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
  searchTerm = '',
  onSearchChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <button
              type='button'
              title='Notifications'
              className='group relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[#ead9cf] bg-white text-[#7a1e2c]'
              aria-label='Notifications'
            >
              <span className={iconTooltipClassName}>Notifications</span>
              <Bell size={17} />
            </button>
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

        <div className='border-t border-[#f1e4dc] px-4 py-3 lg:hidden'>
          <div className='mx-auto max-w-7xl space-y-3'>
            <div className='flex items-center gap-3 rounded-full border border-[#ead9cf] bg-white px-4 py-3 shadow-sm'>
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
                  className='shrink-0 rounded-full border border-[#ead9cf] bg-white px-3 py-2 text-xs font-semibold text-[#8b6759] transition hover:border-[#7a1e2c] hover:text-[#7a1e2c]'
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

      <main className='px-4 pt-5 pb-24 sm:px-6 lg:px-8 lg:pb-8'>
        <div className='mx-auto max-w-7xl'>{children}</div>
      </main>

      <nav className='fixed bottom-0 left-0 right-0 z-40 border-t border-[#ead9cf] bg-[#fffaf6]/95 px-2 py-2 backdrop-blur-xl lg:hidden'>
        <div className='flex items-center justify-between gap-1'>
          {NAV_LINKS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const showBadge = item.id === 'messages' && unreadCount > 0;

            return (
              <button
                key={item.id}
                type='button'
                onClick={() => handleTabChange(item.id)}
                className='flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-center'
              >
                <span
                  className={[
                    'relative flex h-9 w-9 items-center justify-center rounded-2xl transition',
                    isActive
                      ? 'bg-[#7a1e2c] text-white shadow-md shadow-[#7a1e2c]/20'
                      : 'bg-transparent text-[#9b7b69]',
                  ].join(' ')}
                >
                  <Icon size={17} />
                  {showBadge && (
                    <span className='absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#c28b1e] px-0.5 text-[9px] font-bold text-white'>
                      {unreadCount}
                    </span>
                  )}
                </span>
                <span
                  className={[
                    'text-[10px] font-semibold',
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
