import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Clock3,
  Heart,
  MapPin,
  MessageCircle,
  Palette,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import MetaTitle from '../../components/custom/MetaTitle';
import CustomerLayout from '../../components/custom/customer/CustomerLayout';
import Categories from '../Categories/Categories';
import ProductDetail from '../ProductDetail/ProductDetail';
import CustomDesign from '../CustomDesign/CustomDesign';
import Cart from '../Cart/Cart';
import Checkout from '../Checkout/Checkout';
import Orders from '../Orders/Orders';
import Messages from '../Messages/Messages';
import Profile from '../Profile/Profile';
import { useAuth } from '../../context/auth/AuthContext';
import { showApiSuccess } from '../../Utils/Utils';

const featuredProducts = [
  {
    id: 1,
    name: 'Peacock Motif Paithani',
    seller: 'Ravi Handlooms',
    price: 'Rs 14,500 - Rs 18,000',
    rating: 4.8,
    tag: 'Bestseller',
    location: 'Yeola, Nashik',
    color: 'Emerald Green',
    fabric: 'Pure Silk',
    design: 'Traditional',
  },
  {
    id: 2,
    name: 'Bridal Gold Border',
    seller: 'Sunita Weaves',
    price: 'Rs 22,000 - Rs 35,000',
    rating: 4.9,
    tag: 'Wedding Edit',
    location: 'Paithan, Chhatrapati Sambhajinagar',
    color: 'Royal Red',
    fabric: 'Pure Silk',
    design: 'Bridal',
  },
  {
    id: 3,
    name: 'Lotus Pallu Design',
    seller: 'Mohan Silk House',
    price: 'Rs 11,200 - Rs 15,600',
    rating: 4.7,
    tag: 'New Arrival',
    location: 'Yeola, Nashik',
    color: 'Lotus Pink',
    fabric: 'Silk Cotton',
    design: 'Designer',
  },
];

const recommendedProducts = [
  {
    id: 4,
    name: 'Royal Zari Weave',
    seller: 'Sunita Weaves',
    price: 'Rs 24,500 - Rs 29,000',
    rating: 4.9,
    tag: 'Recommended',
    location: 'Paithan, Chhatrapati Sambhajinagar',
    color: 'Royal Gold',
    fabric: 'Pure Silk',
    design: 'Bridal',
  },
  {
    id: 5,
    name: 'Festival Border Paithani',
    seller: 'Ravi Handlooms',
    price: 'Rs 16,800 - Rs 21,500',
    rating: 4.6,
    tag: 'Popular',
    location: 'Yeola, Nashik',
    color: 'Violet Pink',
    fabric: 'Silk Cotton',
    design: 'Traditional',
  },
  {
    id: 6,
    name: 'Temple Pallu Classic',
    seller: 'Mohan Silk House',
    price: 'Rs 18,000 - Rs 23,000',
    rating: 4.7,
    tag: 'Daily Luxury',
    location: 'Yeola, Nashik',
    color: 'Deep Blue',
    fabric: 'Pure Silk',
    design: 'Traditional',
  },
];

const topArtisans = [
  {
    id: 1,
    seller: 'Ravi Handlooms',
    location: 'Yeola, Nashik',
    rating: 4.9,
    speciality: 'Peacock motif and bridal borders',
  },
  {
    id: 2,
    seller: 'Sunita Weaves',
    location: 'Paithan, Chhatrapati Sambhajinagar',
    rating: 4.8,
    speciality: 'Wedding palette and zari work',
  },
  {
    id: 3,
    seller: 'Mohan Silk House',
    location: 'Yeola, Nashik',
    rating: 4.7,
    speciality: 'Custom temple and lotus pallu designs',
  },
];

const artisanHighlights = [
  {
    title: 'Authentic weaving',
    description: 'Direct buying from real Paithani artisans with design details up front.',
    icon: ShieldCheck,
  },
  {
    title: 'Custom requests',
    description: 'Share colors, motifs, and timeline with artisans for made-for-you sarees.',
    icon: Palette,
  },
  {
    title: 'Safe delivery',
    description: 'Track orders, talk to sellers, and manage checkout in one mobile-friendly flow.',
    icon: Truck,
  },
];

const shopperMetrics = [
  { label: 'Active artisans', value: '82+' },
  { label: 'Ready to ship', value: '250+' },
  { label: 'Custom requests', value: '36 open' },
  { label: 'Avg. dispatch', value: '4 days' },
];

const tooltipClassName =
  'pointer-events-none absolute -top-12 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-2xl border border-[#f2d7c5] bg-gradient-to-br from-[#fffaf6] via-[#fff4ec] to-[#fde7d7] px-3 py-1.5 text-[11px] font-semibold text-[#7a1e2c] opacity-0 shadow-[0_12px_30px_rgba(94,35,23,0.16)] transition duration-200 group-hover:-translate-y-1 group-hover:opacity-100';

