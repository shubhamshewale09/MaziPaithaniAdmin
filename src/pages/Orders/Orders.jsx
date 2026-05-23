import { useState } from "react";
import {
  Search,
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle,
  IndianRupee,
  Download,
  Settings2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import {
  SellerButton,
  SellerStatCard,
} from "../../components/seller/SellerUI";
import MetaTitle from "../../components/custom/MetaTitle";

// ─── helpers ────────────────────────────────────────────────────────────────

const formatCurrency = (v) =>
  `₹${Number(v).toLocaleString("en-IN")}`;

// Status badge colours
const STATUS_STYLES = {
  Pending:   { dot: "bg-amber-400",  pill: "bg-amber-50  text-amber-700  border border-amber-200",  label: "Pending"   },
  Confirmed: { dot: "bg-blue-400",   pill: "bg-blue-50   text-blue-700   border border-blue-200",   label: "Confirmed" },
  Packed:    { dot: "bg-purple-400", pill: "bg-purple-50 text-purple-700 border border-purple-200", label: "Packed"    },
  Shipped:   { dot: "bg-indigo-400", pill: "bg-indigo-50 text-indigo-700 border border-indigo-200", label: "Shipped"   },
  Delivered: { dot: "bg-emerald-400",pill: "bg-emerald-50 text-emerald-700 border border-emerald-200",label:"Delivered"},
  Cancelled: { dot: "bg-red-400",    pill: "bg-red-50    text-red-700    border border-red-200",    label: "Cancelled" },
  Returned:  { dot: "bg-orange-400", pill: "bg-orange-50 text-orange-700 border border-orange-200", label: "Returned"  },
};

const PAYMENT_STYLES = {
  Paid:    "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Failed:  "bg-red-50    text-red-700    border border-red-200",
  Pending: "bg-amber-50  text-amber-700  border border-amber-200",
  Refunded:"bg-orange-50 text-orange-700 border border-orange-200",
};

// ─── static seed data (2 records – replace with API later) ──────────────────

const SEED_ORDERS = [
  {
    id: "ORD-250522-001",
    customerId: "#12562",
    customerName: "Ganesh Patil",
    customerEmail: "ganeshpatil@gmail.com",
    customerPhone: "+91 98765 43210",
    productName: "Peacock Border Paithani",
    productQty: 1,
    productItems: 1,
    amount: 45000,
    paymentStatus: "Paid",
    paymentMethod: "UPI",
    status: "Pending",
    statusNote: "Awaiting confirmation",
    orderDate: "22 May 2025",
    orderTime: "10:30 AM",
  },
  {
    id: "ORD-250521-007",
    customerId: "#12561",
    customerName: "Priya Deshmukh",
    customerEmail: "priya.deshmukh@gmail.com",
    customerPhone: "+91 87654 32109",
    productName: "Royal Silk Paithani",
    productQty: 1,
    productItems: 1,
    amount: 52000,
    paymentStatus: "Paid",
    paymentMethod: "Razorpay",
    status: "Confirmed",
    statusNote: "Order confirmed",
    orderDate: "21 May 2025",
    orderTime: "04:15 PM",
  },
];

// Tab definitions
const TABS = [
  { key: "All Orders", label: "All Orders" },
  { key: "Pending",    label: "Pending"    },
  { key: "Confirmed",  label: "Confirmed"  },
  { key: "Packed",     label: "Packed"     },
  { key: "Shipped",    label: "Shipped"    },
  { key: "Delivered",  label: "Delivered"  },
  { key: "Cancelled",  label: "Cancelled"  },
  { key: "Returned",   label: "Returned"   },
];

// ─── sub-components ──────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const s = STATUS_STYLES[status] || STATUS_STYLES.Pending;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${s.pill}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
};

