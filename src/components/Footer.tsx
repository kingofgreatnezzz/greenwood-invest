import React from "react";

const footerLinks = [
  {
    title: "Products",
    links: [
      { name: "Forex", href: "/forex" },
      { name: "Precious Metals", href: "/precious-metals" },
      { name: "Oil & Energy", href: "/oil-energy" },
      { name: "Index CFD", href: "/index-cfd" },
      { name: "Stocks CFD", href: "/stocks-cfd" },
    ],
  },
  {
    title: "Accounts",
    links: [
      { name: "Accounts Overview", href: "/accounts" },
      { name: "STP Account", href: "/stp-account" },
      { name: "ECN Account", href: "/ecn-account" },
      { name: "Social Trading Account", href: "/social-trading-account" },
      { name: "Demo Account", href: "/demo-account" },
    ],
  },
  {
    title: "Conditions",
    links: [
      { name: "Margin & Leverage", href: "/margin-leverage" },
      { name: "Dividend", href: "/dividend" },
      { name: "Swap", href: "/swap" },
      { name: "Fund Security", href: "/fund-security" },
      { name: "Negative Balance Protection", href: "/negative-balance-protection" },
    ],
  },
  {
    title: "Platforms",
    links: [
      { name: "MT4", href: "/mt4" },
      { name: "MT5", href: "/mt5" },
      { name: "Anzo Capital App", href: "/app" },
    ],
  },
  {
    title: "Tools",
    links: [
      { name: "Social Trading", href: "/social-trading" },
      { name: "MAM", href: "/mam" },
      { name: "Trading Servers", href: "/trading-servers" },
    ],
  },
  {
    title: "Promotions",
    links: [
      { name: "Trading Competition", href: "/trading-competition" },
    ],
  },
  {
    title: "Academy",
    links: [
      { name: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Analysis",
    links: [
      { name: "Market Analysis", href: "/market-analysis" },
      { name: "Insights", href: "/insights" },
      { name: "Economic Calendar", href: "/economic-calendar" },
    ],
  },
  {
    title: "About",
    links: [
      { name: "About Anzo", href: "/about" },
      { name: "Regulation", href: "/regulation" },
      { name: "Awards", href: "/awards" },
      { name: "Anzo Rebranding", href: "/rebranding" },
    ],
  },
  {
    title: "Customer Support",
    links: [
      { name: "Help Center", href: "/help-center" },
      { name: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Notification",
    links: [
      { name: "Notification", href: "/notification" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[var(--background)] text-[var(--foreground)] pt-16 pb-8 px-4 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-start md:justify-between gap-12">
        {/* Logo/Brand */}
        <div className="flex-shrink-0 mb-8 md:mb-0 flex items-center gap-2 text-2xl font-bold">
          <span className="text-[var(--brand)]">&#9650;</span>
          <span className="font-extrabold tracking-tight">investlp</span>
        </div>
        {/* Footer Columns */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-8">
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-[var(--brand)] mb-3 text-base">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-[var(--foreground)] hover:text-[var(--brand)] text-sm transition">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 text-xs text-[var(--foreground)]/60 text-center">
        © 2024 investlp. All rights reserved.
      </div>
    </footer>
  );
} 