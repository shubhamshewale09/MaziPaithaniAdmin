import { useMemo, useState } from 'react';
import {
  Heart,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
} from 'lucide-react';

const PRODUCTS = [
  {
    id: 1,
    name: 'Peacock Motif Paithani',
    price: 14500,
    seller: 'Ravi Handlooms',
    rating: 4.8,
    tag: 'Bestseller',
    fabric: 'Pure Silk',
    color: 'Green',
    design: 'Traditional',
  },
  {
    id: 2,
    name: 'Bridal Gold Border',
    price: 28000,
    seller: 'Sunita Weaves',
    rating: 4.9,
    tag: 'Wedding Edit',
    fabric: 'Pure Silk',
    color: 'Red',
    design: 'Bridal',
  },
  {
    id: 3,
    name: 'Lotus Pallu Design',
    price: 11200,
    seller: 'Mohan Silk House',
    rating: 4.7,
    tag: 'New Arrival',
    fabric: 'Silk Cotton',
    color: 'Pink',
    design: 'Designer',
  },
  {
    id: 4,
    name: 'Classic Yeola Silk',
    price: 19500,
    seller: 'Priya Paithani Studio',
    rating: 4.6,
    tag: 'Ready to Ship',
    fabric: 'Pure Silk',
    color: 'Blue',
    design: 'Traditional',
  },
  {
    id: 5,
    name: 'Royal Zari Weave',
    price: 32000,
    seller: 'Shree Artisan Looms',
    rating: 4.9,
    tag: 'Premium',
    fabric: 'Pure Silk',
    color: 'Gold',
    design: 'Bridal',
  },
  {
    id: 6,
    name: 'Festival Border Paithani',
    price: 16800,
    seller: 'Kasturi Handcrafts',
    rating: 4.5,
    tag: 'Popular',
    fabric: 'Silk Cotton',
    color: 'Purple',
    design: 'Designer',
  },
];

const FABRICS = ['Pure Silk', 'Silk Cotton'];
const COLORS = ['Red', 'Green', 'Blue', 'Pink', 'Gold', 'Purple'];
const DESIGNS = ['Traditional', 'Bridal', 'Designer'];

const FILTER_SECTIONS = [
  { key: 'fabric', label: 'Fabric', options: FABRICS },
  { key: 'color', label: 'Color', options: COLORS },
  { key: 'design', label: 'Design', options: DESIGNS },
];

const tagClasses = {
  Bestseller: 'bg-[#7a1e2c] text-white',
  'Wedding Edit': 'bg-[#9b6a08] text-white',
  'New Arrival': 'bg-emerald-600 text-white',
  'Ready to Ship': 'bg-sky-700 text-white',
  Premium: 'bg-[#5a1220] text-white',
  Popular: 'bg-[#69452f] text-white',
};

const FilterChip = ({ active, children, onClick }) => (
  <button
    type='button'
    onClick={onClick}
    className={[
      'rounded-full border px-3 py-2 text-xs font-semibold transition',
      active
        ? 'border-[#7a1e2c] bg-[#7a1e2c] text-white'
        : 'border-[#ead9cf] bg-white text-[#6b5048] hover:border-[#7a1e2c] hover:text-[#7a1e2c]',
    ].join(' ')}
  >
    {children}
  </button>
);

