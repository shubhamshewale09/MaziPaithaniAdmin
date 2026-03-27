import { useState } from 'react';
import {
  CheckCircle,
  ChevronRight,
  Clock3,
  Package,
  Truck,
  X,
} from 'lucide-react';

const STATUS_STYLES = {
  Pending: 'bg-amber-100 text-amber-700',
  Accepted: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-violet-100 text-violet-700',
  Delivered: 'bg-emerald-100 text-emerald-700',
};

const ORDER_STEPS = ['Pending', 'Accepted', 'Shipped', 'Delivered'];

const ORDERS = [
  {
    id: 'MP-2026-001',
    product: 'Peacock Motif Paithani',
    seller: 'Ravi Handlooms',
    price: 'Rs 14,500',
    status: 'Delivered',
    date: '10 Mar 2026',
  },
  {
    id: 'MP-2026-002',
    product: 'Bridal Gold Border',
    seller: 'Sunita Weaves',
    price: 'Rs 28,000',
    status: 'Shipped',
    date: '18 Mar 2026',
  },
  {
    id: 'MP-2026-003',
    product: 'Lotus Pallu Design',
    seller: 'Mohan Silk House',
    price: 'Rs 11,200',
    status: 'Accepted',
    date: '21 Mar 2026',
  },
];

const TrackingTimeline = ({ status }) => {
  const activeIndex = ORDER_STEPS.indexOf(status);

  return (
    <div className='mt-5'>
      <div className='relative flex items-start justify-between gap-2'>
        <div className='absolute left-0 right-0 top-4 h-0.5 bg-[#f1e2d8]' />
        <div
          className='absolute left-0 top-4 h-0.5 bg-[#7a1e2c]'
          style={{ width: `${(activeIndex / (ORDER_STEPS.length - 1)) * 100}%` }}
        />

        {ORDER_STEPS.map((step, index) => {
          const isDone = index <= activeIndex;

          return (
            <div key={step} className='relative z-10 flex flex-1 flex-col items-center gap-2'>
              <div
                className={[
                  'flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold',
                  isDone
                    ? 'border-[#7a1e2c] bg-[#7a1e2c] text-white'
                    : 'border-[#ead9cf] bg-white text-[#a6806f]',
                ].join(' ')}
              >
                {isDone ? <CheckCircle size={14} /> : index + 1}
              </div>
              <span
                className={[
                  'text-[10px] font-semibold',
                  isDone ? 'text-[#7a1e2c]' : 'text-[#a6806f]',
                ].join(' ')}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div className='space-y-6'>
      <section className='rounded-[32px] border border-[#efdcd2] bg-white p-6 shadow-[0_18px_45px_rgba(94,35,23,0.08)]'>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#a6806f]'>
              Order center
            </p>
            <h1 className='mt-2 text-3xl font-bold text-[#34160f]'>Track every customer order</h1>
            <p className='mt-3 text-sm leading-7 text-[#8b6759]'>
              Order tracking is now presented as a buyer journey, with clear states for mobile and desktop.
            </p>
          </div>

          <div className='flex flex-wrap gap-2'>
            <span className='inline-flex items-center gap-2 rounded-full bg-[#fff1e7] px-3 py-2 text-xs font-semibold text-[#7a1e2c]'>
              <Package size={13} />
              {ORDERS.length} active orders
            </span>
            <span className='inline-flex items-center gap-2 rounded-full bg-[#fff6df] px-3 py-2 text-xs font-semibold text-[#9b6a08]'>
              <Truck size={13} />
              Live tracking
            </span>
          </div>
        </div>
      </section>

      {selectedOrder ? (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
          <button
            type='button'
            className='absolute inset-0 bg-black/40 backdrop-blur-sm'
            onClick={() => setSelectedOrder(null)}
            aria-label='Close order details'
          />

          <div className='relative w-full max-w-2xl rounded-[32px] bg-white p-6 shadow-[0_28px_80px_rgba(0,0,0,0.18)]'>
            <div className='flex items-center justify-between gap-3'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#a6806f]'>
                  Order details
                </p>
                <h2 className='mt-2 text-2xl font-bold text-[#34160f]'>{selectedOrder.id}</h2>
              </div>
              <button
                type='button'
                onClick={() => setSelectedOrder(null)}
                className='flex h-10 w-10 items-center justify-center rounded-full bg-[#f7efe8] text-[#7a1e2c]'
              >
                <X size={16} />
              </button>
            </div>

            <div className='mt-6 rounded-[24px] bg-[#fffaf6] p-5'>
              <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                  <p className='text-lg font-bold text-[#34160f]'>{selectedOrder.product}</p>
                  <p className='mt-1 text-sm text-[#8b6759]'>{selectedOrder.seller}</p>
                </div>
                <span className={`rounded-full px-3 py-2 text-xs font-semibold ${STATUS_STYLES[selectedOrder.status]}`}>
                  {selectedOrder.status}
                </span>
              </div>
              <p className='mt-4 text-sm font-semibold text-[#7a1e2c]'>{selectedOrder.price}</p>
            </div>

            <TrackingTimeline status={selectedOrder.status} />
          </div>
        </div>
      ) : null}

      <div className='grid gap-4'>
        {ORDERS.map((order) => (
          <div
            key={order.id}
            className='rounded-[28px] border border-[#efdcd2] bg-white p-5 shadow-[0_18px_45px_rgba(94,35,23,0.08)]'
          >
            <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
              <div className='flex gap-4'>
                <div className='flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] bg-gradient-to-br from-[#fff8f1] via-[#fdecd9] to-[#f7d9c6] text-3xl'>
                  S
                </div>
                <div>
                  <p className='text-lg font-bold text-[#34160f]'>{order.product}</p>
                  <p className='mt-1 text-sm text-[#8b6759]'>{order.seller}</p>
                  <div className='mt-3 flex flex-wrap items-center gap-2 text-xs text-[#8b6759]'>
                    <span className='font-semibold text-[#34160f]'>{order.id}</span>
                    <span>Placed on {order.date}</span>
                  </div>
                </div>
              </div>

              <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${STATUS_STYLES[order.status]}`}>
                  {order.status === 'Pending' ? <Clock3 size={13} /> : <CheckCircle size={13} />}
                  {order.status}
                </span>
                <p className='text-lg font-bold text-[#7a1e2c]'>{order.price}</p>
                <button
                  type='button'
                  onClick={() => setSelectedOrder(order)}
                  className='inline-flex items-center gap-2 rounded-full border border-[#ead9cf] bg-[#fffaf6] px-4 py-2 text-sm font-semibold text-[#7a1e2c]'
                >
                  View tracking
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
