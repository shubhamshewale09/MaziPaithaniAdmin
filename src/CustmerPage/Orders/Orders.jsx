import { useState } from 'react';
import { Package, ChevronRight, X, CheckCircle, Truck, Clock, ShoppingBag } from 'lucide-react';

const STATUS_CONFIG = {
  Pending:   { color: 'bg-amber-100 text-amber-700',   dot: 'bg-amber-500',   icon: <Clock size={14} /> },
  Accepted:  { color: 'bg-blue-100 text-blue-700',     dot: 'bg-blue-500',    icon: <CheckCircle size={14} /> },
  Shipped:   { color: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500',  icon: <Truck size={14} /> },
  Delivered: { color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500', icon: <CheckCircle size={14} /> },
};

const TIMELINE_STEPS = ['Pending', 'Accepted', 'Shipped', 'Delivered'];

const ORDERS = [
  { id: 'MP-2024-001', product: 'Peacock Motif Paithani', seller: 'Artisan Ravi',   price: '₹14,500', status: 'Delivered', date: '10 Jan 2024' },
  { id: 'MP-2024-002', product: 'Bridal Gold Border',     seller: 'Weaver Sunita',  price: '₹28,000', status: 'Shipped',   date: '15 Jan 2024' },
  { id: 'MP-2024-003', product: 'Lotus Pallu Design',     seller: 'Artisan Mohan',  price: '₹11,200', status: 'Accepted',  date: '18 Jan 2024' },
  { id: 'MP-2024-004', product: 'Classic Yeola Silk',     seller: 'Weaver Priya',   price: '₹19,500', status: 'Pending',   date: '20 Jan 2024' },
];

const TrackingTimeline = ({ status }) => {
  const currentIdx = TIMELINE_STEPS.indexOf(status);
  return (
    <div className="mt-5">
      <p className="text-xs font-bold uppercase tracking-widest text-[#9b7b69] mb-4">Order Tracking</p>
      <div className="relative flex items-start justify-between">
        {/* Progress line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-[#f0e4de]" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-gradient-to-r from-[#7a1e2c] to-[#c28b1e] transition-all duration-500"
          style={{ width: `${(currentIdx / (TIMELINE_STEPS.length - 1)) * 100}%` }}
        />
        {TIMELINE_STEPS.map((step, i) => {
          const done = i <= currentIdx;
          return (
            <div key={step} className="relative flex flex-col items-center gap-2 z-10">
              <div className={[
                'flex h-8 w-8 items-center justify-center rounded-full border-2 transition',
                done
                  ? 'border-[#7a1e2c] bg-[#7a1e2c] text-white'
                  : 'border-[#e9d7cf] bg-white text-[#9b7b69]',
              ].join(' ')}>
                {done ? <CheckCircle size={14} /> : <div className="h-2 w-2 rounded-full bg-[#e9d7cf]" />}
              </div>
              <span className={`text-[10px] font-semibold ${done ? 'text-[#7a1e2c]' : 'text-[#9b7b69]'}`}>{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Orders = () => {
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#3d1e17] mb-6">My Orders</h1>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-lg rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <p className="font-bold text-[#3d1e17]">Order {selected.id}</p>
              <button onClick={() => setSelected(null)} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f7f1ed] text-[#6a4a42]">
                <X size={16} />
              </button>
            </div>
            <div className="flex items-center gap-3 rounded-[18px] bg-[#fff8f3] p-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fff9f4] to-[#fde8d8] text-3xl">🥻</div>
              <div>
                <p className="font-semibold text-[#3d1e17]">{selected.product}</p>
                <p className="text-xs text-[#9b7b69]">{selected.seller}</p>
                <p className="text-sm font-bold text-[#7a1e2c] mt-1">{selected.price}</p>
              </div>
            </div>
            <TrackingTimeline status={selected.status} />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {ORDERS.map((order) => {
          const cfg = STATUS_CONFIG[order.status];
          return (
            <div key={order.id} className="rounded-[22px] border border-[#f0e4de] bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fff9f4] to-[#fde8d8] text-3xl">
                  🥻
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-[#3d1e17] text-sm">{order.product}</p>
                      <p className="text-xs text-[#9b7b69] mt-0.5">{order.seller}</p>
                    </div>
                    <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shrink-0 ${cfg.color}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <p className="text-xs text-[#9b7b69]">Order ID: <span className="font-semibold text-[#3d1e17]">{order.id}</span></p>
                      <p className="text-xs text-[#9b7b69] mt-0.5">{order.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-bold text-[#7a1e2c]">{order.price}</p>
                      <button
                        onClick={() => setSelected(order)}
                        className="flex items-center gap-1 rounded-xl bg-[#fff8f3] border border-[#e9d7cf] px-3 py-1.5 text-xs font-semibold text-[#7a1e2c] transition hover:bg-[#fde8d8]"
                      >
                        Details <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
