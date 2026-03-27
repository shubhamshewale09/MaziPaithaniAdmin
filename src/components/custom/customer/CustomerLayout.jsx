import { useState } from 'react';
import {
  Search, ShoppingCart, Bell, User, Home, Grid,
  Package, MessageSquare, Palette, Menu, X,
} from 'lucide-react';

export const NAV_LINKS = [
  { id: 'home',       label: 'Home',       icon: <Home size={16} /> },
  { id: 'categories', label: 'Categories', icon: <Grid size={16} /> },
  { id: 'custom',     label: 'Custom',     icon: <Palette size={16} /> },
  { id: 'orders',     label: 'Orders',     icon: <Package size={16} /> },
  { id: 'messages',   label: 'Messages',   icon: <MessageSquare size={16} /> },
  { id: 'profile',    label: 'Profile',    icon: <User size={16} /> },
];

const CustomerLayout = ({ children, activeTab, setActiveTab, cartCount = 0 }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f1ed]">
      {/* ── Navbar ── */}
      <header className="fixed left-0 right-0 top-0 z-40 border-b border-[#eadfda] bg-white/90 backdrop-blur-xl">
        <div className="flex h-[68px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-10">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#7a1e2c] to-[#c28b1e] text-white shadow text-base">
              🥻
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="font-serif text-base font-bold text-[#7a1e2c]">माझी पैठणी</p>
              <p className="text-[10px] uppercase tracking-widest text-[#9b7b69]">Majhi Paithani</p>
            </div>
          </div>

          {/* Search desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-6 items-center gap-2 rounded-2xl border border-[#e9d7cf] bg-[#fff8f3] px-4 py-2.5 shadow-sm">
            <Search size={15} className="text-[#9b7b69] shrink-0" />
            <input
              type="text"
              placeholder="Search sarees, designs, artisans..."
              className="flex-1 bg-transparent text-sm text-[#3d1e17] placeholder-[#b8a09a] outline-none"
            />
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={[
                  'flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition',
                  activeTab === link.id
                    ? 'bg-[#7a1e2c] text-white shadow'
                    : 'text-[#6a4a42] hover:bg-[#f5ede9] hover:text-[#7a1e2c]',
                ].join(' ')}
              >
                {link.icon}{link.label}
              </button>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-2 shrink-0">
            <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#eee2db] bg-white text-[#6a1825] transition hover:bg-[#fff8f3]">
              <Bell size={16} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#d97706]" />
            </button>
            <button
              onClick={() => setActiveTab('cart')}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#eee2db] bg-white text-[#6a1825] transition hover:bg-[#fff8f3]"
            >
              <ShoppingCart size={16} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#7a1e2c] text-[9px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#eee2db] bg-white text-[#6a1825] lg:hidden"
              onClick={() => setMobileMenuOpen((p) => !p)}
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="flex md:hidden items-center gap-2 border-t border-[#f0e4de] bg-white px-4 py-2">
          <Search size={14} className="text-[#9b7b69] shrink-0" />
          <input
            type="text"
            placeholder="Search sarees, artisans..."
            className="flex-1 bg-transparent text-sm text-[#3d1e17] placeholder-[#b8a09a] outline-none"
          />
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="border-t border-[#f0e4de] bg-white px-4 py-3 lg:hidden">
            <div className="grid grid-cols-3 gap-2">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => { setActiveTab(link.id); setMobileMenuOpen(false); }}
                  className={[
                    'flex flex-col items-center gap-1 rounded-xl p-3 text-xs font-medium transition',
                    activeTab === link.id ? 'bg-[#7a1e2c] text-white' : 'bg-[#fff8f3] text-[#6a4a42]',
                  ].join(' ')}
                >
                  {link.icon}{link.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ── Content ── */}
      <main className="px-4 pb-24 pt-[120px] sm:px-6 md:pt-[84px] lg:px-10">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#eadfda] bg-white/95 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={[
                'flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 transition',
                activeTab === link.id ? 'text-[#7a1e2c]' : 'text-[#9b7b69]',
              ].join(' ')}
            >
              <span className={activeTab === link.id ? 'scale-110' : ''}>{link.icon}</span>
              <span className="text-[9px] font-semibold">{link.label}</span>
              {activeTab === link.id && <span className="h-1 w-4 rounded-full bg-[#7a1e2c]" />}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Footer ── */}
      <footer className="hidden lg:block border-t border-[#eadfda] bg-gradient-to-br from-[#5f1320] via-[#7b1d2a] to-[#24090f] text-white">
        <div className="mx-auto max-w-7xl px-10 py-10">
          <div className="grid grid-cols-4 gap-8">
            <div>
              <p className="font-serif text-lg font-bold text-[#f5d47c]">माझी पैठणी</p>
              <p className="mt-2 text-xs leading-6 text-white/60">
                Connecting customers directly with Paithani artisans since 2024.
              </p>
            </div>
            {[
              { title: 'Shop',    links: ['Featured', 'New Arrivals', 'Bridal', 'Custom'] },
              { title: 'Support', links: ['Contact Us', 'FAQs', 'Returns', 'Track Order'] },
              { title: 'Company', links: ['About', 'Artisans', 'Blog', 'Careers'] },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-sm font-semibold text-[#f5d47c]">{col.title}</p>
                <ul className="mt-3 space-y-2">
                  {col.links.map((l) => (
                    <li key={l}><button className="text-xs text-white/60 transition hover:text-white">{l}</button></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-white/40">
            © 2024 Majhi Paithani. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomerLayout;
