import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Package,
  ShoppingCart,
  Sparkles,
  Star,
  Store,
  Tag,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { disconnectChatHub, useChatConnection } from '../../hooks/useChatConnection';
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
import { GetAllProductData } from '../../services/Product/ProductApi';

const getUserId = () => {
  try {
    const d = JSON.parse(localStorage.getItem('login') || '{}');
    return d?.userId ?? d?.UserId ?? localStorage.getItem('UserId') ?? '0';
  } catch {
    return '0';
  }
};

const fixUrl = (url) => (typeof url === 'string' ? url : '');

const normalizeProducts = (response) => {
  const raw = Array.isArray(response?.products)
    ? response.products
    : Array.isArray(response?.data)
    ? response.data
    : Array.isArray(response)
    ? response
    : [];

  return raw
    .filter((p) => p?.bIsDeleted !== true && p?.bIsActive !== false)
    .map((p) => ({
      id: p.iProductId,
      iProductId: p.iProductId,
      name: p.sProductTitle ?? p.productName ?? 'Untitled',
      seller: p.sellerName ?? p.sSellerName ?? '',
      sellerUserId: p.sellerUserId ?? p.iSellerUserId ?? null,
      price: Number(p.dcBasePrice ?? 0),
      color: p.sColor ?? '',
      fabric: p.sFabric ?? '',
      design: p.sDesignType ?? '',
      stock: Number(p.productstock ?? p.iStock ?? 0),
      isCustomizationAvailable: p.bIsCustomizationAvailable ?? false,
      description: p.sDescription ?? '',
      images: Array.isArray(p.images)
        ? p.images.map((img) => fixUrl(img.sImageUrl ?? img.src ?? '')).filter(Boolean)
        : [],
    }));
};

