import React from "react";
import { ArrowUpRight, IndianRupee, Landmark, TrendingUp, Wallet } from "lucide-react";
import MetaTitle from "../../components/custom/MetaTitle";
import { SellerBadge, SellerPageShell, SellerSectionCard, SellerStatCard } from "../../components/seller/SellerUI";
import { sellerPayouts, sellerRevenueMonths } from "../../data/sellerStaticData";

const formatCurrency = (value) => `Rs ${value.toLocaleString("en-IN")}`;
const maxRevenue = Math.max(...sellerRevenueMonths.map((item) => item.amount));

const Revenue = () => (
  <>
    <MetaTitle title="Revenue" />
    <SellerPageShell
    eyebrow="Revenue Insights"
    title="See collection trends, payout readiness, and monthly growth at a glance."
    description="The charts are intentionally static for now, but the visual system is reusable and ready for backend integration later."
  >
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <SellerStatCard icon={<IndianRupee size={20} />} label="Monthly Revenue" value={formatCurrency(254000)} note="March 2026 snapshot" accent="wine" />
      <SellerStatCard icon={<Wallet size={20} />} label="Expected Payout" value={formatCurrency(118400)} note="Next settlement" accent="gold" />
      <SellerStatCard icon={<TrendingUp size={20} />} label="Growth Rate" value="18.4%" note="Versus last month" accent="forest" />
      <SellerStatCard icon={<Landmark size={20} />} label="Avg. Order Value" value={formatCurrency(37433)} note="Across closed orders" accent="cocoa" />
    </section>

    <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <SellerSectionCard title="Sales momentum" description="A simple custom chart keeps this page lightweight while still giving you a strong visual placeholder.">
        <div className="flex min-h-[290px] items-end gap-3 overflow-x-auto px-1 pb-2 pt-6">
          {sellerRevenueMonths.map((item, index) => (
            <div key={item.month} className="seller-rise flex min-w-[62px] flex-1 flex-col items-center gap-3" style={{ animationDelay: `${index * 80}ms` }}>
              <div className="flex h-[220px] items-end">
                <div className="seller-chart-bar w-[52px]" style={{ height: `${Math.max(18, (item.amount / maxRevenue) * 220)}px` }} />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-[#381c17]">{item.month}</p>
                <p className="mt-1 text-xs text-[#8d7266]">{formatCurrency(item.amount)}</p>
              </div>
            </div>
          ))}
        </div>
      </SellerSectionCard>

      <SellerSectionCard title="Payout snapshot" description="Settlement and fee blocks that can later map to real payout APIs.">
        <div className="space-y-4">
          {sellerPayouts.map((item, index) => (
            <article key={item.title} className="seller-soft-panel seller-rise rounded-[22px] p-5" style={{ animationDelay: `${index * 80}ms` }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#8a6f64]">{item.title}</p>
                  <p className="mt-2 text-2xl font-bold text-[#5f1320]">{typeof item.amount === "number" ? formatCurrency(item.amount) : `${item.amount}%`}</p>
                  <p className="mt-2 text-sm text-[#7b655d]">{item.note}</p>
                </div>
                <SellerBadge tone="neutral"><ArrowUpRight size={12} /> Ready</SellerBadge>
              </div>
            </article>
          ))}
        </div>
      </SellerSectionCard>
    </section>
    </SellerPageShell>
  </>
);

export default Revenue;
