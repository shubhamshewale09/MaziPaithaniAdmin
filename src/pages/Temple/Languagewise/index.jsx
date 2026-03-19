import React from "react";
import MetaTitle from "../../../components/custom/MetaTitle";

const TempleLanguagewise = () => (
  <>
    <MetaTitle title="Temple Languagewise Reference" />
    <div className="min-h-screen bg-[#f7f1ed] p-6 sm:p-8">
      <div className="mx-auto max-w-4xl rounded-[28px] border border-[#ead8cf] bg-white/90 p-8 shadow-[0_18px_48px_rgba(94,35,23,0.08)]">
        <h1 className="font-serif text-3xl font-bold text-[#5f1320]">Temple languagewise screen kept for reference.</h1>
        <p className="mt-4 text-sm leading-7 text-[#735d54]">
          The original languagewise implementation depended on the old admin scaffolding that was removed. This lightweight file keeps the Temple area present in the repository without dragging that legacy setup back into the seller dashboard flow.
        </p>
      </div>
    </div>
  </>
);

export default TempleLanguagewise;