// ── Product card ──────────────────────────────────────────────────────────────
const ProductCard = ({ item, onOpen, onAddToCart, onChatSeller }) => {
  const [activeImg, setActiveImg] = useState(0);
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);
  const hasImages = item.images.length > 0;
  const total = item.images.length;
  const isOutOfStock = item.stock === 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setAdded(true);
    onAddToCart(item);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleChat = (e) => {
    e.stopPropagation();
    onChatSeller({ sellerId: item.sellerUserId, sellerName: item.seller });
  };

  return (
    <div className='group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5'>

      {/* Image block */}
      <div className='relative overflow-hidden bg-[#faf7f5]' style={{ aspectRatio: '4/5' }}>
        {hasImages ? (
          <img
            src={item.images[activeImg]}
            alt={item.name}
            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer'
            onClick={() => onOpen(item)}
          />
        ) : (
          <div className='w-full h-full flex flex-col items-center justify-center cursor-pointer' onClick={() => onOpen(item)}>
            <Package size={48} className='text-[#d4b5a8]' />
            <p className='mt-2 text-xs text-[#c4a090]'>No image</p>
          </div>
        )}

        {isOutOfStock && (
          <div className='absolute inset-0 bg-black/40 flex items-center justify-center'>
            <span className='bg-white text-[#7a1e2c] text-xs font-bold px-4 py-1.5 rounded-full shadow'>Out of Stock</span>
          </div>
        )}

        {!isOutOfStock && item.stock <= 5 && (
          <span className='absolute top-2.5 left-2.5 bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow'>
            Only {item.stock} left
          </span>
        )}
        {!isOutOfStock && item.stock > 5 && (
          <span className='absolute top-2.5 left-2.5 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow'>
            In Stock · {item.stock}
          </span>
        )}

        <button
          type='button'
          onClick={(e) => { e.stopPropagation(); setWished((w) => !w); }}
          className={`absolute top-2.5 right-2.5 h-9 w-9 flex items-center justify-center rounded-full shadow transition-all duration-200 ${
            wished ? 'bg-[#7a1e2c] text-white scale-110' : 'bg-white/90 text-[#7a1e2c] hover:bg-white'
          }`}
        >
          <Heart size={15} fill={wished ? 'currentColor' : 'none'} />
        </button>

        {total > 1 && (
          <>
            <button type='button' onClick={(e) => { e.stopPropagation(); setActiveImg((i) => (i - 1 + total) % total); }}
              className='absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-full bg-white/85 text-[#7a1e2c] shadow opacity-0 group-hover:opacity-100 transition-opacity'>
              <ChevronLeft size={14} />
            </button>
            <button type='button' onClick={(e) => { e.stopPropagation(); setActiveImg((i) => (i + 1) % total); }}
              className='absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-full bg-white/85 text-[#7a1e2c] shadow opacity-0 group-hover:opacity-100 transition-opacity'>
              <ChevronRight size={14} />
            </button>
          </>
        )}

        {total > 1 && (
          <div className='absolute bottom-0 left-0 right-0 flex gap-1.5 px-2 pb-2 pt-6 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
            {item.images.map((src, i) => (
              <button key={i} type='button' onClick={(e) => { e.stopPropagation(); setActiveImg(i); }}
                className={`h-10 w-10 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${i === activeImg ? 'border-white scale-105' : 'border-white/40 hover:border-white/80'}`}>
                <img src={src} alt='' className='h-full w-full object-cover' />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info block */}
      <div className='flex flex-col flex-1 p-3.5'>
        <div className='flex items-center gap-1 mb-1'>
          <Store size={11} className='text-[#a6806f]' />
          <p className='text-[11px] text-[#a6806f] font-medium truncate'>{item.seller || 'Paithani Artisan'}</p>
        </div>

        <p className='text-sm font-bold text-[#1a0a07] leading-snug line-clamp-2 cursor-pointer hover:text-[#7a1e2c] transition-colors' onClick={() => onOpen(item)}>
          {item.name}
        </p>

        <div className='flex flex-wrap gap-1 mt-1.5'>
          {item.color && (
            <span className='inline-flex items-center gap-0.5 text-[10px] bg-[#fff1e7] text-[#7a1e2c] px-2 py-0.5 rounded-full font-medium'>
              <Tag size={9} /> {item.color}
            </span>
          )}
          {item.fabric && (
            <span className='text-[10px] bg-[#f0f9f4] text-emerald-700 px-2 py-0.5 rounded-full font-medium'>{item.fabric}</span>
          )}
          {item.isCustomizationAvailable && (
            <span className='inline-flex items-center gap-0.5 text-[10px] bg-[#fff8e1] text-amber-700 px-2 py-0.5 rounded-full font-medium'>
              <Sparkles size={9} /> Custom
            </span>
          )}
        </div>

        <div className='flex items-center justify-between mt-2'>
          <p className='text-base font-extrabold text-[#7a1e2c]'>₹{item.price.toLocaleString('en-IN')}</p>
          <span className='flex items-center gap-0.5 text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full'>
            <Star size={10} fill='currentColor' /> 4.8
          </span>
        </div>

        {/* Action buttons: Add to Cart | View | Chat Seller */}
        <div className='mt-3 flex gap-1.5'>
          <button
            type='button'
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : added
                ? 'bg-emerald-600 text-white scale-95'
                : 'bg-[#7a1e2c] text-white hover:bg-[#651623] active:scale-95'
            }`}
          >
            <ShoppingCart size={13} />
            {added ? 'Added!' : isOutOfStock ? 'Unavailable' : 'Add to Cart'}
          </button>

          <button
            type='button'
            onClick={() => onOpen(item)}
            title='View details'
            className='flex items-center justify-center px-2.5 py-2.5 rounded-xl border border-[#e8d5cc] text-[#7a1e2c] hover:bg-[#fff1e7] transition-colors'
          >
            <Zap size={13} />
          </button>

          {item.sellerUserId && (
            <button
              type='button'
              onClick={handleChat}
              title={`Chat with ${item.seller || 'seller'}`}
              className='flex items-center justify-center px-2.5 py-2.5 rounded-xl border border-[#e8d5cc] text-[#7a1e2c] hover:bg-[#fff1e7] transition-colors'
            >
              <MessageCircle size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Horizontal scroll section ─────────────────────────────────────────────────
const ScrollSection = ({ title, subtitle, products, onOpen, onAddToCart, onChatSeller, onViewAll }) => {
  const ref = useRef(null);
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  if (!products.length) return null;

  return (
    <section className='rounded-2xl border border-gray-100 bg-white p-5 shadow-sm'>
      <div className='flex items-end justify-between mb-5'>
        <div>
          <p className='text-[11px] font-bold uppercase tracking-widest text-[#a6806f]'>{subtitle}</p>
          <h2 className='mt-1 text-xl font-extrabold text-[#1a0a07]'>{title}</h2>
        </div>
        <div className='flex items-center gap-2'>
          <button type='button' onClick={() => scroll(-1)} className='h-8 w-8 flex items-center justify-center rounded-full border border-gray-200 text-[#7a1e2c] hover:bg-[#fff1e7] transition-colors'>
            <ChevronLeft size={16} />
          </button>
          <button type='button' onClick={() => scroll(1)} className='h-8 w-8 flex items-center justify-center rounded-full border border-gray-200 text-[#7a1e2c] hover:bg-[#fff1e7] transition-colors'>
            <ChevronRight size={16} />
          </button>
          {onViewAll && (
            <button type='button' onClick={onViewAll} className='ml-1 flex items-center gap-1 text-xs font-semibold text-[#7a1e2c] hover:underline'>
              View all <ArrowRight size={12} />
            </button>
          )}
        </div>
      </div>
      <div ref={ref} className='flex gap-4 overflow-x-auto pb-1' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {products.map((item) => (
          <div key={item.id} className='w-[220px] shrink-0'>
            <ProductCard item={item} onOpen={onOpen} onAddToCart={onAddToCart} onChatSeller={onChatSeller} />
          </div>
        ))}
      </div>
    </section>
  );
};

// ── All products grid ─────────────────────────────────────────────────────────
const AllProductsGrid = ({ products, onOpen, onAddToCart, onChatSeller, onViewAll }) => {
  if (!products.length) return null;
  return (
    <section className='rounded-2xl border border-gray-100 bg-white p-5 shadow-sm'>
      <div className='flex items-end justify-between mb-5'>
        <div>
          <p className='text-[11px] font-bold uppercase tracking-widest text-[#a6806f]'>All Products</p>
          <h2 className='mt-1 text-xl font-extrabold text-[#1a0a07]'>
            Complete Collection · <span className='text-[#7a1e2c]'>{products.length} sarees</span>
          </h2>
        </div>
        <button type='button' onClick={onViewAll} className='flex items-center gap-1 text-xs font-semibold text-[#7a1e2c] hover:underline'>
          Browse all <ArrowRight size={12} />
        </button>
      </div>
      <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
        {products.map((item) => (
          <ProductCard key={item.id} item={item} onOpen={onOpen} onAddToCart={onAddToCart} onChatSeller={onChatSeller} />
        ))}
      </div>
    </section>
  );
};

// ── Hero banner ───────────────────────────────────────────────────────────────
const HeroBanner = ({ onShop, onCustom, totalProducts }) => (
  <section className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#4a0e1c] via-[#7a1e2c] to-[#3d0f1a] px-6 py-8 text-white shadow-xl sm:px-10 sm:py-12'>
    <div className='absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#f5d47c]/10 blur-3xl pointer-events-none' />
    <div className='absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-white/5 blur-3xl pointer-events-none' />
    <div className='relative max-w-2xl'>
      <div className='inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#f5d47c] backdrop-blur-sm mb-4'>
        <Sparkles size={11} /> Handcrafted Paithani Sarees
      </div>
      <h1 className='font-serif text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl'>
        Discover authentic <span className='text-[#f5d47c]'>Paithani sarees</span> from master weavers.
      </h1>
      <p className='mt-4 text-sm leading-7 text-white/70 max-w-lg'>
        Browse {totalProducts}+ handcrafted sarees directly from artisans. Real images, real stock, real prices.
      </p>
      <div className='mt-6 flex flex-wrap gap-3'>
        <button type='button' onClick={onShop} className='inline-flex items-center gap-2 rounded-full bg-[#f5d47c] px-6 py-3 text-sm font-bold text-[#3d0f1a] transition hover:bg-[#f0ca60] active:scale-95'>
          <ShoppingCart size={15} /> Shop Now
        </button>
        <button type='button' onClick={onCustom} className='inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15'>
          Custom Design <ArrowRight size={14} />
        </button>
      </div>
    </div>
  </section>
);

// ── HomeTab ───────────────────────────────────────────────────────────────────
const HomeTab = ({ products, onBrowseCollection, onOpenProduct, onCustomRequest, onAddToCart, onChatSeller }) => {
  const inStock = products.filter((p) => p.stock > 0);
  const outOfStock = products.filter((p) => p.stock === 0);
  const customizable = products.filter((p) => p.isCustomizationAvailable);
  const newArrivals = [...products].reverse().slice(0, 10);

  return (
    <div className='space-y-5'>
      <HeroBanner onShop={onBrowseCollection} onCustom={onCustomRequest} totalProducts={products.length} />

      {products.length > 0 && (
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
          {[
            { label: 'Total Products', value: products.length, color: 'bg-[#fff1e7] text-[#7a1e2c]' },
            { label: 'In Stock', value: inStock.length, color: 'bg-[#f0fdf4] text-emerald-700' },
            { label: 'Out of Stock', value: outOfStock.length, color: 'bg-[#fef2f2] text-red-600' },
            { label: 'Customizable', value: customizable.length, color: 'bg-[#fffbeb] text-amber-700' },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl p-4 ${s.color} border border-current/10`}>
              <p className='text-2xl font-extrabold'>{s.value}</p>
              <p className='text-xs font-semibold mt-0.5 opacity-80'>{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <ScrollSection
        title='New Arrivals' subtitle='Just added'
        products={newArrivals} onOpen={onOpenProduct}
        onAddToCart={onAddToCart} onChatSeller={onChatSeller}
        onViewAll={onBrowseCollection}
      />

      {customizable.length > 0 && (
        <ScrollSection
          title='Make It Yours' subtitle='Customizable sarees'
          products={customizable} onOpen={onOpenProduct}
          onAddToCart={onAddToCart} onChatSeller={onChatSeller}
        />
      )}

      <AllProductsGrid
        products={products} onOpen={onOpenProduct}
        onAddToCart={onAddToCart} onChatSeller={onChatSeller}
        onViewAll={onBrowseCollection}
      />
    </div>
  );
};

// ── Main CustomerDashboard ────────────────────────────────────────────────────
const CustomerDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const connection = useChatConnection();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [chatTarget, setChatTarget] = useState(null); // { sellerId, sellerName }
  const [cartCount, setCartCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    GetAllProductData(getUserId())
      .then((res) => setProducts(normalizeProducts(res)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!connection) return;
    const handler = () => setUnreadCount((prev) => prev + 1);
    connection.on('NewMessageNotification', handler);
    return () => connection.off('NewMessageNotification', handler);
  }, [connection]);

  useEffect(() => {
    if (activeTab === 'messages') setUnreadCount(0);
  }, [activeTab]);

  const handleLogout = () => {
    disconnectChatHub();
    logout();
    ['login', 'token', 'UserId', 'RoleId'].forEach((k) => localStorage.removeItem(k));
    showApiSuccess('Logged out successfully');
    window.setTimeout(() => navigate('/'), 300);
  };

  const handleViewDetail = (product) => { setSelectedProduct(product); setActiveTab('product-detail'); };
  const handleAddToCart = () => { setCartCount((c) => c + 1); setActiveTab('cart'); };

  // Called from product card Chat button — passes sellerUserId + sellerName
  const handleChatSeller = ({ sellerId, sellerName }) => {
    setChatTarget({ sellerId, sellerName });
    setActiveTab('messages');
    setUnreadCount(0);
  };

  const customerTitle = useMemo(() => {
    if (activeTab === 'product-detail') return 'Product Details | Majhi Paithani';
    return ({
      home: 'Customer Home | Majhi Paithani',
      categories: 'Shop Sarees | Majhi Paithani',
      custom: 'Custom Design | Majhi Paithani',
      cart: 'Your Cart | Majhi Paithani',
      checkout: 'Checkout | Majhi Paithani',
      orders: 'My Orders | Majhi Paithani',
      messages: 'Messages | Majhi Paithani',
      profile: 'My Profile | Majhi Paithani',
    })[activeTab] || 'Majhi Paithani';
  }, [activeTab]);

  const renderContent = () => {
    if (activeTab === 'product-detail') {
      return (
        <ProductDetail
          product={selectedProduct}
          onBack={() => { setActiveTab('categories'); setSelectedProduct(null); }}
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
            products={products}
            onBrowseCollection={() => setActiveTab('categories')}
            onOpenProduct={handleViewDetail}
            onCustomRequest={() => setActiveTab('custom')}
            onAddToCart={handleAddToCart}
            onChatSeller={handleChatSeller}
          />
        );
      case 'categories':
        return <Categories onViewDetail={handleViewDetail} searchTerm={searchTerm} />;
      case 'custom':
        return <CustomDesign />;
      case 'cart':
        return <Cart onCheckout={() => setActiveTab('checkout')} />;
      case 'checkout':
        return <Checkout onBack={() => setActiveTab('cart')} onSuccess={() => setActiveTab('orders')} />;
      case 'orders':
        return <Orders />;
      case 'messages':
        return (
          <Messages
            initialReceiverId={chatTarget?.sellerId}
            initialReceiverName={chatTarget?.sellerName}
          />
        );
      case 'profile':
        return <Profile onLogout={handleLogout} />;
      default:
        return (
          <HomeTab
            products={products}
            onBrowseCollection={() => setActiveTab('categories')}
            onOpenProduct={handleViewDetail}
            onCustomRequest={() => setActiveTab('custom')}
            onAddToCart={handleAddToCart}
            onChatSeller={handleChatSeller}
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
        unreadCount={unreadCount}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      >
        {renderContent()}
      </CustomerLayout>
    </>
  );
};

export default CustomerDashboard;
