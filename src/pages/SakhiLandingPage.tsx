import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Baby,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Compass,
  Heart,
  Languages,
  MessageCircle,
  Quote,
  RotateCcw,
  Send,
  Shield,
  Sparkles,
  Star,
  Stethoscope,
  Users,
  X,
} from "lucide-react";
import { sendChatMessage } from "../api/sakhiApi";
import type { UILang } from "../components/TopNav";
import { FormattedMessage } from "../components/FormattedMessage";

interface SakhiLandingPageProps {
  lang: UILang;
  onTrySakhi: (initialPrompt?: string) => void;
}

interface DemoMessage {
  id: string;
  text: string;
  isUser: boolean;
  isStreaming?: boolean;
}

const HOW_IT_WORKS_CARDS = [
  {
    icon: Heart,
    title: "Emotional Support",
    outcome: "Feel heard and understood",
    description:
      "Receive guidance tailored specifically to your medical history and emotional needs.",
    iconBg: "bg-[#FFF1F2]",
    iconColor: "text-[#EC4899]",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    outcome: "Support when you need it",
    description:
      "A comforting presence available whenever you need it—day or night.",
    iconBg: "bg-[#EFF6FF]",
    iconColor: "text-[#2563EB]",
  },
  {
    icon: Shield,
    title: "Privacy & Security",
    outcome: "Your story stays yours",
    description:
      "Your data and conversations are always encrypted and handled with the utmost sensitivity.",
    iconBg: "bg-[#F0FDFA]",
    iconColor: "text-[#0D9488]",
  },
  {
    icon: Stethoscope,
    title: "Clinical Accuracy",
    outcome: "Verified guidance for you",
    description:
      "Access reliable, evidence-based information regarding IVF, IUI, and reproductive health.",
    iconBg: "bg-[#F5F3FF]",
    iconColor: "text-[#9333EA]",
  },
];

const SUPPORT_AREAS = [
  {
    icon: Heart,
    title: "Emotional guidance",
    subtitle: "Treatments",
    examples: [
      "Managing treatment anxiety",
      "Handling failed cycles",
      "Celebrating small wins",
    ],
    color: "#EC4899",
    angle: -45,
  },
  {
    icon: Baby,
    title: "Pregnancy support",
    subtitle: "Parenting",
    examples: [
      "Trimester-specific advice",
      "Postpartum care",
      "Early parenting questions",
    ],
    color: "#3B82F6",
    angle: 45,
  },
  {
    icon: Compass,
    title: "Family planning",
    subtitle: "Decisions",
    examples: [
      "Treatment options explained",
      "Financial planning help",
      "Partner communication",
    ],
    color: "#8B5CF6",
    angle: 135,
  },
  {
    icon: Languages,
    title: "Language Support",
    subtitle: "Language",
    examples: [
      "Traditional practices guidance",
      "Multi-language support",
      "Community connection",
    ],
    color: "#F59E0B",
    angle: 225,
  },
];

const COMPARISON_ROWS = [
  {
    feature: "Emotional Intelligence",
    sakhi: "Listens carefully and responds with empathy",
    others: "Mostly tracks information without emotional understanding",
  },
  {
    feature: "Availability",
    sakhi: "Available anytime, day or night",
    others: "Help only during fixed office hours",
  },
  {
    feature: "Personalization",
    sakhi: "Gives advice based on your personal situation",
    others: "Gives general advice that may not fit you",
  },
  {
    feature: "Medical Accuracy",
    sakhi: "Provides guidance based on medical knowledge",
    others: "Information may not always be medically verified",
  },
  {
    feature: "Language support",
    sakhi: "Speaks your heart’s language (English, Hindi, Telugu)",
    others: "Mostly restricted to English only",
  },
];

const TESTIMONIALS = [
  {
    name: "Priya M.",
    location: "Mumbai",
    text: "After two failed IVF cycles, I was emotionally drained. Sakhi helped me process my grief and find hope again.",
    rating: 5,
  },
  {
    name: "Ananya K.",
    location: "Bangalore",
    text: "Having support in Hindi made all the difference. Sakhi understands our cultural context in a way others don't.",
    rating: 5,
  },
  {
    name: "Divya S.",
    location: "Hyderabad",
    text: "3 AM pregnancy anxiety? Sakhi was there. No judgment, just compassion. It's like having a friend who truly gets it.",
    rating: 5,
  },
];