const ProductCard = ({ item, onViewDetail }) => (
  <div className='rounded-[28px] border border-[#efdcd2] bg-white p-4 shadow-[0_18px_45px_rgba(94,35,23,0.08)] transition hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(94,35,23,0.12)]'>
    <div className='relative rounded-[24px] bg-gradient-to-br from-[#fff8f1] via-[#fdecd9] to-[#f7d9c6] p-5'>
      <span
        className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-semibold ${tagClasses[item.tag] || 'bg-[#7a1e2c] text-white'}`}
      >
        {item.tag}
      </span>
      <button
        type='button'
        className='absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-[#7a1e2c] shadow-sm'
      >
        <Heart size={15} />
      </button>
      <div className='flex h-52 items-center justify-center rounded-[22px] border border-white/40 bg-white/30 text-7xl shadow-inner'>
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

      <div className='mt-4 flex flex-wrap gap-2'>
        <span className='rounded-full bg-[#fff1e7] px-3 py-1 text-xs font-medium text-[#7a1e2c]'>
          {item.fabric}
        </span>
        <span className='rounded-full bg-[#fff1e7] px-3 py-1 text-xs font-medium text-[#7a1e2c]'>
          {item.color}
        </span>
        <span className='rounded-full bg-[#fff1e7] px-3 py-1 text-xs font-medium text-[#7a1e2c]'>
          {item.design}
        </span>
      </div>

      <div className='mt-4 flex items-center justify-between gap-3'>
        <div>
          <p className='text-xs uppercase tracking-[0.24em] text-[#a6806f]'>
            Starting from
          </p>
          <p className='mt-1 text-xl font-bold text-[#7a1e2c]'>
            Rs {item.price.toLocaleString()}
          </p>
        </div>
        <button
          type='button'
          onClick={() => onViewDetail(item)}
          className='rounded-full bg-[#7a1e2c] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90'
        >
          View Details
        </button>
      </div>
    </div>
  </div>
);

const Categories = ({ onViewDetail, searchTerm = '' }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    fabric: [],
    color: [],
    design: [],
  });
  const [maxPrice, setMaxPrice] = useState(35000);
  const [showFilters, setShowFilters] = useState(false);
  const [localSearch, setLocalSearch] = useState('');

  const effectiveSearch = (searchTerm || localSearch).trim().toLowerCase();

  const toggleFilter = (key, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((item) => item !== value)
        : [...prev[key], value],
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      fabric: [],
      color: [],
      design: [],
    });
    setMaxPrice(35000);
  };

  const filteredProducts = useMemo(
    () =>
      PRODUCTS.filter((item) => {
        if (selectedFilters.fabric.length && !selectedFilters.fabric.includes(item.fabric)) {
          return false;
        }
        if (selectedFilters.color.length && !selectedFilters.color.includes(item.color)) {
          return false;
        }
        if (selectedFilters.design.length && !selectedFilters.design.includes(item.design)) {
          return false;
        }
        if (item.price > maxPrice) {
          return false;
        }

        if (!effectiveSearch) {
          return true;
        }

        return [item.name, item.seller, item.color, item.design, item.fabric]
          .join(' ')
          .toLowerCase()
          .includes(effectiveSearch);
      }),
    [effectiveSearch, maxPrice, selectedFilters],
  );

  const filterPanel = (
    <div className='rounded-[28px] border border-[#efdcd2] bg-white p-5 shadow-[0_18px_45px_rgba(94,35,23,0.08)]'>
      <div className='flex items-center justify-between gap-3'>
        <div>
          <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#a6806f]'>
            Filter Sarees
          </p>
          <p className='mt-1 text-lg font-bold text-[#34160f]'>Refine your shortlist</p>
        </div>
        <button
          type='button'
          onClick={clearFilters}
          className='text-xs font-semibold text-[#7a1e2c]'
        >
          Clear all
        </button>
      </div>

      <div className='mt-5'>
        <label className='block text-sm font-semibold text-[#34160f]'>Budget</label>
        <p className='mt-2 text-sm text-[#8b6759]'>
          Up to <span className='font-bold text-[#7a1e2c]'>Rs {maxPrice.toLocaleString()}</span>
        </p>
        <input
          type='range'
          min={10000}
          max={35000}
          step={500}
          value={maxPrice}
          onChange={(event) => setMaxPrice(Number(event.target.value))}
          className='mt-3 w-full accent-[#7a1e2c]'
        />
        <div className='mt-1 flex items-center justify-between text-xs text-[#a6806f]'>
          <span>Rs 10,000</span>
          <span>Rs 35,000</span>
        </div>
      </div>

      <div className='mt-6 space-y-5'>
        {FILTER_SECTIONS.map((section) => (
          <div key={section.key}>
            <p className='text-sm font-semibold text-[#34160f]'>{section.label}</p>
            <div className='mt-3 flex flex-wrap gap-2'>
              {section.options.map((option) => (
                <FilterChip
                  key={option}
                  active={selectedFilters[section.key].includes(option)}
                  onClick={() => toggleFilter(section.key, option)}
                >
                  {option}
                </FilterChip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className='space-y-6'>
      <section className='rounded-[32px] border border-[#efdcd2] bg-white p-5 shadow-[0_20px_50px_rgba(94,35,23,0.08)] sm:p-6'>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#a6806f]'>
              Shop All Sarees
            </p>
            <h1 className='mt-2 text-3xl font-bold text-[#34160f]'>
              Browse Paithani collections made for customers
            </h1>
            <p className='mt-3 max-w-2xl text-sm leading-7 text-[#8b6759]'>
              Compare artisans, color stories, silk types, and budget ranges in
              a cleaner storefront view. No sidebar admin panels here.
            </p>
          </div>

          <div className='flex flex-col gap-3 sm:flex-row'>
            <div className='flex min-w-[240px] items-center gap-3 rounded-full border border-[#ead9cf] bg-[#fffaf6] px-4 py-3'>
              <Search size={16} className='text-[#9b7b69]' />
              <input
                type='text'
                value={localSearch}
                onChange={(event) => setLocalSearch(event.target.value)}
                placeholder='Search inside collection'
                className='w-full bg-transparent text-sm text-[#34160f] outline-none placeholder:text-[#b19588]'
              />
            </div>
            <button
              type='button'
              onClick={() => setShowFilters(true)}
              className='inline-flex items-center justify-center gap-2 rounded-full border border-[#ead9cf] bg-white px-4 py-3 text-sm font-semibold text-[#7a1e2c] lg:hidden'
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>
          </div>
        </div>

        <div className='mt-5 flex flex-wrap items-center gap-2'>
          {['Bridal', 'Traditional', 'Ready to ship', 'Gift picks'].map((item) => (
            <span
              key={item}
              className='inline-flex items-center gap-1 rounded-full bg-[#fff1e7] px-3 py-2 text-xs font-semibold text-[#7a1e2c]'
            >
              <Sparkles size={12} />
              {item}
            </span>
          ))}
        </div>
      </section>

      {showFilters && (
        <div className='fixed inset-0 z-50 flex lg:hidden'>
          <button
            type='button'
            className='absolute inset-0 bg-black/40'
            onClick={() => setShowFilters(false)}
            aria-label='Close filters'
          />
          <div className='relative ml-auto h-full w-full max-w-sm overflow-y-auto bg-[#f7efe8] p-4'>
            <div className='mb-4 flex items-center justify-between'>
              <p className='text-lg font-bold text-[#34160f]'>Filters</p>
              <button
                type='button'
                onClick={() => setShowFilters(false)}
                className='flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#7a1e2c]'
              >
                <X size={16} />
              </button>
            </div>
            {filterPanel}
          </div>
        </div>
      )}

      <div className='grid gap-6 lg:grid-cols-[300px_1fr]'>
        <aside className='hidden lg:block'>{filterPanel}</aside>

        <section>
          <div className='mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <p className='text-sm font-semibold text-[#34160f]'>
                {filteredProducts.length} sarees found
              </p>
              <p className='text-sm text-[#8b6759]'>
                Filtered for customer browsing and smaller screens.
              </p>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className='rounded-[28px] border border-dashed border-[#ddc6bb] bg-white px-6 py-14 text-center'>
              <p className='text-xl font-bold text-[#34160f]'>No sarees matched these filters</p>
              <p className='mt-2 text-sm text-[#8b6759]'>
                Try clearing a few filters or searching with a wider term.
              </p>
            </div>
          ) : (
            <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
              {filteredProducts.map((item) => (
                <ProductCard key={item.id} item={item} onViewDetail={onViewDetail} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Categories;
