import React, { useState } from "react";
import { ArrowRight, Clock3, Search, ShoppingBag } from "lucide-react";
import {
  SellerBadge,
  SellerButton,
  SellerEmptyState,
  SellerPageShell,
  SellerSearchField,
  SellerSectionCard,
  SellerStatCard,
} from "../../components/seller/SellerUI";
import MetaTitle from "../../components/custom/MetaTitle";
import { sellerOrders } from "../../data/sellerStaticData";

const formatCurrency = (value) => `Rs ${value.toLocaleString("en-IN")}`;

const Orders = () => {
  const [query, setQuery] = useState("");

  const filteredOrders = sellerOrders.filter((order) => {
    const text = `${order.id} ${order.customer} ${order.product} ${order.status}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

  const pendingCount = sellerOrders.filter((order) => ["Pending", "Confirmed", "Processing"].includes(order.status)).length;
  const deliveredCount = sellerOrders.filter((order) => order.status === "Delivered").length;

  const toneForStatus = (status) => {
    if (status === "Delivered") return "success";
    if (status === "Pending") return "warning";
    if (status === "Processing") return "neutral";
    return "neutral";
  };

  return (
    <>
      <MetaTitle title="Orders" />
      <SellerPageShell
      eyebrow="Order Desk"
      title="Track buyer orders, dispatch timing, and handover status in one place."
      description="This screen keeps the same maroon-gold language as your dashboard while following the denser tab layouts from the reference design."
      actions={<SellerButton type="button" variant="secondary"><ArrowRight size={16} /> Export Summary</SellerButton>}
    >
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SellerStatCard icon={<ShoppingBag size={20} />} label="Total Orders" value={sellerOrders.length} note="This month" accent="wine" />
        <SellerStatCard icon={<Clock3 size={20} />} label="Open Queue" value={pendingCount} note="Need action" accent="gold" />
        <SellerStatCard icon={<ShoppingBag size={20} />} label="Delivered" value={deliveredCount} note="Completed successfully" accent="forest" />
        <SellerStatCard icon={<ShoppingBag size={20} />} label="Order Value" value={formatCurrency(224600)} note="Static order total" accent="cocoa" />
      </section>

      <SellerSectionCard
        title="Recent order flow"
        description="Use search and row actions later once the live API is connected."
        action={<div className="w-full sm:w-[260px]"><SellerSearchField icon={<Search size={18} />} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by order or customer" /></div>}
      >
        {filteredOrders.length === 0 ? (
          <SellerEmptyState
            icon={<ShoppingBag size={28} />}
            title="No orders match this search"
            description="The layout is ready; once real data is connected, search and filtering will plug in here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="seller-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Buyer</th>
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Timeline</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr key={order.id} className="seller-rise" style={{ animationDelay: `${index * 70}ms` }}>
                    <td>
                      <p className="font-semibold text-[#351915]">{order.id}</p>
                      <p className="mt-1 text-sm text-[#7c665d]">Qty {order.quantity}</p>
                    </td>
                    <td>
                      <p className="font-semibold text-[#351915]">{order.customer}</p>
                      <p className="mt-1 text-sm text-[#7c665d]">{order.city}</p>
                    </td>
                    <td>
                      <p className="font-semibold text-[#351915]">{order.product}</p>
                    </td>
                    <td>
                      <p className="font-semibold text-[#5f1320]">{formatCurrency(order.amount)}</p>
                    </td>
                    <td>
                      <SellerBadge tone={toneForStatus(order.status)}>{order.status}</SellerBadge>
                    </td>
                    <td>
                      <p className="text-sm font-medium text-[#6d5850]">{order.eta}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SellerSectionCard>
      </SellerPageShell>
    </>
  );
};

export default Orders;