const FAQS = [
  {
    question: "Is Sakhi free to use?",
    answer:
      "Yes! Sakhi is completely free. We believe emotional support during your fertility journey should be accessible to everyone.",
  },
  {
    question: "How is my privacy protected?",
    answer:
      "Your conversations are encrypted and isolated per patient profile. Sensitive clinical details are protected by zero-trust isolation.",
  },
  {
    question: "Can Sakhi replace my doctor?",
    answer:
      "No. Sakhi provides emotional support and general guidance, but is not a replacement for medical advice. Always consult your healthcare provider for medical decisions.",
  },
  {
    question: "What languages does Sakhi support?",
    answer:
      "Sakhi currently supports English, Hindi, and Telugu (including Tinglish). You can switch languages anytime during your conversation.",
  },
  {
    question: "How does Sakhi understand cultural context?",
    answer:
      "Sakhi is designed around diverse cultural perspectives on fertility, family planning, and parenting practices specific to India so guidance feels relevant and warm.",
  },
  {
    question: "Is there someone I can talk to in a crisis?",
    answer:
      "While Sakhi provides 24/7 support, in urgent medical or emotional situations please contact your doctor or emergency services immediately. Sakhi also flags red-flag symptoms for clinical escalation.",
  },
];

const DEMO_PROMPTS_BY_LANG: Record<UILang, string[]> = {
  en: [
    "Does age really affect our chances?",
    "Healthy routines during pregnancy",
    "Explain me the IVF journey?",
  ],
  te: [
    "వయస్సు నిజంగా ప్రెగ్నెన్సీ అవకాశాలను తగ్గిస్తుందా?",
    "ప్రెగ్నెన్సీ సమయంలో ఎలాంటి జాగ్రత్తలు తీసుకోవాలి?",
    "IVF ప్రాసెస్ గురించి వివరంగా చెప్పండి?",
  ],
  hi: [
    "क्या उम्र वास्तव में हमारी संभावनाओं को प्रभावित करती है?",
    "गर्भावस्था के दौरान स्वस्थ दिनचर्या",
    "मुझे आईवीएफ यात्रा के बारे में समझाएं?",
  ],
};