const PaymentBadge = ({ status }) => {
  const cls = PAYMENT_STYLES[status] || PAYMENT_STYLES.Pending;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${cls}`}>
      {status}
    </span>
  );
};

// Avatar initials
const Avatar = ({ name }) => {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7a1e2c] to-[#c9a227] text-xs font-bold text-white shadow">
      {initials}
    </div>
  );
};

// ─── main component ──────────────────────────────────────────────────────────

const Orders = () => {
  const [query, setQuery]           = useState("");
  const [activeTab, setActiveTab]   = useState("All Orders");
  const [orderStatus, setOrderStatus]   = useState("All Status");
  const [paymentStatus, setPaymentStatus] = useState("All Payment");

  // Derived counts per tab
  const countFor = (key) => {
    if (key === "All Orders") return SEED_ORDERS.length;
    return SEED_ORDERS.filter((o) => o.status === key).length;
  };

  // Filter logic
  const filtered = SEED_ORDERS.filter((o) => {
    const matchTab     = activeTab === "All Orders" || o.status === activeTab;
    const matchOrder   = orderStatus === "All Status" || o.status === orderStatus;
    const matchPayment = paymentStatus === "All Payment" || o.paymentStatus === paymentStatus;
    const matchQuery   = query === "" ||
      `${o.id} ${o.customerName} ${o.customerEmail}`.toLowerCase().includes(query.toLowerCase());
    return matchTab && matchOrder && matchPayment && matchQuery;
  });

  // Stat card values
  const totalOrders     = SEED_ORDERS.length;
  const pendingOrders   = SEED_ORDERS.filter((o) => o.status === "Pending").length;
  const shippedOrders   = SEED_ORDERS.filter((o) => o.status === "Shipped").length;
  const deliveredOrders = SEED_ORDERS.filter((o) => o.status === "Delivered").length;
  const totalRevenue    = SEED_ORDERS.reduce((s, o) => s + o.amount, 0);

  return (
    <>
      <MetaTitle title="Orders" />

      <div className="seller-page space-y-5">
        {/* ── Page header ── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="seller-display text-2xl font-bold text-[#2f1d18] sm:text-3xl">Orders</h1>
            <p className="mt-1 text-sm text-[#7d655d]">Manage and track all your customer orders</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <SellerButton variant="ghost" type="button" className="flex-1 sm:flex-none justify-center">
              <Download size={15} />
              Export Orders
            </SellerButton>
            <SellerButton variant="primary" type="button" className="flex-1 sm:flex-none justify-center">
              <Settings2 size={15} />
              Order Settings
            </SellerButton>
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <SellerStatCard
            icon={<ShoppingBag size={18} />}
            label="Total Orders"
            value={totalOrders}
            note="This Month"
            accent="wine"
          />
          <SellerStatCard
            icon={<Clock size={18} />}
            label="Pending Orders"
            value={pendingOrders}
            note="Need Action"
            accent="gold"
          />
          <SellerStatCard
            icon={<Truck size={18} />}
            label="Shipped Orders"
            value={shippedOrders}
            note="In Transit"
            accent="forest"
          />
          <SellerStatCard
            icon={<CheckCircle size={18} />}
            label="Delivered Orders"
            value={deliveredOrders}
            note="Completed"
            accent="cocoa"
          />
          <div className="seller-kpi seller-rise col-span-2 p-5 sm:col-span-1 lg:col-span-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#8a6f64]">Total Revenue</p>
                <p className="mt-3 text-xl font-bold text-[#2f1d18] sm:text-2xl">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#176449] to-[#2a8d69] text-white shadow-lg">
                <IndianRupee size={18} />
              </div>
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#a47c66]">
              This Month
            </p>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="seller-panel seller-rise p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#946e60]"
              />
              <input
                className="seller-input pl-10 text-sm"
                placeholder="Search by Order ID, Customer Name, Email..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex lg:items-end lg:gap-3">
              {/* Order Status */}
              <div className="flex flex-col gap-1">
                <label className="seller-label">Order Status</label>
                <select
                  className="seller-select w-full text-sm lg:min-w-[140px]"
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                >
                  <option>All Status</option>
                  {Object.keys(STATUS_STYLES).map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Payment Status */}
              <div className="flex flex-col gap-1">
                <label className="seller-label">Payment Status</label>
                <select
                  className="seller-select w-full text-sm lg:min-w-[140px]"
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                >
                  <option>All Payment</option>
                  {Object.keys(PAYMENT_STYLES).map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Date Range */}
              <div className="col-span-2 flex flex-col gap-1 sm:col-span-1">
                <label className="seller-label">Date Range</label>
                <div className="seller-input flex w-full cursor-pointer items-center gap-2 text-sm text-[#7d655d]">
                  <CalendarDays size={15} className="shrink-0 text-[#946e60]" />
                  <span className="truncate">01 May 2025 – 22 May 2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs + Table ── */}
        <div className="seller-panel seller-rise overflow-hidden">
          {/* Tabs */}
          <div className="overflow-x-auto border-b border-[rgba(122,30,44,0.1)]">
            <div className="flex min-w-max px-4 pt-4">
              {TABS.map((tab) => {
                const count = countFor(tab.key);
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={[
                      "relative flex items-center gap-1.5 whitespace-nowrap px-4 pb-3 text-sm font-semibold transition-colors",
                      isActive
                        ? "text-[#7a1e2c]"
                        : "text-[#8a6f64] hover:text-[#5f1320]",
                    ].join(" ")}
                  >
                    {tab.label}
                    {count > 0 && (
                      <span
                        className={[
                          "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                          isActive
                            ? "bg-[#7a1e2c] text-white"
                            : "bg-[rgba(122,30,44,0.1)] text-[#7a1e2c]",
                        ].join(" ")}
                      >
                        {count}
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#7a1e2c]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto p-4">
            {filtered.length === 0 ? (
              <div className="seller-soft-panel flex flex-col items-center justify-center py-14 text-center">
                <ShoppingBag size={32} className="text-[#c9a227]" />
                <p className="mt-3 text-base font-bold text-[#3d1e17]">No orders found</p>
                <p className="mt-1 text-sm text-[#7c665d]">
                  Try adjusting your search or filters.
                </p>
              </div>
            ) : (
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[rgba(122,30,44,0.08)]">
                    {["ORDER", "CUSTOMER", "PRODUCTS", "AMOUNT", "PAYMENT", "STATUS", "ORDER DATE", "ACTION"].map(
                      (h) => (
                        <th
                          key={h}
                          className="pb-3 pr-4 text-left text-[11px] font-bold uppercase tracking-[0.1em] text-[#8f766a] first:pl-1"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order, idx) => (
                    <tr
                      key={order.id}
                      className="seller-rise border-b border-[rgba(122,30,44,0.06)] transition-colors hover:bg-[rgba(122,30,44,0.02)]"
                      style={{ animationDelay: `${idx * 60}ms` }}
                    >
                      {/* Order */}
                      <td className="py-4 pr-4 pl-1">
                        <p className="font-semibold text-[#351915]">{order.id}</p>
                        <p className="mt-0.5 text-xs text-[#7c665d]">{order.customerId}</p>
                      </td>

                      {/* Customer */}
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={order.customerName} />
                          <div>
                            <p className="font-semibold text-[#351915]">{order.customerName}</p>
                            <p className="mt-0.5 text-xs text-[#7c665d]">{order.customerEmail}</p>
                            <p className="text-xs text-[#7c665d]">{order.customerPhone}</p>
                          </div>
                        </div>
                      </td>

                      {/* Products */}
                      <td className="py-4 pr-4">
                        <p className="font-semibold text-[#351915]">{order.productName}</p>
                        <p className="mt-0.5 text-xs text-[#7c665d]">
                          Qty: {order.productQty} &bull; {order.productItems}{" "}
                          {order.productItems === 1 ? "Item" : "Items"}
                        </p>
                      </td>

                      {/* Amount */}
                      <td className="py-4 pr-4">
                        <p className="font-bold text-[#5f1320]">{formatCurrency(order.amount)}</p>
                      </td>

                      {/* Payment */}
                      <td className="py-4 pr-4">
                        <PaymentBadge status={order.paymentStatus} />
                        <p className="mt-1 text-xs text-[#7c665d]">{order.paymentMethod}</p>
                      </td>

                      {/* Status */}
                      <td className="py-4 pr-4">
                        <StatusBadge status={order.status} />
                        <p className="mt-1 text-xs text-[#7c665d]">{order.statusNote}</p>
                      </td>

                      {/* Order Date */}
                      <td className="py-4 pr-4">
                        <p className="font-medium text-[#351915]">{order.orderDate}</p>
                        <p className="mt-0.5 text-xs text-[#7c665d]">{order.orderTime}</p>
                      </td>

                      {/* Action */}
                      <td className="py-4">
                        <button
                          type="button"
                          aria-label="More actions"
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-[rgba(122,30,44,0.12)] bg-white text-[#7a1e2c] transition hover:bg-[#fff4dc]"
                        >
                          <MoreVertical size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-3 border-t border-[rgba(122,30,44,0.08)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-center text-xs text-[#7d655d] sm:text-left">
              Showing 1 to {filtered.length} of {SEED_ORDERS.length} orders
            </p>
            <div className="flex items-center justify-center gap-1">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(122,30,44,0.12)] bg-white text-[#7a1e2c] transition hover:bg-[#fff4dc] disabled:opacity-40"
                disabled
              >
                <ChevronLeft size={14} />
              </button>
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  type="button"
                  className={[
                    "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition",
                    p === 1
                      ? "bg-[#7a1e2c] text-white shadow"
                      : "border border-[rgba(122,30,44,0.12)] bg-white text-[#7a1e2c] hover:bg-[#fff4dc]",
                  ].join(" ")}
                >
                  {p}
                </button>
              ))}
              <span className="px-1 text-xs text-[#7d655d]">…</span>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(122,30,44,0.12)] bg-white text-xs font-semibold text-[#7a1e2c] transition hover:bg-[#fff4dc]"
              >
                50
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(122,30,44,0.12)] bg-white text-[#7a1e2c] transition hover:bg-[#fff4dc]"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Orders;
