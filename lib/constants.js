// ─── NAVIGATION ───────────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: "Pricing",  href: "/pricing" },
  { label: "About",    href: "/about"   },
  { label: "Contact",  href: "/contact" },
  { label: "Test",  href: "/test" },
];

export const DEPARTMENT_LINKS = [
  { label: "Logistics",  href: "/logistics",  desc: "Route intelligence"  },
  { label: "Systems",    href: "/systems",    desc: "Business analytics"  },
  { label: "Securities", href: "/securities", desc: "Risk & compliance"   },
];

// ─── COMPANY ──────────────────────────────────────────────────────────────────
export const COMPANY_NAME    = "Meridian";
export const COMPANY_TAGLINE = "Global trade intelligence for companies that move the world.";
export const COMPANY_EMAIL   = "hello@meridian.io";

// ─── LOGOS / CLIENTS ──────────────────────────────────────────────────────────
export const CLIENT_LOGOS = [
  "Maersk", "DHL", "WitPharma", "Inter Oil Eco Group", "Cargill",
  "Caterpillar", "Siemens", "IKEA", "Nestlé", "Samsung",
];

// ─── HOME FEATURES ────────────────────────────────────────────────────────────
export const FEATURES = [
  {
    num: "01",
    title: "AI Route Engine",
    desc: "Our model evaluates thousands of route combinations across land, sea, and air — optimising for cost, speed, and regulatory compliance simultaneously.",
  },
  {
    num: "02",
    title: "Product-aware Routing",
    desc: "Different goods face different rules. Meridian knows which corridors, ports, and borders are open for your specific cargo — from perishables to controlled materials.",
  },
  {
    num: "03",
    title: "Geopolitical Intelligence",
    desc: "Real-time signals on sanctions, trade disputes, border closures, and political instability. Know before your shipment moves.",
  },
  {
    num: "04",
    title: "Cost & Tax Modelling",
    desc: "Full landed-cost breakdowns including duties, VAT, handling fees, and currency exposure — across 180+ countries before you commit.",
  },
  {
    num: "05",
    title: "Risk & Compliance Engine",
    desc: "Automated contract suggestions, document checklists, and red-flag alerts for high-risk corridors. Your legal exposure, surfaced before it becomes a problem.",
  },
  {
    num: "06",
    title: "Delay Forecasting",
    desc: "Predictive models built on port congestion data, seasonal patterns, carrier performance history, and live weather to anticipate delays before they happen.",
  },
];

// ─── TIMELINE ─────────────────────────────────────────────────────────────────
export const TIMELINE_ITEMS = [
  {
    year: "2020",
    title: "Founded in Hanoi",
    desc: "A solo founder who had spent years watching shipments fail for predictable reasons. I built the system people always needed.",
  },
  {
    year: "2021",
    title: "Logistics Department Launches",
    desc: "Released the core route intelligence engine covering 160 countries and 2,400 trade corridors. First enterprise contracts with market exporters.",
  },
  {
    year: "2022",
    title: "Systems & Securities Added",
    desc: "Expanded to full-stack trade intelligence: real-time cost modelling, sanctions screening, and compliance automation. Trusted by leaders.",
  },
  {
    year: "2024",
    title: "500+ Companies Worldwide",
    desc: "Operations across 6 continents. Launched AI geopolitical risk feed, live port congestion data, and predictive delay scoring. Ranked #1 in logistics intelligence by Gartner.",
  },
];

// ─── STATS ────────────────────────────────────────────────────────────────────
export const STATS = [
  { value: "500+",   label: "Companies served"    },
  { value: "160+",   label: "Countries covered"   },
  { value: "$4.2B",  label: "Trade value routed"  },
  { value: "94%",    label: "On-time prediction accuracy" },
];

