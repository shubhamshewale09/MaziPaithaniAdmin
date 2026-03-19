import React, { useState } from "react";
import { MessageSquareQuote, Search, Send } from "lucide-react";
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
import { sellerEnquiries } from "../../data/sellerStaticData";

const Enquiries = () => {
  const [query, setQuery] = useState("");

  const filteredEnquiries = sellerEnquiries.filter((item) => {
    const text = `${item.customer} ${item.product} ${item.topic} ${item.message}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

  const newCount = sellerEnquiries.filter((item) => item.status === "New").length;
  const repliedCount = sellerEnquiries.filter((item) => item.status === "Replied").length;

  const toneForStatus = (status) => {
    if (status === "New") return "warning";
    if (status === "Replied") return "success";
    return "neutral";
  };

  return (
    <>
      <MetaTitle title="Enquiries" />
      <SellerPageShell
      eyebrow="Buyer Conversations"
      title="Handle customization requests and buyer questions without losing response context."
      description="This page stays static for now, but the card hierarchy and message snippets are ready for live enquiry threads later."
      actions={<SellerButton type="button"><Send size={16} /> Quick Reply Template</SellerButton>}
    >
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SellerStatCard icon={<MessageSquareQuote size={20} />} label="Total Enquiries" value={sellerEnquiries.length} note="Recent conversations" accent="wine" />
        <SellerStatCard icon={<MessageSquareQuote size={20} />} label="New Requests" value={newCount} note="Need first response" accent="gold" />
        <SellerStatCard icon={<MessageSquareQuote size={20} />} label="Replied" value={repliedCount} note="Followed up" accent="forest" />
      </section>

      <SellerSectionCard
        title="Conversation queue"
        description="A stacked card layout works better on mobile than a dense table for enquiry handling."
        action={<div className="w-full sm:w-[260px]"><SellerSearchField icon={<Search size={18} />} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by buyer, product, or topic" /></div>}
      >
        {filteredEnquiries.length === 0 ? (
          <SellerEmptyState
            icon={<MessageSquareQuote size={28} />}
            title="No enquiry matches this search"
            description="Live messaging or filters can be attached to the same layout once the data layer is ready."
          />
        ) : (
          <div className="space-y-4">
            {filteredEnquiries.map((item, index) => (
              <article key={item.id} className="seller-soft-panel seller-rise rounded-[24px] p-5" style={{ animationDelay: `${index * 70}ms` }}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <SellerBadge tone={toneForStatus(item.status)}>{item.status}</SellerBadge>
                      <SellerBadge tone="neutral">{item.channel}</SellerBadge>
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9c7968]">{item.id}</span>
                    </div>
                    <h2 className="mt-4 text-xl font-bold text-[#351915]">{item.topic}</h2>
                    <p className="mt-1 text-sm font-medium text-[#7a1e2c]">{item.customer} about {item.product}</p>
                    <p className="mt-3 text-sm leading-7 text-[#6d5850]">{item.message}</p>
                  </div>

                  <div className="seller-panel min-w-[220px] rounded-[22px] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a17b68]">Last activity</p>
                    <p className="mt-2 text-lg font-bold text-[#381c17]">{item.responseTime}</p>
                    <p className="mt-2 text-sm leading-6 text-[#7c665d]">Perfect spot for response SLA, buyer history, or assigned team member.</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </SellerSectionCard>
      </SellerPageShell>
    </>
  );
};

export default Enquiries;
