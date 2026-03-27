import { useState } from 'react';
import { Star, Heart, SlidersHorizontal, X, ChevronDown } from 'lucide-react';

const PRODUCTS = [
  { id: 1, name: 'Peacock Motif Paithani', price: '₹12,500 – ₹18,000', seller: 'Artisan Ravi',   rating: 4.8, tag: 'Bestseller', fabric: 'Pure Silk',  color: 'Green' },
  { id: 2, name: 'Bridal Gold Border',     price: '₹22,000 – ₹35,000', seller: 'Weaver Sunita', rating: 4.9, tag: 'Premium',    fabric: 'Pure Silk',  color: 'Red' },
  { id: 3, name: 'Lotus Pallu Design',     price: '₹9,800 – ₹14,500',  seller: 'Artisan Mohan', rating: 4.7, tag: 'New',        fabric: 'Silk Cotton', color: 'Purple' },
  { id: 4, name: 'Classic Yeola Silk',     price: '₹15,000 – ₹25,000', seller: 'Weaver Priya',  rating: 4.6, tag: 'Popular',   fabric: 'Pure Silk',  color: 'Blue' },
  { id: 5, name: 'Zari Work Paithani',     price: '₹18,000 – ₹28,000', seller: 'Artisan Ravi',  rating: 4.8, tag: 'Premium',   fabric: 'Pure Silk',  color: 'Gold' },
  { id: 6, name: 'Floral Border Saree',    price: '₹8,500 – ₹12,000',  seller: 'Weaver Sunita', rating: 4.5, tag: 'New',       fabric: 'Silk Cotton', color: 'Pink' },
];

const FABRICS = ['Pure Silk', 'Silk Cotton', 'Handloom Cotton'];
const COLORS  = ['Red', 'Green', 'Blue', 'Purple', 'Gold', 'Pink'];
const DESIGNS = ['Traditional', 'Bridal', 'Designer', 'Custom'];

const TAG_COLORS = {
  Bestseller: 'bg-[#7a1e2c] text-white',
  Premium:    'bg-[#c28b1e] text-white',
  New:        'bg-emerald-600 text-white',
  Popular:    'bg-[#5d1228] text-white',
};

const FilterSection = ({ title, items, selected, onToggle }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-[#f0e4de] pb-4 mb-4">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-between text-sm font-semibold text-[#3d1e17] mb-3"
      >
        {title} <ChevronDown size={14} className={`transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <button
              key={item}
              onClick={() => onToggle(item)}
              className={[
                'rounded-xl border px-3 py-1.5 text-xs font-medium transition',
                selected.includes(item)
                  ? 'border-[#7a1e2c] bg-[#7a1e2c] text-white'
                  : 'border-[#e9d7cf] bg-white text-[#6a4a42] hover:border-[#7a1e2c]',
              ].join(' ')}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ProductCard = ({ item, onViewDetail }) => (
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
      <h3 className="font-semibold text-[#3d1e17] text-sm">{item.name}</h3>
      <p className="mt-1 text-xs text-[#9b7b69]">{item.seller}</p>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-sm font-bold text-[#7a1e2c]">{item.price}</p>
        <div className="flex items-center gap-1 text-[#c28b1e]">
          <Star size={12} fill="currentColor" />
          <span className="text-xs font-semibold text-[#3d1e17]">{item.rating}</span>
        </div>
      </div>
      <button
        onClick={() => onViewDetail(item)}
        className="mt-3 w-full rounded-xl bg-gradient-to-r from-[#7a1e2c] to-[#a52b39] py-2 text-xs font-semibold text-white transition hover:opacity-90"
      >
        View Details
      </button>
    </div>
  </div>
);

const Categories = ({ onViewDetail }) => {
  const [fabrics,  setFabrics]  = useState([]);
  const [colors,   setColors]   = useState([]);
  const [designs,  setDesigns]  = useState([]);
  const [price,    setPrice]    = useState(35000);
  const [showFilter, setShowFilter] = useState(false);

  const toggle = (setter, arr, val) =>
    setter(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const filtered = PRODUCTS.filter((p) => {
    if (fabrics.length  && !fabrics.includes(p.fabric))  return false;
    if (colors.length   && !colors.includes(p.color))    return false;
    return true;
  });

  const FilterPanel = () => (
    <div className="rounded-[22px] border border-[#f0e4de] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <p className="font-bold text-[#3d1e17]">Filters</p>
        <button
          onClick={() => { setFabrics([]); setColors([]); setDesigns([]); setPrice(35000); }}
          className="text-xs text-[#7a1e2c] font-semibold hover:underline"
        >
          Clear All
        </button>
      </div>

      {/* Price */}
      <div className="border-b border-[#f0e4de] pb-4 mb-4">
        <p className="text-sm font-semibold text-[#3d1e17] mb-3">
          Price Range <span className="text-[#7a1e2c]">up to ₹{price.toLocaleString()}</span>
        </p>
        <input
          type="range" min={5000} max={35000} step={500}
          value={price} onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full accent-[#7a1e2c]"
        />
        <div className="flex justify-between text-xs text-[#9b7b69] mt-1">
          <span>₹5,000</span><span>₹35,000</span>
        </div>
      </div>

      <FilterSection title="Fabric Type" items={FABRICS} selected={fabrics} onToggle={(v) => toggle(setFabrics, fabrics, v)} />
      <FilterSection title="Color"       items={COLORS}  selected={colors}  onToggle={(v) => toggle(setColors,  colors,  v)} />
      <FilterSection title="Design Type" items={DESIGNS} selected={designs} onToggle={(v) => toggle(setDesigns, designs, v)} />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#3d1e17]">All Sarees</h1>
          <p className="text-sm text-[#9b7b69] mt-1">{filtered.length} products found</p>
        </div>
        <button
          onClick={() => setShowFilter((p) => !p)}
          className="flex items-center gap-2 rounded-xl border border-[#e9d7cf] bg-white px-4 py-2 text-sm font-medium text-[#6a4a42] shadow-sm transition hover:bg-[#fff8f3] lg:hidden"
        >
          <SlidersHorizontal size={15} /> Filters
        </button>
      </div>

      {/* Mobile filter drawer */}
      {showFilter && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilter(false)} />
          <div className="relative ml-auto h-full w-[300px] overflow-y-auto bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <p className="font-bold text-[#3d1e17]">Filters</p>
              <button onClick={() => setShowFilter(false)}><X size={18} /></button>
            </div>
            <FilterPanel />
          </div>
        </div>
      )}

      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 shrink-0"><FilterPanel /></aside>

        {/* Product grid */}
        <div className="flex-1 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <ProductCard key={item.id} item={item} onViewDetail={onViewDetail} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
