const createMockProductImage = (title, subtitle, colors) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 560">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${colors[0]}" />
          <stop offset="55%" stop-color="${colors[1]}" />
          <stop offset="100%" stop-color="${colors[2]}" />
        </linearGradient>
      </defs>
      <rect width="800" height="560" rx="36" fill="url(#bg)" />
      <circle cx="680" cy="112" r="88" fill="rgba(255,255,255,0.15)" />
      <circle cx="150" cy="430" r="120" fill="rgba(255,255,255,0.12)" />
      <rect x="136" y="92" width="528" height="376" rx="32" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.3)" />
      <path d="M302 182c46 8 74 37 89 90 16 58 56 102 126 127-30 25-73 38-129 38-87 0-145-44-167-124-18-65 8-110 81-131Z" fill="rgba(255,255,255,0.78)" />
      <path d="M388 166c28 28 49 80 56 142 4 33 25 74 55 108-31-3-66-21-94-45-47-41-72-92-74-152-2-30 5-48 20-53 12-5 24-2 37 0Z" fill="rgba(122,30,44,0.3)" />
      <text x="400" y="110" text-anchor="middle" font-family="Georgia, serif" font-size="34" font-weight="700" fill="#fff">${title}</text>
      <text x="400" y="148" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="18" fill="rgba(255,255,255,0.9)">${subtitle}</text>
      <text x="400" y="500" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="18" letter-spacing="4" fill="rgba(255,255,255,0.85)">PAITHANI SAMPLE IMAGE</text>
    </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export const sellerProducts = [
  {
    id: "PRD-101",
    name: "Royal Peacock Border Paithani",
    category: "Traditional",
    stock: 4,
    price: 48500,
    palette: "Mulberry and Gold",
    weave: "Pure silk handloom weave with signature peacock pallu.",
    status: "Featured",
    images: [
      {
        label: "Front Drape",
        src: createMockProductImage("Royal Peacock", "Front Drape", ["#6a1530", "#b93953", "#f0c56b"]),
      },
      {
        label: "Pallu View",
        src: createMockProductImage("Royal Peacock", "Pallu View", ["#4f1324", "#8f2940", "#dcae49"]),
      },
      {
        label: "Border Detail",
        src: createMockProductImage("Royal Peacock", "Border Detail", ["#7b4b1f", "#c98d37", "#f6d88b"]),
      },
    ],
  },
  {
    id: "PRD-102",
    name: "Lotus Weave Bridal Paithani",
    category: "Bridal",
    stock: 2,
    price: 72900,
    palette: "Crimson and Antique Gold",
    weave: "Statement bridal weave with lotus body motifs and rich zari finish.",
    status: "Limited",
    images: [
      {
        label: "Bridal Front",
        src: createMockProductImage("Lotus Bridal", "Bridal Front", ["#6e1228", "#a22445", "#f1c35f"]),
      },
      {
        label: "Lotus Motif",
        src: createMockProductImage("Lotus Bridal", "Lotus Motif", ["#7f1831", "#d05273", "#f4d792"]),
      },
      {
        label: "Blouse Piece",
        src: createMockProductImage("Lotus Bridal", "Blouse Piece", ["#5d1625", "#8c2b3c", "#d7a14e"]),
      },
    ],
  },
  {
    id: "PRD-103",
    name: "Mor Pallu Festival Edit",
    category: "Festive",
    stock: 8,
    price: 36900,
    palette: "Emerald and Rose",
    weave: "Festive drape with lighter body weight and vibrant mor pallu finish.",
    status: "Active",
    images: [
      {
        label: "Festival Drape",
        src: createMockProductImage("Mor Pallu", "Festival Drape", ["#185c49", "#2d8a68", "#f4d78a"]),
      },
      {
        label: "Rose Highlights",
        src: createMockProductImage("Mor Pallu", "Rose Highlights", ["#7c2436", "#cf6c84", "#f2d8a1"]),
      },
      {
        label: "Zari Border",
        src: createMockProductImage("Mor Pallu", "Zari Border", ["#4f2e16", "#a8792f", "#f4d78a"]),
      },
    ],
  },
  {
    id: "PRD-104",
    name: "Minimal Tissue Paithani",
    category: "Contemporary",
    stock: 0,
    price: 29400,
    palette: "Champagne Gold",
    weave: "Soft tissue finish designed for lightweight premium occasion wear.",
    status: "Out of Stock",
    images: [
      {
        label: "Full Saree",
        src: createMockProductImage("Minimal Tissue", "Full Saree", ["#7b6246", "#c2a274", "#f5e3bb"]),
      },
      {
        label: "Texture Closeup",
        src: createMockProductImage("Minimal Tissue", "Texture Closeup", ["#8f7251", "#d4b07a", "#f7ebcb"]),
      },
      {
        label: "Fall Detail",
        src: createMockProductImage("Minimal Tissue", "Fall Detail", ["#7f6450", "#b5956c", "#efe0ba"]),
      },
    ],
  },
];

