import React, { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  ChevronDown,
  Clock,
  Globe,
  Heart,
  LogOut,
  MapPin,
  Mic,
  RotateCcw,
  Send,
  Shield,
  Sparkles,
  Stethoscope,
  UserCircle2,
  Users,
} from "lucide-react";
import { ApiError, fetchCarePreview, sendChatMessage } from "../api/sakhiApi";
import { PATIENT_PROFILES } from "../data/profiles";
import type {
  CarePreviewData,
  ChatMessage,
  SakhiResponsePayload,
} from "../types/sakhi";
import type { UILang } from "../components/TopNav";
import { FormattedMessage } from "../components/FormattedMessage";
import { CareDataPreviewModal } from "../components/CareDataPreviewModal";

interface SakhiTryPageProps {
  lang: UILang;
  onLangChange: (lang: UILang) => void;
  initialPrompt?: string;
  onConsumeInitialPrompt?: () => void;
  onExitToLanding: () => void;
}

const I18N = {
  en: {
    sakhiCompanion: "YOUR FERTILITY COMPANION",
    startJourney: "Start Your Journey",
    startJourneyDesc:
      "Send a message to Sakhi and receive personalized support, expert guidance, and compassionate care.",
    privateSecure: "Private & Secure",
    available247: "24/7 Available",
    partnerSupport: "Partner Support",
    multiLanguage: "Multi-language",
    quickStart: "Quick Start",
    typeMessage: "Type your message...",
    logout: "Logout",
    contextTitle: "CONVERSATION CONTEXT",
    errorConnecting:
      "Sorry, I'm having trouble connecting right now. Please try again.",
    prompts: [
      "Does age really affect our chances?",
      "Healthy routines during pregnancy",
      "Explain me the IVF journey?",
      "Find fertility hospitals near 500034",
    ],
  },
  hi: {
    sakhiCompanion: "आपकी प्रजनन साथी",
    startJourney: "अपनी यात्रा शुरू करें",
    startJourneyDesc:
      "सखी को संदेश भेजें और व्यक्तिगत सहायता, विशेषज्ञ मार्गदर्शन और करुणामय देखभाल प्राप्त करें।",
    privateSecure: "निजी और सुरक्षित",
    available247: "24/7 उपलब्ध",
    partnerSupport: "साथी सहायता",
    multiLanguage: "बहुभाषी",
    quickStart: "त्वरित शुरुआत",
    typeMessage: "अपना संदेश लिखें...",
    logout: "लॉगआउट",
    contextTitle: "बातचीत का संदर्भ",
    errorConnecting:
      "क्षमा करें, मुझे अभी जुड़ने में समस्या हो रही है। कृपया पुनः प्रयास करें।",
    prompts: [
      "क्या उम्र वास्तव में हमारी संभावनाओं को प्रभावित करती है?",
      "गर्भावस्था के दौरान स्वस्थ दिनचर्या",
      "मुझे आईवीएफ यात्रा के बारे में समझाएं?",
      "Find fertility hospitals near 500034",
    ],
  },
  te: {
    sakhiCompanion: "మీ ప్రయాణంలో తోడుగా..",
    startJourney: "మీ ప్రయాణాన్ని మొదలుపెట్టండి",
    startJourneyDesc:
      "సఖితో మాట్లాడండి, మీకు కావాల్సిన సలహాలు మరియు ఓదార్పు తీసుకోండి.",
    privateSecure: "ప్రైవేట్ మరియు సురక్షితం",
    available247: "ఎప్పుడైనా అందుబాటులో ఉంటుంది",
    partnerSupport: "భాగస్వామి కోసం మద్దతు",
    multiLanguage: "అన్ని భాషల్లో",
    quickStart: "త్వరగా మొదలుపెట్టండి",
    typeMessage: "మీ మాటలు ఇక్కడ రాయండి...",
    logout: "లాగ్ అవుట్",
    contextTitle: "చర్చా విషయం",
    errorConnecting:
      "క్షమించండి, నాకు కనెక్ట్ అవ్వడంలో ఇబ్బందిగా ఉంది. ఒక్కసారి మళ్ళీ ప్రయత్నిస్తారా?",
    prompts: [
      "వయస్సు నిజంగా ప్రెగ్నెన్సీ అవకాశాలను తగ్గిస్తుందా?",
      "ప్రెగ్నెన్సీ సమయంలో ఎలాంటి జాగ్రత్తలు తీసుకోవాలి?",
      "IVF ప్రాసెస్ గురించి వివరంగా చెప్పండి?",
      "500034 దగ్గర మంచి హాస్పిటల్స్ చూపించండి",
    ],
  },
} as const;

