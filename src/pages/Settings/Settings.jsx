import React, { useState } from "react";
import { Bell, LockKeyhole, Save } from "lucide-react";
import MetaTitle from "../../components/custom/MetaTitle";
import {
  SellerButton,
  SellerPageShell,
  SellerSectionCard,
  SellerSwitch,
} from "../../components/seller/SellerUI";
import { sellerSettingsGroups } from "../../data/sellerStaticData";

const Settings = () => {
  const [notifications, setNotifications] = useState({
    orders: true,
    enquiries: true,
    stock: false,
    revenue: true,
  });

  return (
    <>
      <MetaTitle title="Settings" />
      <SellerPageShell
      eyebrow="Account Preferences"
      title="Fine-tune seller alerts, communication choices, and account safety settings."
      description="This is a static settings design that already shares the same button, input, panel, and toggle system as the rest of the seller tabs."
      actions={<SellerButton type="button"><Save size={16} /> Save Preferences</SellerButton>}
    >
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SellerSectionCard title="Password update" description="Use this section later for real account security actions.">
          <form className="space-y-4">
            <div>
              <label className="seller-label" htmlFor="currentPassword">Current password</label>
              <input id="currentPassword" type="password" className="seller-input" placeholder="Enter current password" />
            </div>
            <div>
              <label className="seller-label" htmlFor="newPassword">New password</label>
              <input id="newPassword" type="password" className="seller-input" placeholder="Minimum 8 characters" />
            </div>
            <div>
              <label className="seller-label" htmlFor="confirmPassword">Confirm password</label>
              <input id="confirmPassword" type="password" className="seller-input" placeholder="Repeat new password" />
            </div>
            <div className="seller-soft-panel rounded-[20px] p-4 text-sm leading-6 text-[#7c665d]">
              Keep strong credentials for seller login, payout approval, and profile editing permissions.
            </div>
          </form>
        </SellerSectionCard>

        <SellerSectionCard title="Notification controls" description="Compact preference blocks styled to match the reference layout but aligned with your maroon-gold visual system.">
          <div className="space-y-4">
            {sellerSettingsGroups.map((item, index) => (
              <div key={item.key} className="seller-soft-panel seller-rise flex items-start justify-between gap-4 rounded-[22px] p-5" style={{ animationDelay: `${index * 70}ms` }}>
                <div>
                  <div className="flex items-center gap-2">
                    {item.key === "orders" || item.key === "revenue" ? <Bell size={16} className="text-[#7a1e2c]" /> : <LockKeyhole size={16} className="text-[#7a1e2c]" />}
                    <p className="font-semibold text-[#351915]">{item.title}</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#7d655d]">{item.description}</p>
                </div>
                <SellerSwitch
                  checked={notifications[item.key]}
                  onChange={() => setNotifications((current) => ({ ...current, [item.key]: !current[item.key] }))}
                  ariaLabel={`Toggle ${item.title}`}
                />
              </div>
            ))}
          </div>
        </SellerSectionCard>
      </section>
      </SellerPageShell>
    </>
  );
};

export default Settings;