export const sellerOrders = [
  {
    id: "ORD-2081",
    customer: "Anuja Kulkarni",
    city: "Pune",
    product: "Royal Peacock Border Paithani",
    amount: 48500,
    quantity: 1,
    status: "Processing",
    eta: "Dispatch in 2 days",
  },
  {
    id: "ORD-2080",
    customer: "Meera Joshi",
    city: "Nashik",
    product: "Lotus Weave Bridal Paithani",
    amount: 72900,
    quantity: 1,
    status: "Confirmed",
    eta: "Awaiting finishing approval",
  },
  {
    id: "ORD-2077",
    customer: "Rutuja Shinde",
    city: "Mumbai",
    product: "Mor Pallu Festival Edit",
    amount: 73800,
    quantity: 2,
    status: "Delivered",
    eta: "Delivered on 16 Mar",
  },
  {
    id: "ORD-2072",
    customer: "Sonal Patil",
    city: "Aurangabad",
    product: "Minimal Tissue Paithani",
    amount: 29400,
    quantity: 1,
    status: "Pending",
    eta: "Waiting for payment confirmation",
  },
];

export const sellerEnquiries = [
  {
    id: "ENQ-91",
    customer: "Neha Deshmukh",
    channel: "WhatsApp",
    topic: "Customized bridal palette",
    product: "Lotus Weave Bridal Paithani",
    message: "Need magenta base with green peacock border and matching blouse piece.",
    status: "New",
    responseTime: "12 min ago",
  },
  {
    id: "ENQ-88",
    customer: "Kanchan More",
    channel: "Email",
    topic: "Dispatch timeline",
    product: "Royal Peacock Border Paithani",
    message: "Can this be shipped before Gudi Padwa if I confirm today?",
    status: "Replied",
    responseTime: "1 hr ago",
  },
  {
    id: "ENQ-86",
    customer: "Pallavi Thorat",
    channel: "Call Request",
    topic: "Handloom authenticity",
    product: "Mor Pallu Festival Edit",
    message: "Customer wants weaving details and artisan story for gifting.",
    status: "Follow Up",
    responseTime: "Yesterday",
  },
];

export const sellerRevenueMonths = [
  { month: "Oct", amount: 142000 },
  { month: "Nov", amount: 168000 },
  { month: "Dec", amount: 194000 },
  { month: "Jan", amount: 176000 },
  { month: "Feb", amount: 228000 },
  { month: "Mar", amount: 254000 },
];

export const sellerPayouts = [
  { title: "Upcoming Settlement", amount: 118400, note: "Expected 22 Mar 2026" },
  { title: "Marketplace Fees", amount: 12600, note: "6 closed orders" },
  { title: "Repeat Buyer Share", amount: 38, note: "Percent of March orders" },
];

export const sellerSettingsGroups = [
  {
    title: "Order Updates",
    description: "Stay updated when buyers place or confirm new orders.",
    key: "orders",
  },
  {
    title: "Customer Enquiries",
    description: "Receive quick notifications for fresh customization requests.",
    key: "enquiries",
  },
  {
    title: "Low Stock Alerts",
    description: "Get reminders before featured pieces go out of stock.",
    key: "stock",
  },
  {
    title: "Weekly Revenue Snapshot",
    description: "A concise summary of payouts, collections, and top products.",
    key: "revenue",
  },
];