const ProductPreviewCard = ({ item, onOpen, onAddToCart }) => (
  <div className='group rounded-[28px] border border-[#efdcd2] bg-white p-4 text-left shadow-[0_20px_50px_rgba(94,35,23,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(94,35,23,0.12)]'>
    <div className='relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#fff8f1] via-[#fdecd9] to-[#f7d9c6] p-6'>
      <span className='absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold text-[#7a1e2c]'>
        {item.tag}
      </span>

      <div className='absolute right-4 top-4 flex items-center gap-2'>
        <button
          type='button'
          title='Save to wishlist'
          className='group relative flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-[#7a1e2c] shadow-sm'
        >
          <span className={tooltipClassName}>Save to wishlist</span>
          <Heart size={15} />
        </button>
        <button
          type='button'
          title='Add to cart'
          onClick={() => onAddToCart(item)}
          className='group relative flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-[#7a1e2c] shadow-sm'
        >
          <span className={tooltipClassName}>Add to cart</span>
          <ShoppingCart size={15} />
        </button>
      </div>

      <div className='flex h-44 items-center justify-center rounded-[22px] border border-white/50 bg-white/30 text-7xl shadow-inner'>
        S
      </div>
    </div>

    <div className='mt-4'>
      <div className='flex items-start justify-between gap-3'>
        <div>
          <p className='text-lg font-bold text-[#34160f]'>{item.name}</p>
          <p className='mt-1 text-sm text-[#8b6759]'>{item.seller}</p>
        </div>
        <span className='flex items-center gap-1 rounded-full bg-[#fff6db] px-2.5 py-1 text-xs font-semibold text-[#9b6a08]'>
          <Star size={12} fill='currentColor' />
          {item.rating}
        </span>
      </div>

      <div className='mt-3 flex flex-wrap items-center gap-3 text-xs text-[#8b6759]'>
        <span className='flex items-center gap-1'>
          <MapPin size={12} />
          {item.location}
        </span>
        <span>{item.color}</span>
      </div>

      <div className='mt-4 flex items-center justify-between gap-3'>
        <p className='text-base font-bold text-[#7a1e2c]'>{item.price}</p>
        <button
          type='button'
          onClick={() => onOpen(item)}
          className='inline-flex items-center gap-2 rounded-full border border-[#ead9cf] bg-[#fffaf6] px-4 py-2 text-sm font-semibold text-[#7a1e2c] transition hover:bg-[#fff1e7]'
        >
          View Details
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  </div>
);

const ArtisanCard = ({ artisan, onMessage }) => (
  <button
    type='button'
    onClick={() => onMessage(artisan.seller)}
    className='group rounded-[28px] border border-[#efdcd2] bg-white p-5 text-left shadow-[0_18px_45px_rgba(94,35,23,0.08)] transition hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(94,35,23,0.12)]'
  >
    <div className='flex items-start justify-between gap-3'>
      <div className='flex items-center gap-4'>
        <div className='flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-br from-[#7a1e2c] to-[#c28b1e] text-lg font-bold text-white'>
          {artisan.seller[0]}
        </div>
        <div>
          <p className='text-lg font-bold text-[#34160f]'>{artisan.seller}</p>
          <p className='mt-1 text-sm text-[#8b6759]'>{artisan.location}</p>
        </div>
      </div>
      <span className='flex items-center gap-1 rounded-full bg-[#fff6db] px-2.5 py-1 text-xs font-semibold text-[#9b6a08]'>
        <Star size={12} fill='currentColor' />
        {artisan.rating}
      </span>
    </div>

    <p className='mt-4 text-sm leading-7 text-[#8b6759]'>{artisan.speciality}</p>

    <div className='mt-5 inline-flex items-center gap-2 rounded-full bg-[#fff1e7] px-4 py-2 text-sm font-semibold text-[#7a1e2c]'>
      <MessageCircle size={15} />
      Message artisan
    </div>
  </button>
);

