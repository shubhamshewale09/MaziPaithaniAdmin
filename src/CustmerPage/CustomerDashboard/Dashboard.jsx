import { useState } from 'react';
import { Star, Heart, ChevronRight, MapPin, Palette } from 'lucide-react';
import MetaTitle from '../../components/custom/MetaTitle';
import CustomerLayout from '../../components/custom/customer/CustomerLayout';
import Categories    from '../Categories/Categories';
import ProductDetail from '../ProductDetail/ProductDetail';
import CustomDesign  from '../CustomDesign/CustomDesign';
import Cart          from '../Cart/Cart';
import Checkout      from '../Checkout/Checkout';
import Orders        from '../Orders/Orders';
import Messages      from '../Messages/Messages';
import Profile       from '../Profile/Profile';
import { useAuth }   from '../../context/auth/AuthContext';
import { showApiSuccess } from '../../Utils/Utils';
import { useNavigate }    from 'react-router-dom';

// ─── Static data ─────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 1, label: 'Traditional', emoji: '🪡', bg: 'from-[#7a1e2c] to-[#a52b39]' },
  { id: 2, label: 'Bridal',      emoji: '👰', bg: 'from-[#c28b1e] to-[#e0b44b]' },
  { id: 3, label: 'Designer',    emoji: '✨', bg: 'from-[#5d1228] to-[#8e3b46]' },
  { id: 4, label: 'Custom',      emoji: '🎨', bg: 'from-[#69452f] to-[#9b6b48]' },
];

const FEATURED = [
  { id: 1, name: 'Peacock Motif Paithani', price: '₹12,500 – ₹18,000', seller: 'Artisan Ravi',   rating: 4.8, tag: 'Bestseller' },
  { id: 2, name: 'Bridal Gold Border',     price: '₹22,000 – ₹35,000', seller: 'Weaver Sunita',  rating: 4.9, tag: 'Premium' },
  { id: 3, name: 'Lotus Pallu Design',     price: '₹9,800 – ₹14,500',  seller: 'Artisan Mohan',  rating: 4.7, tag: 'New' },
  { id: 4, name: 'Classic Yeola Silk',     price: '₹15,000 – ₹25,000', seller: 'Weaver Priya',   rating: 4.6, tag: 'Popular' },
];

const TOP_SELLERS = [
  { id: 1, name: 'Ravi Handlooms',   location: 'Yeola, Nashik',       rating: 4.9, orders: 320 },
  { id: 2, name: 'Sunita Weavers',   location: 'Paithan, Aurangabad', rating: 4.8, orders: 280 },
  { id: 3, name: 'Mohan Silk House', location: 'Yeola, Nashik',       rating: 4.7, orders: 215 },
];

const RECOMMENDED = [
  { id: 5, name: 'Zari Work Paithani',  price: '₹18,000 – ₹28,000', seller: 'Artisan Ravi',  rating: 4.8, tag: 'Premium' },
  { id: 6, name: 'Floral Border Saree', price: '₹8,500 – ₹12,000',  seller: 'Weaver Sunita', rating: 4.5, tag: 'New' },
  { id: 7, name: 'Royal Maroon Silk',   price: '₹20,000 – ₹32,000', seller: 'Artisan Mohan', rating: 4.9, tag: 'Bestseller' },
  { id: 8, name: 'Mint Green Paithani', price: '₹11,000 – ₹16,000', seller: 'Weaver Priya',  rating: 4.6, tag: 'Popular' },
];

const TAG_COLORS = {
  Bestseller: 'bg-[#7a1e2c] text-white',
  Premium:    'bg-[#c28b1e] text-white',
  New:        'bg-emerald-600 text-white',
  Popular:    'bg-[#5d1228] text-white',
};

