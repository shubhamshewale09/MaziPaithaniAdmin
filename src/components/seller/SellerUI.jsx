import React from "react";

const cn = (...values) => values.filter(Boolean).join(" ");

export const SellerPageShell = ({ eyebrow, title, description, actions, children }) => (
  <div className="seller-page space-y-6 sm:space-y-7">
    <section className="seller-hero seller-rise px-5 py-6 sm:px-8 sm:py-8">
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#a67d65]">{eyebrow}</p>
          <h1 className="seller-display mt-3 text-3xl font-bold leading-tight text-[#5f1320] sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6f5a53] sm:text-base">{description}</p>
        </div>
        {actions ? <div className="pointer-events-auto flex w-full flex-col gap-3 sm:w-auto sm:flex-row">{actions}</div> : null}
      </div>
    </section>
    {children}
  </div>
);

export const SellerSectionCard = ({ title, description, action, className, children }) => (
  <section className={cn("seller-panel seller-rise p-5 sm:p-6", className)}>
    {(title || description || action) && (
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {title ? <h2 className="text-xl font-bold text-[#381c17] sm:text-2xl">{title}</h2> : null}
          {description ? <p className="mt-1 text-sm leading-6 text-[#7d655d]">{description}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    )}
    {children}
  </section>
);

export const SellerStatCard = ({ icon, label, value, note, accent = "wine" }) => {
  const accentMap = {
    wine: "from-[#7a1e2c] to-[#ab3647] text-white",
    gold: "from-[#c9a227] to-[#e1bb56] text-[#4a3411]",
    forest: "from-[#186048] to-[#2a8d69] text-white",
    cocoa: "from-[#6d4b34] to-[#9d6f4d] text-white",
  };

  return (
    <article className="seller-kpi seller-rise p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#8a6f64]">{label}</p>
          <p className="mt-3 text-2xl font-bold text-[#2f1d18] sm:text-[1.9rem]">{value}</p>
        </div>
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg", accentMap[accent] || accentMap.wine)}>
          {icon}
        </div>
      </div>
      {note ? <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#a47c66]">{note}</p> : null}
    </article>
  );
};

export const SellerButton = ({ variant = "primary", className, children, ...props }) => (
  <button
    className={cn(
      "seller-btn relative z-10 cursor-pointer",
      variant === "primary" && "seller-btn-primary",
      variant === "secondary" && "seller-btn-secondary",
      variant === "ghost" && "seller-btn-ghost",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

export const SellerSearchField = ({ icon, className, ...props }) => (
  <div className={cn("relative", className)}>
    {icon ? <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#946e60]">{icon}</span> : null}
    <input className={cn("seller-input", icon && "pl-12")} {...props} />
  </div>
);

export const SellerBadge = ({ tone = "neutral", children }) => (
  <span className={cn("seller-badge", `seller-badge-${tone}`)}>{children}</span>
);

export const SellerEmptyState = ({ icon, title, description }) => (
  <div className="seller-soft-panel seller-rise flex flex-col items-center justify-center px-6 py-12 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#fff3e2] text-[#7a1e2c]">{icon}</div>
    <h3 className="mt-4 text-lg font-bold text-[#3d1e17]">{title}</h3>
    <p className="mt-2 max-w-md text-sm leading-6 text-[#7c665d]">{description}</p>
  </div>
);

export const SellerSwitch = ({ checked, onChange, ariaLabel }) => (
  <button
    type="button"
    aria-label={ariaLabel}
    aria-pressed={checked}
    onClick={onChange}
    className={cn("seller-switch", checked && "is-active")}
  >
    <span className="seller-switch-thumb" />
  </button>
);