const HomeTab = ({
  onBrowseCollection,
  onOpenProduct,
  onCustomRequest,
  onAddToCart,
  onMessageArtisan,
}) => (
  <div className='space-y-6 sm:space-y-8'>
    <section className='relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#5a1220] via-[#7a1e2c] to-[#2f0c12] px-5 py-6 text-white shadow-[0_28px_80px_rgba(66,18,28,0.28)] sm:px-8 sm:py-9'>
      <div className='absolute -right-12 top-0 h-40 w-40 rounded-full bg-[#f5d47c]/20 blur-3xl' />
      <div className='absolute bottom-0 left-0 h-28 w-28 rounded-full bg-white/10 blur-3xl' />

      <div className='relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end'>
        <div>
          <p className='text-xs font-semibold uppercase tracking-[0.34em] text-[#f5d47c]'>
            Customer Experience
          </p>
          <h1 className='mt-3 max-w-2xl font-serif text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl'>
            Buy handcrafted Paithani sarees with a storefront made for shoppers.
          </h1>
          <p className='mt-4 max-w-xl text-sm leading-7 text-white/75 sm:text-base'>
            Explore ready-to-ship collections, talk to artisans, request custom
            designs, and place orders without the admin dashboard feel.
          </p>

          <div className='mt-6 flex flex-wrap gap-3'>
            <button
              type='button'
              onClick={onBrowseCollection}
              className='rounded-full bg-[#f5d47c] px-5 py-3 text-sm font-bold text-[#401712] transition hover:opacity-90'
            >
              Shop Collection
            </button>
            <button
              type='button'
              onClick={onCustomRequest}
              className='rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15'
            >
              Request Custom Design
            </button>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-3'>
          {shopperMetrics.map((item) => (
            <div
              key={item.label}
              className='rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur-sm'
            >
              <p className='text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60'>
                {item.label}
              </p>
              <p className='mt-3 text-2xl font-bold text-white'>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className='grid gap-4 md:grid-cols-3'>
      {artisanHighlights.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className='rounded-[28px] border border-[#efdcd2] bg-white p-5 shadow-[0_16px_40px_rgba(94,35,23,0.07)]'
          >
            <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1e7] text-[#7a1e2c]'>
              <Icon size={20} />
            </div>
            <p className='mt-4 text-lg font-bold text-[#34160f]'>{item.title}</p>
            <p className='mt-2 text-sm leading-7 text-[#8b6759]'>
              {item.description}
            </p>
          </div>
        );
      })}
    </section>

    <section className='rounded-[30px] border border-[#efdcd2] bg-white p-5 shadow-[0_18px_45px_rgba(94,35,23,0.08)] sm:p-6'>
      <div className='flex items-center justify-between gap-4'>
        <div>
          <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#a6806f]'>
            Featured Sarees
          </p>
          <h2 className='mt-2 text-2xl font-bold text-[#34160f]'>
            Sarees customers are loving
          </h2>
        </div>
        <button
          type='button'
          onClick={onBrowseCollection}
          className='hidden rounded-full border border-[#ead9cf] px-4 py-2 text-sm font-semibold text-[#7a1e2c] transition hover:bg-[#fff1e7] sm:block'
        >
          View all
        </button>
      </div>

      <div className='mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
        {featuredProducts.map((item) => (
          <ProductPreviewCard
            key={item.id}
            item={item}
            onOpen={onOpenProduct}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>

    <section className='grid gap-6 xl:grid-cols-[1.2fr_0.8fr]'>
      <div className='rounded-[30px] border border-[#efdcd2] bg-white p-6 shadow-[0_18px_45px_rgba(94,35,23,0.08)]'>
        <div className='flex items-center justify-between gap-4'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#a6806f]'>
              Top Artisans
            </p>
            <h2 className='mt-2 text-2xl font-bold text-[#34160f]'>
              Start a conversation with trusted weavers
            </h2>
          </div>
        </div>

        <div className='mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {topArtisans.map((artisan) => (
            <ArtisanCard key={artisan.id} artisan={artisan} onMessage={onMessageArtisan} />
          ))}
        </div>
      </div>

      <div className='space-y-5'>
        <div className='rounded-[30px] border border-[#efdcd2] bg-white p-6 shadow-[0_18px_45px_rgba(94,35,23,0.08)]'>
          <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#a6806f]'>
            Buying Journey
          </p>
          <div className='mt-5 space-y-4'>
            {[
              {
                title: 'Browse categories',
                description: 'Use filters built for customers, not admin workflows.',
                icon: Sparkles,
              },
              {
                title: 'Save favorites',
                description: 'Keep bridal, festive, and artisan picks in one place.',
                icon: Heart,
              },
              {
                title: 'Track updates',
                description: 'Follow dispatch, delivery, and seller messages from mobile.',
                icon: Clock3,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className='flex gap-3 rounded-[22px] bg-[#fff7f2] p-4'>
                  <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#7a1e2c] shadow-sm'>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className='font-semibold text-[#34160f]'>{item.title}</p>
                    <p className='mt-1 text-sm leading-6 text-[#8b6759]'>
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className='rounded-[30px] border border-[#efdcd2] bg-gradient-to-br from-[#fff6df] to-[#fffaf4] p-6 shadow-[0_18px_45px_rgba(94,35,23,0.06)]'>
          <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#9b6a08]'>
            Need something special?
          </p>
          <h3 className='mt-2 text-2xl font-bold text-[#34160f]'>
            Share a custom Paithani idea.
          </h3>
          <p className='mt-3 text-sm leading-7 text-[#7a6a52]'>
            Tell the artisan your motif, wedding palette, blouse requirement,
            and delivery timeline. We will take you straight into the custom
            request form.
          </p>
          <button
            type='button'
            onClick={onCustomRequest}
            className='mt-5 inline-flex items-center gap-2 rounded-full bg-[#7a1e2c] px-5 py-3 text-sm font-bold text-white'
          >
            Start custom request
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </section>

    <section className='rounded-[30px] border border-[#efdcd2] bg-white p-5 shadow-[0_18px_45px_rgba(94,35,23,0.08)] sm:p-6'>
      <div className='flex items-center justify-between gap-4'>
        <div>
          <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#a6806f]'>
            Recommended for You
          </p>
          <h2 className='mt-2 text-2xl font-bold text-[#34160f]'>
            Curated picks based on your browsing
          </h2>
        </div>
      </div>

      <div className='mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
        {recommendedProducts.map((item) => (
          <ProductPreviewCard
            key={item.id}
            item={item}
            onOpen={onOpenProduct}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  </div>
);

const CustomerDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeller, setSelectedSeller] = useState('');
  const [cartCount, setCartCount] = useState(2);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('login');
    localStorage.removeItem('token');
    localStorage.removeItem('UserId');
    localStorage.removeItem('RoleId');
    showApiSuccess('Logged out successfully');
    window.setTimeout(() => navigate('/'), 300);
  };

  const handleViewDetail = (product) => {
    setSelectedProduct(product);
    setActiveTab('product-detail');
  };

  const handleAddToCart = () => {
    setCartCount((prev) => prev + 1);
    setActiveTab('cart');
  };

  const handleMessageArtisan = (seller) => {
    setSelectedSeller(seller);
    setActiveTab('messages');
  };

  const customerTitle = useMemo(() => {
    if (activeTab === 'product-detail') {
      return 'Product Details | Majhi Paithani';
    }

    const map = {
      home: 'Customer Home | Majhi Paithani',
      categories: 'Shop Sarees | Majhi Paithani',
      custom: 'Custom Design | Majhi Paithani',
      cart: 'Your Cart | Majhi Paithani',
      checkout: 'Checkout | Majhi Paithani',
      orders: 'My Orders | Majhi Paithani',
      messages: 'Messages | Majhi Paithani',
      profile: 'My Profile | Majhi Paithani',
    };

    return map[activeTab] || 'Majhi Paithani';
  }, [activeTab]);

  const renderContent = () => {
    if (activeTab === 'product-detail') {
      return (
        <ProductDetail
          product={selectedProduct}
          onBack={() => {
            setActiveTab('categories');
            setSelectedProduct(null);
          }}
          onAddToCart={handleAddToCart}
          onBuyNow={() => setActiveTab('checkout')}
          onCustomRequest={() => setActiveTab('custom')}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <HomeTab
            onBrowseCollection={() => setActiveTab('categories')}
            onOpenProduct={handleViewDetail}
            onCustomRequest={() => setActiveTab('custom')}
            onAddToCart={handleAddToCart}
            onMessageArtisan={handleMessageArtisan}
          />
        );
      case 'categories':
        return (
          <Categories
            onViewDetail={handleViewDetail}
            searchTerm={searchTerm}
          />
        );
      case 'custom':
        return <CustomDesign />;
      case 'cart':
        return <Cart onCheckout={() => setActiveTab('checkout')} />;
      case 'checkout':
        return (
          <Checkout
            onBack={() => setActiveTab('cart')}
            onSuccess={() => setActiveTab('orders')}
          />
        );
      case 'orders':
        return <Orders />;
      case 'messages':
        return <Messages initialSeller={selectedSeller} />;
      case 'profile':
        return <Profile onLogout={handleLogout} />;
      default:
        return (
          <HomeTab
            onBrowseCollection={() => setActiveTab('categories')}
            onOpenProduct={handleViewDetail}
            onCustomRequest={() => setActiveTab('custom')}
            onAddToCart={handleAddToCart}
            onMessageArtisan={handleMessageArtisan}
          />
        );
    }
  };

  return (
    <>
      <MetaTitle title={customerTitle} />
      <CustomerLayout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartCount}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      >
        {renderContent()}
      </CustomerLayout>
    </>
  );
};

export default CustomerDashboard;