// ─── Shared card components ───────────────────────────────────────────────────
const SareeCard = ({ item, onViewDetail }) => (
  <div className="group rounded-[22px] border border-[#f0e4de] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden">
    <div className="relative h-48 bg-gradient-to-br from-[#fff9f4] to-[#fde8d8] flex items-center justify-center">
      <span className="text-6xl">🥻</span>
      <span className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${TAG_COLORS[item.tag] || ''}`}>
        {item.tag}
      </span>
      <button className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-[#7a1e2c] shadow transition hover:bg-white">
        <Heart size={14} />
      </button>
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-[#3d1e17] text-sm leading-snug">{item.name}</h3>
      <p className="mt-1 text-xs text-[#9b7b69]">{item.seller}</p>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-sm font-bold text-[#7a1e2c]">{item.price}</p>
        <div className="flex items-center gap-1 text-[#c28b1e]">
          <Star size={12} fill="currentColor" />
          <span className="text-xs font-semibold text-[#3d1e17]">{item.rating}</span>
        </div>
      </div>
      <button
        onClick={() => onViewDetail && onViewDetail(item)}
        className="mt-3 w-full rounded-xl bg-gradient-to-r from-[#7a1e2c] to-[#a52b39] py-2 text-xs font-semibold text-white transition hover:opacity-90"
      >
        View Details
      </button>
    </div>
  </div>
);

const SellerCard = ({ seller }) => (
  <div className="flex items-center gap-4 rounded-[20px] border border-[#f0e4de] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#c28b1e] to-[#7a1e2c] text-white text-xl shadow">
      🧵
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-[#3d1e17] text-sm truncate">{seller.name}</p>
      <div className="flex items-center gap-1 mt-0.5 text-[#9b7b69]">
        <MapPin size={11} /><span className="text-xs truncate">{seller.location}</span>
      </div>
    </div>
    <div className="text-right shrink-0">
      <div className="flex items-center gap-1 text-[#c28b1e] justify-end">
        <Star size={12} fill="currentColor" />
        <span className="text-xs font-bold text-[#3d1e17]">{seller.rating}</span>
      </div>
      <p className="text-[10px] text-[#9b7b69] mt-0.5">{seller.orders} orders</p>
    </div>
  </div>
);

const SectionHeader = ({ title, onViewAll }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-bold text-[#3d1e17]">{title}</h2>
    <button onClick={onViewAll} className="flex items-center gap-1 text-xs font-semibold text-[#7a1e2c] hover:underline">
      View All <ChevronRight size={14} />
    </button>
  </div>
);

// ─── Home Tab ─────────────────────────────────────────────────────────────────
const HomeTab = ({ setActiveTab, setSelectedProduct }) => (
  <div className="space-y-10">
    {/* Hero */}
    <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#5f1320] via-[#7b1d2a] to-[#24090f] p-6 sm:p-10 text-white shadow-2xl">
      <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[#c28b1e]/25 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
      <div className="relative max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#f5d47c]">Majhi Paithani</p>
        <h1 className="mt-3 font-serif text-2xl font-bold leading-tight sm:text-4xl xl:text-5xl">
          Handcrafted Paithani Sarees,<br className="hidden sm:block" /> Direct from Artisans
        </h1>
        <p className="mt-4 text-sm leading-7 text-white/75 max-w-md">
          Discover authentic Paithani silk sarees woven by master artisans from Yeola and Paithan. Every thread tells a story.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => setActiveTab('categories')}
            className="rounded-2xl bg-gradient-to-r from-[#c28b1e] to-[#e0b44b] px-6 py-3 text-sm font-bold text-[#3d1e17] shadow-lg transition hover:opacity-90"
          >
            Shop Now
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className="flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            <Palette size={15} /> Request Custom Design
          </button>
        </div>
      </div>
    </section>

    {/* Stats strip */}
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[
        { label: 'Artisans',    value: '200+' },
        { label: 'Sarees',      value: '1,500+' },
        { label: 'Happy Buyers', value: '8,000+' },
        { label: 'Cities',      value: '50+' },
      ].map((s) => (
        <div key={s.label} className="rounded-[20px] border border-[#f0e4de] bg-white p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-[#7a1e2c]">{s.value}</p>
          <p className="text-xs text-[#9b7b69] mt-1 font-medium">{s.label}</p>
        </div>
      ))}
    </div>

    {/* Categories */}
    <section>
      <SectionHeader title="Shop by Category" onViewAll={() => setActiveTab('categories')} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab('categories')}
            className={`flex flex-col items-center justify-center gap-2 rounded-[22px] bg-gradient-to-br ${cat.bg} p-5 text-white shadow-md transition hover:-translate-y-1 hover:shadow-xl`}
          >
            <span className="text-3xl">{cat.emoji}</span>
            <span className="text-sm font-semibold">{cat.label}</span>
          </button>
        ))}
      </div>
    </section>

    {/* Featured Sarees */}
    <section>
      <SectionHeader title="Featured Sarees" onViewAll={() => setActiveTab('categories')} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURED.map((item) => (
          <SareeCard key={item.id} item={item} onViewDetail={(p) => setSelectedProduct(p)} />
        ))}
      </div>
    </section>

    {/* Top Artisans */}
    <section>
      <SectionHeader title="Top Artisans" onViewAll={() => {}} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {TOP_SELLERS.map((s) => <SellerCard key={s.id} seller={s} />)}
      </div>
    </section>

    {/* New Arrivals */}
    <section>
      <SectionHeader title="New Arrivals" onViewAll={() => setActiveTab('categories')} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...FEATURED].reverse().map((item) => (
          <SareeCard key={item.id} item={item} onViewDetail={(p) => setSelectedProduct(p)} />
        ))}
      </div>
    </section>

    {/* Recommended */}
    <section>
      <SectionHeader title="Recommended for You" onViewAll={() => setActiveTab('categories')} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {RECOMMENDED.map((item) => (
          <SareeCard key={item.id} item={item} onViewDetail={(p) => setSelectedProduct(p)} />
        ))}
      </div>
    </section>
  </div>
);

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const CustomerDashboard = () => {
  const { logout }   = useAuth();
  const navigate     = useNavigate();
  const [activeTab, setActiveTab]           = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartCount]                         = useState(2);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('login');
    localStorage.removeItem('token');
    localStorage.removeItem('UserId');
    localStorage.removeItem('RoleId');
    showApiSuccess('Logged out successfully');
    setTimeout(() => navigate('/'), 350);
  };

  const handleViewDetail = (product) => {
    setSelectedProduct(product);
    setActiveTab('product-detail');
  };

  const renderContent = () => {
    if (activeTab === 'product-detail' && selectedProduct) {
      return (
        <ProductDetail
          product={selectedProduct}
          onBack={() => { setActiveTab('categories'); setSelectedProduct(null); }}
          onAddToCart={() => {}}
        />
      );
    }
    switch (activeTab) {
      case 'home':       return <HomeTab setActiveTab={setActiveTab} setSelectedProduct={handleViewDetail} />;
      case 'categories': return <Categories onViewDetail={handleViewDetail} />;
      case 'custom':     return <CustomDesign />;
      case 'cart':       return <Cart onCheckout={() => setActiveTab('checkout')} />;
      case 'checkout':   return <Checkout onBack={() => setActiveTab('cart')} onSuccess={() => setActiveTab('orders')} />;
      case 'orders':     return <Orders />;
      case 'messages':   return <Messages />;
      case 'profile':    return <Profile onLogout={handleLogout} />;
      default:           return <HomeTab setActiveTab={setActiveTab} setSelectedProduct={handleViewDetail} />;
    }
  };

  return (
    <>
      <MetaTitle title="Customer Dashboard – Majhi Paithani" />
      <CustomerLayout activeTab={activeTab} setActiveTab={setActiveTab} cartCount={cartCount}>
        {renderContent()}
      </CustomerLayout>
    </>
  );
};

export default CustomerDashboard;
