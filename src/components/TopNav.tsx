import React, { useState } from "react";
import { Menu, X, ChevronDown, MessageCircle } from "lucide-react";

export type UILang = "en" | "te" | "hi";

interface TopNavProps {
  lang: UILang;
  onLangChange: (lang: UILang) => void;
  onTrySakhi: (initialPrompt?: string) => void;
}

const NAV_ITEMS = [
  { label: "COMMUNITY", target: "#stories" },
  { label: "HOME", target: "#hero" },
  { label: "KNOWLEDGE HUB", target: "#ways" },
  { label: "SAKHI", target: "#hero", active: true },
  { label: "TOOLS", target: "#demo" },
  { label: "TREATMENTS", target: "#ways" },
  { label: "BLOGS", target: "#faq" },
  { label: "SUCCESS STORIES", target: "#stories" },
  { label: "EXPERTS", target: "#why-sakhi" },
];

export const TopNav: React.FC<TopNavProps> = ({ lang, onLangChange, onTrySakhi }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const el = document.querySelector(target);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-[0_1px_12px_rgba(15,23,42,0.04)]">
      {/* Row 1: Menu + Language toggle | JanmaSethu Logo | Profile / Try Sakhi */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Left: Menu + EN / తెలుగు pill */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="inline-flex items-center bg-gray-100/90 rounded-full p-0.5 border border-gray-200/70">
            <button
              type="button"
              onClick={() => onLangChange("en")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                lang === "en"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => onLangChange("te")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                lang === "te"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              తెలుగు
            </button>
          </div>
        </div>

        {/* Center: JanmaSethu official logo */}
        <a
          href="#hero"
          onClick={(e) => handleAnchorClick(e, "#hero")}
          className="flex items-center justify-center shrink-0"
        >
          <img
            src="/janmasethu-logo.svg"
            alt="JanmaSethu — Path To Parenthood"
            className="h-9 sm:h-10 w-auto object-contain"
          />
        </a>

        {/* Right: User / Try Sakhi Pill */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onTrySakhi()}
            className="inline-flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-white border border-gray-200 hover:border-pink-300 shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#EC4899] to-rose-500 text-white text-xs font-bold flex items-center justify-center">
              S
            </span>
            <span className="hidden sm:inline text-xs font-semibold text-gray-800">
              Try Sakhi
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Row 2: Horizontal Category Navigation Bar */}
      <div className="hidden md:block border-t border-gray-100/90 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-10 flex items-center justify-center gap-6 lg:gap-8 overflow-x-auto">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.target}
              onClick={(e) => handleAnchorClick(e, item.target)}
              className={`text-[11px] font-semibold tracking-wider uppercase whitespace-nowrap transition-colors ${
                item.active
                  ? "text-[#EC4899]"
                  : "text-gray-600 hover:text-[#EC4899]"
              }`}
            >
              {item.label}
            </a>
          ))}
          <a
            href="/whatsapp-console/"
            className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wider uppercase whitespace-nowrap text-teal-600 hover:text-teal-700 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WHATSAPP CONSOLE
          </a>
        </div>
      </div>

      {/* Collapsible Mobile / Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white shadow-lg px-4 py-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.target}
              onClick={(e) => handleAnchorClick(e, item.target)}
              className={`block px-3 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase ${
                item.active
                  ? "bg-pink-50 text-[#EC4899]"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </a>
          ))}
          <div className="pt-2 mt-2 border-t border-gray-100 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onTrySakhi();
              }}
              className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-primary to-[#EC4899] text-white text-xs font-semibold shadow-sm cursor-pointer"
            >
              Try Sakhi Now
            </button>
            <a
              href="/whatsapp-console/"
              className="px-3.5 py-2.5 rounded-full border border-teal-200 text-teal-700 text-xs font-semibold"
            >
              WhatsApp Console
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