// ─── PRICING PLANS ────────────────────────────────────────────────────────────
export const PLANS = [
  {
    name: "Growth",
    monthlyPrice: 299,
    annualPrice: 239,
    desc: "For small and mid-size importers and exporters getting started with intelligent routing.",
    features: [
      "Up to 5 users",
      "Logistics route engine",
      "50 route queries / month",
      "Basic cost modelling",
      "Standard risk alerts",
      "Email support",
    ],
    cta: "Start free trial",
    highlight: false,
  },
  {
    name: "Professional",
    monthlyPrice: 799,
    annualPrice: 639,
    desc: "Full platform access for active trading companies managing complex international flows.",
    features: [
      "Up to 20 users",
      "All 3 modules (Logistics, Systems, Securities)",
      "Unlimited route queries",
      "Full cost & tax modelling",
      "Live geopolitical risk feed",
      "AI compliance automation",
      "Priority support",
    ],
    cta: "Start free trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    monthlyPrice: null,
    annualPrice: null,
    desc: "For large enterprises, freight forwarders, and governments with high-volume trade operations.",
    features: [
      "Unlimited users",
      "Custom data integrations",
      "Private AI model fine-tuning",
      "Dedicated risk analyst",
      "SLA guarantee",
      "On-premise deployment option",
    ],
    cta: "Talk to sales",
    highlight: false,
  },
];

// ─── TEAM ─────────────────────────────────────────────────────────────────────
export const TEAM = [
  { name: "Dmitri Volkov",    role: "CEO & Co-founder",        bio: "Former Head of Freight at Maersk. 14 years routing complex international cargo across sanctioned and conflict zones." },
  { name: "Lena Hoffmann",    role: "CTO & Co-founder",        bio: "Ex-Palantir data engineer. Built geospatial risk models for NATO supply chain resilience programs." },
  { name: "James Okafor",     role: "CPO & Co-founder",        bio: "Previously led product at Flexport. Obsessed with making global trade legible to non-specialists." },
  { name: "Yuki Tanaka",      role: "Head of Logistics AI",    bio: "PhD in operations research. Designed route optimisation algorithms now used by three of the world's top-10 shipping lines." },
  { name: "Sara Lindqvist",   role: "Head of Securities",      bio: "Former sanctions compliance officer at Deutsche Bank. Expert in dual-use goods and export control regimes." },
  { name: "Ahmed Al-Rashid",  role: "Head of Systems",         bio: "Built trade finance analytics at HSBC. Specialises in landed-cost modelling across emerging market corridors." },
];

// ─── VALUES ───────────────────────────────────────────────────────────────────
export const VALUES = [
  { title: "Clarity before movement",  desc: "No shipment should move without understanding the full cost, risk, and compliance picture. We make that possible in seconds." },
  { title: "Intelligence over instinct", desc: "Global trade is too complex for gut decisions. We replace assumptions with data — every corridor, every commodity, every time." },
  { title: "Speed that doesn't cut corners", desc: "Fast routing means nothing if it lands you in a compliance violation. Our systems optimise for both simultaneously." },
  { title: "Built for the real world",  desc: "Trade doesn't happen in clean datasets. We train on messy, incomplete, conflicting signals — because that's what reality looks like." },
];

// ─── OFFICES ──────────────────────────────────────────────────────────────────
export const OFFICES = [
  { city: "Rotterdam",   address: "Wilhelminakade 123, 3072 AP",  tz: "GMT+1" },
  { city: "Singapore",   address: "1 Marina Boulevard, #28-00",   tz: "GMT+8" },
  { city: "Dubai",       address: "DIFC Gate Building, Level 15", tz: "GMT+4" },
];

// ─── FAQS ─────────────────────────────────────────────────────────────────────
export const FAQS = [
  {
    q: "How does Meridian know which routes are restricted for my product?",
    a: "We maintain a continuously updated database of commodity-level trade restrictions, phytosanitary rules, import bans, and customs classifications across 160+ countries. When you enter a product and quantity, the engine cross-references this against every corridor in the proposed route in real time.",
  },
  {
    q: "How current is the geopolitical risk data?",
    a: "Our risk feed ingests from government sanctions databases (OFAC, EU, UN), live news signals, diplomatic channels, and proprietary analyst inputs. Most alerts are reflected within 2–6 hours of a development.",
  },
  {
    q: "Can Meridian integrate with our existing ERP or TMS?",
    a: "Yes. We provide REST APIs and pre-built connectors for SAP, Oracle TMS, Flexport, and most major ERP platforms. Enterprise plans include custom integration support.",
  },
  {
    q: "What does the Securities module actually recommend?",
    a: "It flags corridor-specific risks (sanctions exposure, political instability, historical seizure rates), suggests protective documents (letters of credit, insurance riders, force majeure clauses), and recommends alternate routes where risk exceeds your configured threshold.",
  },
];

