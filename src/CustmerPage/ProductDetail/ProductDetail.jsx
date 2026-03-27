import { useState } from 'react';
import { Star, Heart, ShoppingCart, Zap, Palette, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

const IMAGES = ['🥻', '🪡', '✨', '🎨'];

const REVIEWS = [
  { id: 1, name: 'Priya S.',   rating: 5, comment: 'Absolutely stunning saree! The quality is exceptional.', date: '12 Jan 2024' },
  { id: 2, name: 'Meera K.',   rating: 4, comment: 'Beautiful craftsmanship. Delivery was on time.', date: '8 Jan 2024' },
  { id: 3, name: 'Anita R.',   rating: 5, comment: 'Worth every rupee. The pallu design is gorgeous.', date: '2 Jan 2024' },
];

const ProductDetail = ({ product, onBack, onAddToCart }) => {
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);

  const p = product || {
    name: 'Peacock Motif Paithani',
    price: '₹12,500 – ₹18,000',
    description: 'A masterpiece of traditional Paithani weaving featuring intricate peacock motifs on pure silk. Each saree is handwoven by skilled artisans from Yeola, taking 3–6 months to complete.',
    seller: 'Ravi Handlooms',
    shop: 'Ravi Silk Emporium',
    location: 'Yeola, Nashik',
    rating: 4.8,
    reviews: 128,
    attributes: {
      Border: 'Gold Zari',
      Pallu: 'Peacock Motif',
      Motifs: 'Peacock, Lotus',
      Color: 'Deep Green',
      Fabric: 'Pure Silk',
      Length: '5.5 meters',
    },
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-[#7a1e2c] mb-6 hover:underline"
      >
        <ChevronLeft size={16} /> Back to Products
      </button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Image Gallery */}
        <div>
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#fff9f4] to-[#fde8d8] flex items-center justify-center h-80 sm:h-96 shadow-md">
            <span className="text-[120px]">{IMAGES[activeImg]}</span>
            <button
              onClick={() => setActiveImg((p) => (p - 1 + IMAGES.length) % IMAGES.length)}
              className="absolute left-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow transition hover:bg-white"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setActiveImg((p) => (p + 1) % IMAGES.length)}
              className="absolute right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow transition hover:bg-white"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="flex gap-3 mt-4">
            {IMAGES.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={[
                  'flex h-16 w-16 items-center justify-center rounded-2xl border-2 text-2xl transition',
                  activeImg === i ? 'border-[#7a1e2c] bg-[#fff8f3]' : 'border-[#f0e4de] bg-white',
                ].join(' ')}
              >
                {img}
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-5">
          <div>
            <h1 className="text-2xl font-bold text-[#3d1e17] sm:text-3xl">{p.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1 text-[#c28b1e]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < Math.floor(p.rating) ? 'currentColor' : 'none'} />
                ))}
              </div>
              <span className="text-sm font-semibold text-[#3d1e17]">{p.rating}</span>
              <span className="text-xs text-[#9b7b69]">({p.reviews} reviews)</span>
            </div>
            <p className="mt-3 text-2xl font-bold text-[#7a1e2c]">{p.price}</p>
          </div>

          <p className="text-sm leading-7 text-[#6a4a42]">{p.description}</p>

          {/* Attributes */}
          <div className="rounded-[20px] border border-[#f0e4de] bg-[#fff8f3] p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-[#9b7b69] mb-3">Design Attributes</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(p.attributes).map(([key, val]) => (
                <div key={key} className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-[#9b7b69]">{key}</span>
                  <span className="text-sm font-semibold text-[#3d1e17]">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Seller card */}
          <div className="rounded-[20px] border border-[#f0e4de] bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-[#9b7b69] mb-3">Seller Information</p>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#c28b1e] to-[#7a1e2c] text-white text-xl shadow">
                🧵
              </div>
              <div>
                <p className="font-semibold text-[#3d1e17]">{p.seller}</p>
                <p className="text-xs text-[#9b7b69]">{p.shop}</p>
                <div className="flex items-center gap-1 mt-0.5 text-[#9b7b69]">
                  <MapPin size={11} /><span className="text-xs">{p.location}</span>
                </div>
              </div>
              <div className="ml-auto flex items-center gap-1 text-[#c28b1e]">
                <Star size={13} fill="currentColor" />
                <span className="text-sm font-bold text-[#3d1e17]">{p.rating}</span>
              </div>
            </div>
          </div>

          {/* Qty + Actions */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-[#e9d7cf] bg-white px-3 py-2">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="text-[#7a1e2c] font-bold text-lg w-6">−</button>
              <span className="w-6 text-center text-sm font-semibold text-[#3d1e17]">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="text-[#7a1e2c] font-bold text-lg w-6">+</button>
            </div>
            <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e9d7cf] bg-white text-[#7a1e2c] transition hover:bg-[#fff8f3]">
              <Heart size={16} />
            </button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => onAddToCart && onAddToCart(p, qty)}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-[#7a1e2c] bg-white py-3 text-sm font-bold text-[#7a1e2c] transition hover:bg-[#fff8f3]"
            >
              <ShoppingCart size={16} /> Add to Cart
            </button>
            <button className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#7a1e2c] to-[#a52b39] py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90">
              <Zap size={16} /> Buy Now
            </button>
          </div>
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#c28b1e] bg-[#fffbf0] py-3 text-sm font-bold text-[#c28b1e] transition hover:bg-[#fff3d0]">
            <Palette size={16} /> Request Customization
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-[#3d1e17] mb-5">Customer Reviews</h2>
        <div className="space-y-4">
          {REVIEWS.map((r) => (
            <div key={r.id} className="rounded-[20px] border border-[#f0e4de] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#7a1e2c] to-[#c28b1e] text-white text-xs font-bold">
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#3d1e17]">{r.name}</p>
                    <p className="text-xs text-[#9b7b69]">{r.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 text-[#c28b1e]">
                  {[...Array(r.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#6a4a42]">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
