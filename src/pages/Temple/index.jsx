import React from "react";
import { Building2, ScrollText } from "lucide-react";
import MetaTitle from "../../components/custom/MetaTitle";

const TempleReferenceCard = ({ title, description }) => (
  <div className="rounded-3xl border border-[#ead8cf] bg-white/90 p-6 shadow-[0_18px_48px_rgba(94,35,23,0.08)]">
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7a1e2c] to-[#c9a227] text-white">
      <Building2 size={20} />
    </div>
    <h2 className="mt-4 text-xl font-bold text-[#381c17]">{title}</h2>
    <p className="mt-2 text-sm leading-7 text-[#735d54]">{description}</p>
  </div>
);

const Temple = () => {
  return (
    <>
      <MetaTitle title="Temple Reference" />
      <div className="min-h-screen bg-[#f7f1ed] p-6 sm:p-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <section className="overflow-hidden rounded-[32px] border border-[#f0ddd4] bg-gradient-to-br from-[#fff9f4] via-[#fff3ea] to-[#fffbf7] p-8 shadow-[0_22px_60px_rgba(94,35,23,0.08)]">
            <div className="flex items-center gap-3 text-[#7a1e2c]">
              <ScrollText size={20} />
              <p className="text-xs font-bold uppercase tracking-[0.26em]">Reference Only</p>
            </div>
            <h1 className="mt-4 font-serif text-3xl font-bold text-[#5f1320] sm:text-4xl">Temple module is preserved as reference.</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6e5952] sm:text-base">
              As requested, the seller dashboard cleanup removed unrelated legacy modules but kept the Temple section and Temple API files in the project for future reference.
            </p>
          </section>

          <div className="grid gap-5 md:grid-cols-2">
            <TempleReferenceCard
              title="Temple Listing Flow"
              description="The original Temple CRUD screens were intentionally replaced with a lightweight reference shell so the seller-focused project stays clean while the Temple module remains in the codebase."
            />
            <TempleReferenceCard
              title="Related Service Preserved"
              description="The Temple service folder under src/services/Temple is still available if you need to restore or rework that module later."
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Temple;