// ─── FOOTER LINKS ─────────────────────────────────────────────────────────────
export const FOOTER_COLS = [
  {
    title: "Platform",
    links: [
      { label: "Logistics",  href: "/logistics"  },
      { label: "Systems",    href: "/systems"    },
      { label: "Securities", href: "/securities" },
      { label: "Pricing",    href: "/pricing"    },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About",    href: "/about"   },
      { label: "Blog",     href: "/about"   },
      { label: "Careers",  href: "/contact" },
      { label: "Press",    href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Docs",          href: "/about"   },
      { label: "API Reference", href: "/about"   },
      { label: "Status",        href: "/about"   },
      { label: "Security",      href: "/about"   },
    ],
  },
];

// ─── DEPARTMENT PAGES ──────────────────────────────────────────────────────────

export const LOGISTICS_FEATURES = [
  {
    title: "Multi-modal Route Optimisation",
    desc: "Compares ocean, air, rail, and road combinations across every feasible corridor. Balances transit time, cost, and reliability in a single ranked output.",
  },
  {
    title: "Product-aware Corridor Filtering",
    desc: "Certain goods can't move through certain places. Our engine knows. Perishables, hazardous materials, dual-use goods, and agricultural products are routed around restricted corridors automatically.",
  },
  {
    title: "Live Port & Border Intelligence",
    desc: "Real-time congestion data from 3,200+ ports worldwide. Strike actions, weather closures, and capacity constraints are factored in before you book.",
  },
  {
    title: "Carrier & Forwarder Benchmarking",
    desc: "Compare actual on-time performance, loss rates, and pricing across 800+ carriers. Pick the right partner for the specific lane, not just the cheapest quote.",
  },
  {
    title: "Incoterms Advisor",
    desc: "Automatically recommends the appropriate Incoterms for your trade relationship, counterparty jurisdiction, and cargo type — with plain-language explanations.",
  },
  {
    title: "Scenario Planning",
    desc: "Model 'what if' disruptions before they happen. Reroute simulations for port closures, canal blockages, or carrier failures completed in under 3 seconds.",
  },
];

export const SYSTEMS_FEATURES = [
  {
    title: "Full Landed Cost Calculator",
    desc: "Import duties, VAT, excise, port handling, insurance, agent fees — calculated for every route option, before you commit.",
  },
  {
    title: "Tax & Tariff Intelligence",
    desc: "Live tariff databases for 160+ countries. HS code classification, preferential trade agreement eligibility, and duty drawback opportunities surfaced automatically.",
  },
  {
    title: "Cash Flow Forecasting",
    desc: "Model the full payment cycle from purchase order to delivery — including financing costs, currency exposure, and working capital requirements.",
  },
  {
    title: "Supplier Country Analytics",
    desc: "For a given product and volume, Meridian ranks sourcing countries by total cost, lead time, quality risk, and geopolitical stability. Make sourcing decisions on evidence.",
  },
  {
    title: "Currency & FX Risk Modelling",
    desc: "Track exposure across multi-currency trade flows. Hedging recommendations based on your payment terms and route timelines.",
  },
  {
    title: "Performance Dashboards",
    desc: "KPIs across every trade lane: average transit time, cost per kg, delay frequency, duty reclaim rates. Connect to your ERP for unified visibility.",
  },
];

export const SECURITIES_FEATURES = [
  {
    title: "Sanctions Screening",
    desc: "Automated screening of counterparties, intermediaries, and transit countries against OFAC, EU, UN, and OFSI lists — updated within hours of changes.",
  },
  {
    title: "Geopolitical Risk Feed",
    desc: "AI-monitored signals across 180 countries: election risk, coup probability, trade war escalation, and border closure likelihood — scored and ranked for your specific routes.",
  },
  {
    title: "Corridor Risk Scoring",
    desc: "Every proposed route receives a risk score based on political stability, historical seizure rates, corruption indices, and current diplomatic conditions.",
  },
  {
    title: "Document & Contract Advisor",
    desc: "Recommends protective instruments — letters of credit, insurance riders, force majeure clauses, and inspection certificates — based on corridor risk and counterparty profile.",
  },
  {
    title: "Export Control Compliance",
    desc: "Flags dual-use goods, controlled technologies, and items requiring export licences. Pre-screens against the EU Dual-Use Regulation, US EAR, and ITAR.",
  },
  {
    title: "Incident Response Playbooks",
    desc: "Pre-built response plans for shipment seizure, counterparty insolvency, sanctions designation, and force majeure events — customisable to your operations.",
  },
];