export const SakhiLandingPage: React.FC<SakhiLandingPageProps> = ({
  lang,
  onTrySakhi,
}) => {
  // Interactive orbital state
  const [activeArea, setActiveArea] = useState<number | null>(null);
  const [isMobileOrbit, setIsMobileOrbit] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth < 1024 : false
  );

  // Embedded demo chat state (wired live to Sakhi backend!)
  const [demoMessages, setDemoMessages] = useState<DemoMessage[]>([]);
  const [demoInput, setDemoInput] = useState("");
  const [demoLoading, setDemoLoading] = useState(false);
  const demoEndRef = useRef<HTMLDivElement>(null);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const onResize = () => setIsMobileOrbit(window.innerWidth < 1024);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (demoMessages.length > 0) {
      demoEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [demoMessages]);

  const handleDemoSend = async (rawText: string) => {
    const text = rawText.trim();
    if (!text || demoLoading) return;

    setDemoLoading(true);
    const userMsg: DemoMessage = {
      id: `u-${Date.now()}`,
      text,
      isUser: true,
    };
    setDemoMessages((prev) => [...prev, userMsg]);
    setDemoInput("");

    try {
      const payloads = await sendChatMessage({
        sessionPhone: "+911111111111",
        message: text,
        language: lang === "te" ? "te" : lang === "hi" ? "hi" : "en",
      });

      const parts = payloads
        .map((p) => {
          if (p.text?.body) return p.text.body;
          if (p.interactive?.body?.text) return p.interactive.body.text;
          if (p.image?.caption) return p.image.caption;
          return "";
        })
        .filter(Boolean);

      const fullReply =
        parts.join("\n\n") ||
        "I am here to support you. Tell me a little more about what you are experiencing.";
      const botId = `b-${Date.now() + 1}`;
      setDemoMessages((prev) => [
        ...prev,
        { id: botId, text: "", isUser: false, isStreaming: true },
      ]);

      // Smooth streaming reveal like JanmaSethu demo
      const step = Math.max(2, Math.ceil(fullReply.length / 45));
      for (let i = step; i <= fullReply.length + step; i += step) {
        const slice = fullReply.slice(0, i);
        setDemoMessages((prev) =>
          prev.map((m) => (m.id === botId ? { ...m, text: slice } : m))
        );
        await new Promise((r) => setTimeout(r, 16));
      }
      setDemoMessages((prev) =>
        prev.map((m) =>
          m.id === botId ? { ...m, text: fullReply, isStreaming: false } : m
        )
      );
    } catch {
      setDemoMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          text: "Sorry, I had trouble responding. Please try again.",
          isUser: false,
        },
      ]);
    } finally {
      setDemoLoading(false);
    }
  };

  const resetDemo = () => {
    setDemoMessages([]);
    setDemoInput("");
    setDemoLoading(false);
  };

  const demoPrompts = DEMO_PROMPTS_BY_LANG[lang] || DEMO_PROMPTS_BY_LANG.en;

  return (
    <div className="min-h-screen bg-white relative">
      {/* Right-Edge Floating Action Buttons (matches JanmaSethu screenshot) */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col gap-2">
        <button
          type="button"
          onClick={() => onTrySakhi()}
          title="Chat with Sakhi"
          className="w-11 h-11 rounded-l-xl bg-[#25D366] hover:bg-[#1FB858] text-white shadow-lg flex items-center justify-center transition-all hover:w-12 cursor-pointer"
        >
          <MessageCircle className="w-5 h-5" />
        </button>
        <a
          href="/whatsapp-console/"
          title="Open WhatsApp Test Console"
          className="w-11 h-11 rounded-l-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-lg flex items-center justify-center transition-all hover:w-12"
        >
          <Users className="w-5 h-5" />
        </a>
      </div>

      {/* SECTION 1: HERO (FV) */}
      <section
        id="hero"
        className="relative pt-8 pb-12 lg:pt-6 lg:pb-10 overflow-hidden bg-gradient-to-br from-[#F5F7FF] via-[#FFECEF] to-[#F0FDFA]"
      >
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12">
            {/* Left Copy */}
            <div className="flex-1 max-w-2xl text-center lg:text-left">
              <h1 className="mt-1 text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-[1.12] tracking-tight font-serif">
                <span className="block">Meet Sakhi - Your</span>
                <span className="block bg-gradient-to-r from-primary via-[#EC4899] to-[#F97316] bg-clip-text text-transparent animate-gradient-x pb-2">
                  Compassionate Companion
                </span>
              </h1>

              <p className="mt-2 text-lg md:text-xl text-gray-600 leading-relaxed font-sans max-w-xl mx-auto lg:mx-0">
                Sakhi understands the emotional challenges of fertility journeys
                and provides culturally-aware support, 24/7.
              </p>

              {/* CTA Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <button
                  type="button"
                  onClick={() => onTrySakhi()}
                  className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-[#EC4899] text-white rounded-full font-semibold shadow-[0_12px_30px_rgba(236,72,153,0.3)] hover:shadow-[0_18px_36px_rgba(236,72,153,0.42)] hover:scale-[1.03] active:scale-[0.98] transition-all overflow-hidden cursor-pointer"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-sweep pointer-events-none" />
                  <span className="relative flex items-center justify-center gap-2">
                    Try Sakhi Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const el = document.querySelector("#demo");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                    else onTrySakhi();
                  }}
                  className="w-full sm:w-auto px-8 py-4 bg-white/85 backdrop-blur-sm text-gray-800 rounded-full font-medium border-2 border-gray-200 hover:border-primary/60 hover:bg-primary/5 transition-all cursor-pointer"
                >
                  Browse Knowledge Hub
                </button>
              </div>

              {/* 3 Stat Badges */}
              <div className="mt-9 flex items-center justify-center lg:justify-start gap-7 sm:gap-9 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-full text-primary">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-gray-900">10k+</div>
                    <div className="text-xs text-gray-500 font-medium">
                      Users Supported
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-full text-primary">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-gray-900">95%</div>
                    <div className="text-xs text-gray-500 font-medium">
                      Satisfaction Rate
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-full text-primary">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-gray-900">24/7</div>
                    <div className="text-xs text-gray-500 font-medium">
                      Available Support
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Circular Illustration + 3 Floating Icon Cards */}
            <div className="hidden lg:flex flex-1 relative h-[540px] items-center justify-center">
              <div className="w-full max-w-[490px] aspect-square relative">
                <div className="w-full h-full shadow-2xl overflow-hidden rounded-full bg-white flex items-center justify-center border-8 border-white/80">
                  <img
                    src="/sakhi-updt.png"
                    alt="Sakhi — Compassionate Companion"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Floating Icon Cards */}
              <div className="absolute top-16 right-12 p-4 rounded-2xl bg-[#FFF1F2] shadow-xl border border-white animate-float-1">
                <Heart className="w-7 h-7 text-[#EC4899]" />
              </div>
              <div className="absolute top-56 right-0 p-4 rounded-2xl bg-[#F5F3FF] shadow-xl border border-white animate-float-2">
                <Users className="w-7 h-7 text-[#9333EA]" />
              </div>
              <div className="absolute bottom-20 right-10 p-4 rounded-2xl bg-[#EFF6FF] shadow-xl border border-white animate-float-3">
                <MessageCircle className="w-7 h-7 text-[#2563EB]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: VALUE PROPOSITION (BV) */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-serif leading-tight">
            Your fertility journey{" "}
            <span className="block bg-gradient-to-r from-primary via-[#EC4899] to-primary bg-clip-text text-transparent">
              shouldn&apos;t feel lonely
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-10">
            Whether you are exploring options, undergoing treatment, or simply
            need someone to listen, Sakhi is here to offer non-judgmental
            support and personalized care tailored to your unique path.
          </p>

          <button
            type="button"
            onClick={() => onTrySakhi()}
            className="inline-flex items-center gap-2.5 px-9 py-4 bg-gradient-to-r from-primary to-[#EC4899] text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
          >
            Start Talking to Sakhi
            <ArrowRight className="w-5 h-5" />
          </button>

          <p className="mt-5 text-sm text-gray-500 font-medium">
            Join 10,000+ women who found their compassionate companion
          </p>
        </div>
      </section>

      {/* SECTION 3: HOW SAKHI WORKS (HV) */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 font-serif">
              How Sakhi Works
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              Simple support that fits your life
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {HOW_IT_WORKS_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  onClick={() => onTrySakhi()}
                  className="group p-7 bg-white rounded-3xl border border-gray-100 shadow-[0_10px_35px_rgba(15,23,42,0.05)] hover:shadow-[0_20px_45px_rgba(20,184,166,0.12)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
                >
                  <div
                    className={`w-14 h-14 ${card.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`w-7 h-7 ${card.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1.5 font-serif">
                    {card.title}
                  </h3>
                  <p className="text-sm font-semibold text-primary mb-3">
                    {card.outcome}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: SPECIFIC WAYS SAKHI SUPPORTS YOU (zV - Interactive Orbital Ring) */}
      <section
        id="ways"
        className="py-16 md:py-24 lg:py-28 bg-[#FAFBFF] overflow-hidden min-h-[640px] flex items-center"
      >
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
            {/* Left Heading */}
            <div className="w-full lg:w-1/3 text-center lg:text-left z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-serif leading-tight">
                Specific ways
                <br />
                <span className="text-primary italic">Sakhi supports you</span>
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto lg:mx-0">
                Explore how Sakhi becomes part of your journey through every
                milestone and emotion. Hover or click the icons to explore.
              </p>
              <button
                type="button"
                onClick={() => onTrySakhi()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-pink-200 hover:border-[#EC4899] text-gray-800 hover:text-[#EC4899] rounded-full text-sm font-semibold shadow-sm transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#EC4899]" />
                Ask Sakhi Now
              </button>
            </div>

            {/* Right Interactive Orbit Diagram */}
            <div className="relative w-full lg:w-2/3 h-[420px] md:h-[520px] lg:h-[560px] flex items-center justify-center">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[460px] md:h-[460px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

              {/* Concentric dashed orbit rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[240px] h-[240px] md:w-[360px] md:h-[360px] lg:w-[420px] lg:h-[420px] border border-dashed border-primary/15 rounded-full" />
                <div className="absolute w-[170px] h-[170px] md:w-[250px] md:h-[250px] lg:w-[300px] lg:h-[300px] border border-dashed border-[#EC4899]/15 rounded-full" />
              </div>

              {/* Pulsing Center Sakhi Medallion */}
              <div className="relative z-20 w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-primary/5 animate-pulse-ring">
                {activeArea === null ? (
                  <span className="text-xl md:text-2xl lg:text-3xl font-bold font-serif bg-gradient-to-r from-primary to-[#EC4899] bg-clip-text text-transparent">
                    Sakhi
                  </span>
                ) : (
                  <div className="text-center px-3">
                    <div
                      className="text-[10px] font-bold uppercase tracking-widest mb-1"
                      style={{ color: SUPPORT_AREAS[activeArea].color }}
                    >
                      {SUPPORT_AREAS[activeArea].subtitle}
                    </div>
                    <div className="text-xs md:text-sm font-bold leading-tight text-gray-800">
                      {SUPPORT_AREAS[activeArea].title}
                    </div>
                  </div>
                )}
              </div>

              {/* 4 Orbiting Interactive Nodes */}
              <div className="absolute inset-0 z-30 pointer-events-none">
                {SUPPORT_AREAS.map((area, idx) => {
                  const Icon = area.icon;
                  const isActive = activeArea === idx;
                  const radius = isMobileOrbit ? 112 : 195;
                  const rad = (area.angle * Math.PI) / 180;
                  const tx = Math.cos(rad) * radius;
                  const ty = Math.sin(rad) * radius;
                  const alignLeft = area.angle === 135 || area.angle === 225;

                  return (
                    <div
                      key={area.title}
                      className="absolute top-1/2 left-1/2 pointer-events-auto transition-transform duration-300"
                      style={{
                        transform: `translate(${tx}px, ${ty}px)`,
                        marginLeft: isMobileOrbit ? "-32px" : "-40px",
                        marginTop: isMobileOrbit ? "-32px" : "-40px",
                      }}
                    >
                      <div
                        className="relative"
                        onMouseEnter={() => setActiveArea(idx)}
                        onMouseLeave={() => setActiveArea(null)}
                      >
                        <button
                          type="button"
                          onClick={() => setActiveArea(isActive ? null : idx)}
                          className="cursor-pointer group relative"
                          aria-label={area.title}
                        >
                          <div
                            className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-white shadow-xl flex items-center justify-center border-2 transition-all duration-300 ${
                              isActive ? "scale-110" : "hover:scale-105"
                            }`}
                            style={{
                              borderColor: isActive ? area.color : "transparent",
                            }}
                          >
                            <Icon
                              className="w-7 h-7 md:w-8 md:h-8"
                              style={{ color: area.color }}
                            />
                          </div>
                          {!isMobileOrbit && (
                            <div
                              className={`absolute left-1/2 -translate-x-1/2 mt-3 whitespace-nowrap text-center transition-all duration-300 ${
                                isActive
                                  ? "opacity-100 scale-100"
                                  : "opacity-65 scale-95"
                              }`}
                            >
                              <p className="font-bold text-gray-900 text-xs leading-none">
                                {area.title}
                              </p>
                            </div>
                          )}
                        </button>

                        {/* Desktop Floating Tooltip Card */}
                        {!isMobileOrbit && isActive && (
                          <div
                            className={`absolute ${
                              alignLeft ? "right-full mr-5" : "left-full ml-5"
                            } top-1/2 -translate-y-1/2 w-68 p-5 rounded-[1.75rem] bg-white shadow-2xl border border-gray-100 z-50`}
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="p-2 rounded-xl bg-gray-50">
                                <Icon
                                  className="w-5 h-5"
                                  style={{ color: area.color }}
                                />
                              </div>
                              <div
                                className="text-[10px] font-bold uppercase tracking-widest"
                                style={{ color: area.color }}
                              >
                                {area.subtitle}
                              </div>
                            </div>
                            <h4 className="text-base font-bold text-gray-900 mb-3">
                              {area.title}
                            </h4>
                            <ul className="space-y-2">
                              {area.examples.map((ex) => (
                                <li key={ex}>
                                  <button
                                    type="button"
                                    onClick={() => onTrySakhi(ex)}
                                    className="w-full text-left flex items-center gap-2 text-xs text-gray-600 hover:text-primary font-medium py-1 rounded-lg transition-colors cursor-pointer"
                                  >
                                    <span
                                      className="w-1.5 h-1.5 rounded-full shrink-0"
                                      style={{ backgroundColor: area.color }}
                                    />
                                    <span>{ex}</span>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile Selected Area Detail Sheet */}
          {isMobileOrbit && activeArea !== null && (
            <div className="mt-4 max-w-md mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p
                    className="text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: SUPPORT_AREAS[activeArea].color }}
                  >
                    {SUPPORT_AREAS[activeArea].subtitle}
                  </p>
                  <h4 className="text-lg font-bold text-gray-900">
                    {SUPPORT_AREAS[activeArea].title}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveArea(null)}
                  className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {SUPPORT_AREAS[activeArea].examples.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => onTrySakhi(ex)}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl bg-gray-50 hover:bg-pink-50 text-sm text-gray-700 font-medium flex items-center justify-between"
                  >
                    <span>{ex}</span>
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 5: EMBEDDED INTERACTIVE DEMO (qV) */}
      <section id="demo" className="py-12 md:py-20 bg-[#FAFBFF]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100 flex flex-col h-[640px] relative">
            {/* Demo Header */}
            <div className="px-6 sm:px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-0.5">
                  Sakhi — Conversation (Demo)
                </h3>
                <p className="text-gray-500 text-sm font-medium">
                  Type in English/हिंदी/తెలుగు — reply mirrors your language.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onTrySakhi()}
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-primary to-[#EC4899] text-white text-xs font-semibold shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  Full Experience
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={resetDemo}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  title="Reset Conversation"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-6 sm:p-8 space-y-5 overflow-y-auto custom-scrollbar bg-white">
              {demoMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center select-none">
                  <p className="text-gray-400 text-xl md:text-2xl font-medium">
                    Start a conversation with Sakhi...
                  </p>
                </div>
              ) : (
                demoMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-5 py-3.5 rounded-2xl ${
                        msg.isUser
                          ? "bg-[#F3F4F6] text-gray-800 rounded-tr-sm shadow-sm"
                          : "bg-white border border-gray-100 shadow-md text-gray-800 rounded-tl-sm"
                      }`}
                    >
                      <div className="text-sm md:text-base leading-relaxed">
                        <FormattedMessage text={msg.text} />
                        {msg.isStreaming && (
                          <span className="animate-pulse inline-block ml-1 text-primary">
                            ▌
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={demoEndRef} />
            </div>

            {/* Quick Prompts + Input Bar */}
            <div className="px-6 sm:px-8 py-5 bg-white border-t border-gray-100 space-y-4">
              <div className="space-y-3">
                <p className="text-sm font-bold text-gray-900">Quick prompts:</p>
                <div className="flex flex-wrap gap-2.5">
                  {demoPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => handleDemoSend(prompt)}
                      disabled={demoLoading}
                      className="px-4 py-2.5 bg-[#EFF6FF] text-[#2563EB] hover:bg-[#DBEAFE] rounded-2xl text-sm font-medium transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleDemoSend(demoInput);
                }}
                className="relative flex items-center gap-3"
              >
                <input
                  type="text"
                  value={demoInput}
                  onChange={(e) => setDemoInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={demoLoading}
                  className="w-full px-6 py-3.5 bg-white border border-gray-200 focus:border-pink-300 rounded-full focus:outline-none transition-all text-gray-700 shadow-sm"
                />
                <button
                  type="submit"
                  disabled={demoLoading || !demoInput.trim()}
                  className="p-3.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full shadow-lg disabled:opacity-50 hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
                  aria-label="Send message"
                >
                  {demoLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: WHY CHOOSE SAKHI (UV) */}
      <section
        id="why-sakhi"
        className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 font-serif">
              Why choose Sakhi?
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              Support that works for your life, not the other way around
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-3 gap-4 p-5 sm:p-6 bg-gradient-to-r from-[#F5F7FF] via-[#FFECEF] to-[#F0FDFA] border-b border-gray-100 font-bold text-gray-900 text-sm md:text-base">
              <div>Feature</div>
              <div className="text-center text-primary">Sakhi</div>
              <div className="text-center text-gray-500">
                Traditional Support
              </div>
            </div>

            {/* Table Rows */}
            {COMPARISON_ROWS.map((row) => (
              <div
                key={row.feature}
                className="grid grid-cols-3 gap-4 p-5 sm:p-6 border-b border-gray-100 last:border-b-0 hover:bg-primary/5 transition-colors items-center"
              >
                <div className="text-sm md:text-base text-gray-900 font-semibold">
                  {row.feature}
                </div>
                <div className="flex items-start sm:items-center justify-center gap-2 text-center">
                  <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5 sm:mt-0" />
                  <span className="text-xs sm:text-sm md:text-base text-gray-700">
                    {row.sakhi}
                  </span>
                </div>
                <div className="flex items-start sm:items-center justify-center gap-2 text-center">
                  <X className="w-4 h-4 text-gray-300 shrink-0 mt-0.5 sm:mt-0 hidden sm:block" />
                  <span className="text-xs sm:text-sm md:text-base text-gray-500">
                    {row.others}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => onTrySakhi()}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-[#EC4899] text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all cursor-pointer"
            >
              Try Sakhi Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 7: REAL STORIES FROM REAL WOMEN (YV) */}
      <section id="stories" className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 font-serif">
              Real stories from real women
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              Join thousands who found their compassionate companion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {TESTIMONIALS.map((item) => (
              <div
                key={item.name}
                className="relative p-8 bg-gradient-to-br from-[#F5F7FF] to-[#FFECEF] rounded-3xl border border-primary/10 hover:-translate-y-2 hover:shadow-[0_24px_50px_-12px_rgba(139,92,246,0.2)] transition-all duration-300"
              >
                <Quote className="w-8 h-8 text-primary/50 mb-4" />
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: item.rating }).map((_, idx) => (
                    <Star
                      key={idx}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  &ldquo;{item.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-5 border-t border-primary/20">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-[#EC4899] rounded-full flex items-center justify-center text-white font-semibold">
                    {item.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 4-column Trust Metrics */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "10,000+", label: "Women supported" },
              { value: "95%", label: "Satisfaction rate" },
              { value: "24/7", label: "Always available" },
              { value: "3", label: "Languages" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: FAQ & FINAL CTA (JV) */}
      <section id="faq" className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 font-serif">
              Your questions answered
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              Everything you need to know about Sakhi
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.question}
                  className="border border-gray-200 rounded-2xl overflow-hidden hover:border-primary/30 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-primary/5 transition-colors cursor-pointer"
                  >
                    <span className="font-semibold text-gray-900 text-lg pr-4 font-serif">
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-primary shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-gray-600 leading-relaxed bg-primary/5">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Final CTA Banner */}
          <div className="mt-12 text-center p-8 sm:p-10 bg-gradient-to-br from-[#F5F7FF] to-[#FFECEF] rounded-3xl border border-primary/20">
            <h3 className="font-bold text-2xl text-gray-900 mb-2 font-serif">
              Ready to find your Sakhi?
            </h3>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              Join a community that prioritizes your emotional well-being as
              much as your clinical success.
            </p>
            <button
              type="button"
              onClick={() => onTrySakhi()}
              className="px-8 py-3.5 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 hover:scale-[1.03] active:scale-[0.98] transition-all shadow-md cursor-pointer"
            >
              Get Started Today
            </button>
          </div>
        </div>
      </section>

      {/* Clean JanmaSethu Footer */}
      <footer className="border-t border-gray-100 bg-[#FAFBFF] py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/janmasethu-logo.svg"
              alt="JanmaSethu"
              className="h-8 w-auto object-contain"
            />
          </div>
          <p className="text-xs text-gray-500 text-center sm:text-left">
            Sakhi provides emotional support and general guidance, not a
            replacement for emergency medical care.
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => onTrySakhi()}
              className="text-[#EC4899] hover:underline cursor-pointer"
            >
              Try Sakhi
            </button>
            <a
              href="/whatsapp-console/"
              className="text-teal-600 hover:underline"
            >
              WhatsApp Console
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