const LANG_LABELS: Record<UILang, string> = {
  en: "EN",
  hi: "HI",
  te: "తెలుగు",
};

function getPayloadText(payload?: SakhiResponsePayload): string {
  if (!payload) return "";
  if (payload.text?.body) return payload.text.body;
  if (payload.interactive?.body?.text) return payload.interactive.body.text;
  if (payload.image?.caption) return payload.image.caption;
  return "";
}

export const SakhiTryPage: React.FC<SakhiTryPageProps> = ({
  lang,
  onLangChange,
  initialPrompt,
  onConsumeInitialPrompt,
  onExitToLanding,
}) => {
  const t = I18N[lang] || I18N.en;

  const [selectedProfileId, setSelectedProfileId] = useState<string>(
    PATIENT_PROFILES[0].id
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [quickStartOpen, setQuickStartOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [carePreviewData, setCarePreviewData] =
    useState<CarePreviewData | null>(null);
  const [activeContextLabel, setActiveContextLabel] = useState<string | null>(
    null
  );
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const consumedInitialRef = useRef<string | null>(null);

  const activeProfile =
    PATIENT_PROFILES.find((p) => p.id === selectedProfileId) ||
    PATIENT_PROFILES[0];

  useEffect(() => {
    let mounted = true;
    fetchCarePreview().then((data) => {
      if (mounted && data) setCarePreviewData(data);
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const handleSend = async (
    rawText: string,
    interactiveReply?: { id: string; title: string } | null,
    overrideProfileId?: string
  ) => {
    const trimmed = rawText.trim();
    if (!trimmed || isSending) return;

    const targetProfile =
      (overrideProfileId
        ? PATIENT_PROFILES.find((p) => p.id === overrideProfileId)
        : activeProfile) || activeProfile;

    const nowTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: trimmed,
      timestamp: nowTime,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setQuickStartOpen(false);
    setIsSending(true);

    try {
      const payloads = await sendChatMessage({
        sessionPhone: targetProfile.phone,
        message: trimmed,
        language: lang,
        interactiveReply: interactiveReply || null,
      });

      const replyTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      if (payloads.length === 0) {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now() + 1}`,
            sender: "sakhi",
            text: "I'm here to support you. Please share what is on your mind.",
            timestamp: replyTime,
          },
        ]);
      } else {
        const lastMeta = [...payloads]
          .reverse()
          .find((p) => p.metadata)?.metadata;
        if (lastMeta) {
          const parts = [lastMeta.mode, lastMeta.intent]
            .filter(Boolean)
            .join(" · ");
          if (parts) setActiveContextLabel(parts);
        } else {
          setActiveContextLabel("Compassionate Care & Guidance");
        }

        const botMessages: ChatMessage[] = payloads.map((payload, idx) => ({
          id: `bot-${Date.now() + idx + 1}`,
          sender: "sakhi",
          text: getPayloadText(payload),
          payload,
          timestamp: replyTime,
        }));
        setMessages((prev) => [...prev, ...botMessages]);
      }
    } catch (err) {
      let errorText: string = t.errorConnecting;
      if (err instanceof ApiError) {
        if (err.kind === "timeout") {
          errorText =
            "The response is taking longer than expected. Please try sending your message again.";
        } else if (err.kind === "unauthorized" || err.kind === "forbidden") {
          errorText =
            "Your session could not be verified. Please refresh the page and try again.";
        } else if (err.kind === "server") {
          errorText =
            "Sakhi's care service is temporarily unavailable. Please try again in a moment.";
        } else if (err.kind === "network") {
          errorText = t.errorConnecting;
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "sakhi",
          text: errorText,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (initialPrompt && consumedInitialRef.current !== initialPrompt) {
      consumedInitialRef.current = initialPrompt;
      void handleSend(initialPrompt);
      onConsumeInitialPrompt?.();
    }
  }, [initialPrompt]);

  const handleVoiceInput = () => {
    const SpeechRecognitionAPI =
      (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) return;

    try {
      const recognition = new (SpeechRecognitionAPI as new () => {
        lang: string;
        interimResults: boolean;
        onstart: () => void;
        onend: () => void;
        onresult: (event: {
          results: ArrayLike<ArrayLike<{ transcript: string }>>;
        }) => void;
        start: () => void;
      })();
      recognition.lang =
        lang === "te" ? "te-IN" : lang === "hi" ? "hi-IN" : "en-IN";
      recognition.interimResults = false;
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleResetChat = () => {
    setMessages([]);
    setActiveContextLabel(null);
    setQuickStartOpen(false);
  };

  const handleSwitchProfile = (profileId: string) => {
    setSelectedProfileId(profileId);
    setProfileMenuOpen(false);
    setMessages([]);
    setActiveContextLabel(null);
  };

  const handleTryFromPreview = ({
    profileId,
    question,
  }: {
    profileId: string;
    question: string;
  }) => {
    setPreviewModalOpen(false);
    setProfileMenuOpen(false);
    if (profileId !== selectedProfileId) {
      setSelectedProfileId(profileId);
      setMessages([]);
      setActiveContextLabel(null);
    }
    void handleSend(question, null, profileId);
  };

  const featureCards = [
    {
      icon: Shield,
      title: t.privateSecure,
      bg: "bg-green-100/60",
      iconColor: "text-green-600",
    },
    {
      icon: Clock,
      title: t.available247,
      bg: "bg-blue-100/60",
      iconColor: "text-blue-600",
    },
    {
      icon: Users,
      title: t.partnerSupport,
      bg: "bg-pink-100/60",
      iconColor: "text-pink-600",
    },
    {
      icon: Globe,
      title: t.multiLanguage,
      bg: "bg-orange-100/60",
      iconColor: "text-orange-600",
    },
  ];

  const quickPrompts =
    activeProfile.careType === "Post-Care"
      ? activeProfile.suggestedPrompts
      : t.prompts;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-pink-50 via-teal-50 to-rose-50 overflow-hidden font-sans">
      {/* Top Sticky Header — Exact match to janmasethu.com/sakhi/try */}
      <header className="bg-white/85 backdrop-blur-xl shadow-sm border-b border-gray-200/50 flex-shrink-0 z-50">
        <div className="flex items-center justify-between px-4 sm:px-8 py-2.5">
          {/* Left: Sakhi Heart Logo & Tagline */}
          <button
            type="button"
            onClick={onExitToLanding}
            className="flex items-center gap-3.5 text-left group cursor-pointer"
            title="Back to Sakhi Overview"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-rose-400 rounded-2xl blur-sm opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-gradient-to-br from-pink-400 to-rose-500 p-2.5 rounded-2xl shadow-lg">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-teal-500 bg-clip-text text-transparent leading-none">
                Sakhi
              </h1>
              <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-1.5 leading-none">
                {t.sakhiCompanion}
              </p>
            </div>
          </button>

          {/* Right: Care Data Preview, Patient Session Switcher, Language Selector, Logout */}
          <div className="flex items-center gap-2 sm:gap-3 relative z-[60]">
            {/* Pre-Care & Post-Care Data Preview Button */}
            <button
              type="button"
              onClick={() => {
                setPreviewModalOpen(true);
                setProfileMenuOpen(false);
                setLangMenuOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 h-10 bg-gradient-to-r from-teal-50 to-pink-50 hover:from-teal-100 hover:to-pink-100 text-teal-800 rounded-xl border border-teal-200/70 shadow-sm hover:shadow text-xs font-bold transition-all cursor-pointer"
              title="Preview Pre-Care & Post-Care data and sample questions"
            >
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span className="hidden sm:inline">Care Data Preview</span>
              <span className="sm:hidden">Preview</span>
            </button>

            {/* Patient Session Switcher for WhatsApp Backend Profiles */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setProfileMenuOpen((v) => !v);
                  setLangMenuOpen(false);
                }}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 h-10 bg-white/90 hover:bg-white text-gray-700 rounded-xl border border-gray-200/80 shadow-sm hover:shadow text-xs font-semibold transition-all cursor-pointer"
                title="Switch WhatsApp Backend Patient Session"
              >
                <UserCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span className="max-w-[95px] sm:max-w-[125px] truncate">
                  {activeProfile.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50">
                  <div className="px-3 py-1.5 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      WhatsApp Backend Session
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        setPreviewModalOpen(true);
                      }}
                      className="text-[10px] font-bold text-pink-600 hover:underline cursor-pointer"
                    >
                      View Data Preview
                    </button>
                  </div>
                  {PATIENT_PROFILES.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSwitchProfile(p.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                        p.id === activeProfile.id
                          ? "bg-pink-50 text-pink-700 font-bold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="font-semibold truncate">{p.name}</div>
                        <div className="text-[10px] text-gray-500 truncate">
                          {p.stage}
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          p.careType === "Post-Care"
                            ? "bg-pink-50 text-pink-700 border border-pink-100"
                            : "bg-teal-50 text-teal-700"
                        }`}
                      >
                        {p.careType}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Selector Pill (matches screenshot 🌐 EN) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setLangMenuOpen((v) => !v);
                  setProfileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-4 h-10 bg-white hover:bg-gray-50 text-gray-800 rounded-xl border border-gray-200/80 shadow-sm text-sm font-semibold transition-all cursor-pointer"
              >
                <Globe className="w-4 h-4 text-gray-600" />
                <span>{LANG_LABELS[lang]}</span>
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-xl border border-gray-100 p-1.5 z-50">
                  {(
                    [
                      { code: "en", label: "English (EN)" },
                      { code: "te", label: "తెలుగు (TE)" },
                      { code: "hi", label: "हिन्दी (HI)" },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => {
                        onLangChange(item.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                        lang === item.code
                          ? "bg-pink-50 text-pink-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Logout / Back to Landing Button */}
            <button
              type="button"
              onClick={onExitToLanding}
              className="group flex items-center gap-2 px-4 sm:px-5 h-10 bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 text-gray-700 hover:text-gray-900 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md border border-pink-200/40 hover:border-pink-300/60 cursor-pointer"
            >
              <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <span className="font-medium text-sm">{t.logout}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Conversation Stream */}
      <main className="flex-1 flex flex-col overflow-hidden relative bg-transparent z-10">
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 md:py-10 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-5">
            {/* EMPTY STATE — Exact match to janmasethu.com_sakhi_try_85b518bb.png */}
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-4 md:py-8 text-center space-y-7">
                <div className="space-y-3 max-w-xl mx-auto">
                  <h2 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-pink-600 via-rose-500 to-blue-600 bg-clip-text text-transparent tracking-tight leading-tight">
                    {t.startJourney}
                  </h2>
                  <p className="text-base sm:text-lg text-gray-500 font-medium leading-relaxed">
                    {t.startJourneyDesc}
                  </p>
                </div>

                {/* 2x2 Feature Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl px-2">
                  {featureCards.map((card) => {
                    const Icon = card.icon;
                    return (
                      <div
                        key={card.title}
                        className="flex items-center gap-4 bg-white/85 p-5 rounded-[1.5rem] border border-gray-100/90 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-sm"
                      >
                        <div
                          className={`w-12 h-12 ${card.bg} flex items-center justify-center rounded-2xl shrink-0`}
                        >
                          <Icon className={`w-6 h-6 ${card.iconColor}`} />
                        </div>
                        <span className="font-bold text-gray-800 text-base text-left">
                          {card.title}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* QUICK START Dropdown Accordion */}
                <div className="w-full max-w-2xl px-2 space-y-3.5 pt-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {t.quickStart}
                  </p>

                  <button
                    type="button"
                    onClick={() => setQuickStartOpen((v) => !v)}
                    className="w-full flex items-center justify-between px-6 py-4 bg-white/95 border border-pink-200 hover:border-pink-300 rounded-2xl shadow-[0_10px_28px_rgba(236,72,153,0.08)] text-gray-800 font-bold transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-pink-500" />
                      <span>{t.quickStart}</span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${
                        quickStartOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {quickStartOpen && (
                    <div className="bg-white/95 border border-pink-100 rounded-2xl shadow-xl p-2 space-y-1 text-left">
                      {quickPrompts.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => void handleSend(prompt)}
                          className="w-full text-left px-4 py-3 hover:bg-pink-50 rounded-xl text-sm font-semibold text-gray-700 hover:text-pink-700 transition-colors cursor-pointer"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Clear Pre-Care & Post-Care Data Preview Callout */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setPreviewModalOpen(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/85 hover:bg-white border border-teal-200/80 hover:border-pink-300 text-xs sm:text-sm font-semibold text-gray-700 hover:text-pink-700 shadow-sm hover:shadow transition-all cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4 text-teal-600" />
                      <span>
                        See Predefined Pre-Care &amp; Post-Care Data + Sample
                        Questions
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ACTIVE CONVERSATION CONTEXT STRIP */}
            {messages.length > 0 && activeContextLabel && (
              <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-teal-50/90 to-blue-50/90 px-5 py-3 rounded-2xl border border-teal-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <img
                    src="/sakhi-icon.svg"
                    alt="Sakhi"
                    className="w-7 h-7 object-contain"
                  />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-teal-600 tracking-widest">
                      {t.contextTitle}
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-gray-800">
                      {activeContextLabel}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleResetChat}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-xs font-semibold text-gray-600 border border-gray-200/70 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  New Chat
                </button>
              </div>
            )}

            {/* MESSAGE THREAD */}
            {messages.map((msg) => {
              const isUser = msg.sender === "user";
              const interactive = msg.payload?.interactive;
              const image = msg.payload?.image;
              const mode = msg.payload?.metadata?.mode;
              const isEmergency = mode === "emergency" || mode === "escalation";
              const isDoctorEscalation = mode === "doctor_escalation";

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col gap-3 ${
                    isUser ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`flex gap-3.5 items-end max-w-full ${
                      isUser ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {/* Avatar */}
                    <div className="shrink-0 relative">
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${
                          isUser
                            ? "from-blue-400 to-cyan-400"
                            : isEmergency
                            ? "from-rose-500 to-red-500"
                            : isDoctorEscalation
                            ? "from-teal-400 to-indigo-400"
                            : "from-pink-400 to-rose-400"
                        } rounded-2xl blur-md opacity-30`}
                      />
                      <div
                        className={`relative w-11 h-11 bg-white rounded-2xl flex items-center justify-center shadow-lg border ${
                          isEmergency
                            ? "border-rose-200"
                            : isDoctorEscalation
                            ? "border-teal-200"
                            : "border-pink-100"
                        }`}
                      >
                        {isUser ? (
                          <span className="text-sm font-bold text-blue-600">
                            {activeProfile.name[0]}
                          </span>
                        ) : isEmergency ? (
                          <AlertTriangle className="w-5 h-5 text-rose-600" />
                        ) : isDoctorEscalation ? (
                          <Stethoscope className="w-5 h-5 text-teal-600" />
                        ) : (
                          <img
                            src="/sakhi-icon.svg"
                            alt="Sakhi"
                            className="w-7 h-7 object-contain"
                          />
                        )}
                      </div>
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`max-w-[84%] sm:max-w-2xl rounded-[1.5rem] p-4 shadow-xl border ${
                        isUser
                          ? "bg-gradient-to-br from-blue-600 to-cyan-600 border-blue-500 text-white"
                          : isEmergency
                          ? "bg-rose-50/90 border-rose-200 text-gray-900"
                          : isDoctorEscalation
                          ? "bg-teal-50/75 border-teal-200 text-gray-900"
                          : "bg-white border-gray-100 text-gray-800"
                      }`}
                    >
                      {!isUser && isEmergency && (
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-700 pb-2.5 mb-2.5 border-b border-rose-200/80">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>Urgent Care · Contact Caretaker Staff</span>
                        </div>
                      )}

                      {!isUser && isDoctorEscalation && (
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 pb-2.5 mb-2.5 border-b border-teal-200/80">
                          <Stethoscope className="w-4 h-4 shrink-0" />
                          <span>Verified Doctor Escalation · Update Pending</span>
                        </div>
                      )}

                      {interactive?.header?.text && (
                        <p className="text-xs font-bold uppercase tracking-wider text-teal-600 mb-1.5">
                          {interactive.header.text}
                        </p>
                      )}

                      {image?.link && (
                        <div className="mb-3 rounded-2xl overflow-hidden border border-gray-100">
                          <img
                            src={image.link}
                            alt={image.caption || "Sakhi resource"}
                            className="w-full h-auto object-cover"
                          />
                        </div>
                      )}

                      {msg.text && (
                        <FormattedMessage
                          text={msg.text}
                          className="text-sm sm:text-base font-medium"
                        />
                      )}

                      {/* WhatsApp Interactive Reply Buttons */}
                      {interactive?.type === "button" &&
                        interactive.action.buttons && (
                          <div className="mt-3.5 flex flex-wrap gap-2">
                            {interactive.action.buttons.map((btn) => (
                              <button
                                key={btn.reply.id}
                                type="button"
                                disabled={isSending}
                                onClick={() =>
                                  void handleSend(btn.reply.title, {
                                    id: btn.reply.id,
                                    title: btn.reply.title,
                                  })
                                }
                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-50 to-pink-50 hover:from-teal-100 hover:to-pink-100 border border-teal-200/70 text-xs font-bold text-gray-800 transition-all cursor-pointer"
                              >
                                {btn.reply.title}
                              </button>
                            ))}
                          </div>
                        )}

                      {/* WhatsApp Interactive List Rows (e.g., Nearby Hospitals) */}
                      {interactive?.type === "list" &&
                        interactive.action.sections && (
                          <div className="mt-3.5 space-y-2">
                            {interactive.action.sections.map((section, sIdx) => (
                              <div key={sIdx} className="space-y-2">
                                {section.title && (
                                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                    {section.title}
                                  </p>
                                )}
                                {section.rows.map((row) => (
                                  <button
                                    key={row.id}
                                    type="button"
                                    disabled={isSending}
                                    onClick={() =>
                                      void handleSend(row.title, {
                                        id: row.id,
                                        title: row.title,
                                      })
                                    }
                                    className="w-full text-left p-3 rounded-2xl bg-gradient-to-r from-teal-50/70 to-pink-50/40 hover:from-teal-50 hover:to-pink-50 border border-teal-100 transition-all cursor-pointer"
                                  >
                                    <div className="flex items-start gap-2">
                                      <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                                      <div>
                                        <div className="text-sm font-bold text-gray-900">
                                          {row.title}
                                        </div>
                                        {row.description && (
                                          <div className="text-xs text-gray-600 mt-0.5">
                                            {row.description}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            ))}
                          </div>
                        )}

                      {interactive?.footer?.text && (
                        <p className="mt-2.5 text-[11px] text-gray-400 font-medium">
                          {interactive.footer.text}
                        </p>
                      )}

                      <p
                        className={`text-[10px] mt-2.5 flex items-center gap-1.5 font-bold uppercase tracking-wider ${
                          isUser ? "text-white/90" : "text-gray-400"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isUser ? "bg-white" : "bg-pink-400"
                          }`}
                        />
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator — 3 bouncing pink dots */}
            {isSending && (
              <div className="flex items-end gap-3.5">
                <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-pink-100">
                  <img
                    src="/sakhi-icon.svg"
                    alt="Sakhi"
                    className="w-7 h-7 object-contain"
                  />
                </div>
                <div className="bg-white border border-gray-100 rounded-[1.5rem] px-5 py-4 shadow-lg flex gap-2 items-center">
                  <span
                    className="w-2.5 h-2.5 bg-pink-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-2.5 h-2.5 bg-pink-400 rounded-full animate-bounce"
                    style={{ animationDelay: "180ms" }}
                  />
                  <span
                    className="w-2.5 h-2.5 bg-pink-400 rounded-full animate-bounce"
                    style={{ animationDelay: "360ms" }}
                  />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Bottom Floating Message Composer — Exact match to screenshot */}
        <div className="border-t border-gray-200/40 bg-white/80 backdrop-blur-2xl px-4 py-3.5 md:py-4 flex-shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSend(input);
            }}
            className="max-w-4xl mx-auto flex gap-3.5 sm:gap-4 items-center"
          >
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.typeMessage}
                disabled={isSending}
                className="w-full pl-6 pr-14 py-4 rounded-2xl bg-white border border-gray-200 focus:outline-none focus:ring-4 focus:ring-pink-400/20 focus:border-pink-300 text-gray-800 placeholder-gray-400 shadow-[0_8px_28px_rgba(15,23,42,0.08)] focus:shadow-xl transition-all duration-300 text-base font-medium"
              />
              <button
                type="button"
                onClick={handleVoiceInput}
                title="Voice Input"
                className={`absolute right-5 top-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110 active:scale-90 cursor-pointer ${
                  isListening
                    ? "text-pink-600 animate-pulse"
                    : "text-gray-400 hover:text-pink-500"
                }`}
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>

            <button
              type="submit"
              disabled={!input.trim() || isSending}
              aria-label="Send message"
              className="bg-gradient-to-br from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:from-gray-200 disabled:to-gray-200 text-white p-4 sm:p-5 rounded-[1.5rem] transition-all duration-300 shadow-xl hover:shadow-2xl disabled:cursor-not-allowed hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
            >
              <Send className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </form>
        </div>
      </main>

      <CareDataPreviewModal
        open={previewModalOpen}
        data={carePreviewData}
        onClose={() => setPreviewModalOpen(false)}
        onTryQuestion={handleTryFromPreview}
      />
    </div>
  );
};
