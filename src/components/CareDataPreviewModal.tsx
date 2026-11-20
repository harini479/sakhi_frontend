import React, { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Check,
  Code2,
  Copy,
  HeartPulse,
  Sparkles,
  Stethoscope,
  UserCheck,
  X,
} from "lucide-react";
import type { CarePreviewData } from "../types/sakhi";

interface CareDataPreviewModalProps {
  open: boolean;
  data: CarePreviewData | null;
  onClose: () => void;
  onTryQuestion: (params: { profileId: string; question: string }) => void;
}

type ModalTab = "pre_care" | "post_care" | "json";

export const CareDataPreviewModal: React.FC<CareDataPreviewModalProps> = ({
  open,
  data,
  onClose,
  onTryQuestion,
}) => {
  const [activeTab, setActiveTab] = useState<ModalTab>("pre_care");
  const [selectedPatientIndex, setSelectedPatientIndex] = useState(0);
  const [copiedJson, setCopiedJson] = useState(false);

  if (!open) return null;

  const patients = data?.post_care?.patients || [];
  const activePatient = patients[selectedPatientIndex] || patients[0];
  const preCareTopics = data?.pre_care?.topics || [];

  const handleCopyJson = async () => {
    if (!data) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 1800);
    } catch {
      // Clipboard unavailable in iframe; ignore silently
    }
  };

  return (
    <div
      className="fixed inset-0 z-[120] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[88vh] bg-white rounded-[2rem] shadow-2xl border border-pink-100 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 sm:px-8 py-5 bg-gradient-to-r from-pink-50 via-white to-teal-50 border-b border-gray-100 flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-pink-600 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Predefined Care Data &amp; Live Try Guide
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-serif">
              What Sakhi Knows — Pre-Care &amp; Post-Care Preview
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              See the predefined data loaded for Pre-Care and registered
              Post-Care patients, preview how Sakhi replies, and click any
              question to try it live.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Care Data Preview"
            className="p-2 rounded-full bg-white hover:bg-pink-50 text-gray-500 hover:text-gray-800 border border-gray-200/80 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="px-6 sm:px-8 pt-4 pb-3 border-b border-gray-100 flex flex-wrap items-center gap-2 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab("pre_care")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "pre_care"
                ? "bg-gradient-to-r from-primary to-[#EC4899] text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200/80"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Pre-Care Data ({preCareTopics.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("post_care")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "post_care"
                ? "bg-gradient-to-r from-primary to-[#EC4899] text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200/80"
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            Post-Care Patients ({patients.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("json")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ml-auto cursor-pointer ${
              activeTab === "json"
                ? "bg-gray-900 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200/80"
            }`}
          >
            <Code2 className="w-4 h-4" />
            Predefined JSON
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-5 custom-scrollbar bg-[#FAFBFF]">
          {!data ? (
            <div className="py-12 text-center text-sm text-gray-500">
              Loading predefined care preview data...
            </div>
          ) : activeTab === "pre_care" ? (
            <div className="space-y-5">
              {/* Pre-Care Overview Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-teal-50 to-pink-50/70 border border-teal-100">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900">
                    {data.pre_care.title}
                  </h3>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white text-teal-700 border border-teal-200">
                    Default Profile: {data.pre_care.default_profile.name} (Pre-Care)
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {data.pre_care.how_it_works}
                </p>
              </div>

              {/* Pre-Care Topic Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {preCareTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-pink-200 transition-all flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700">
                          {topic.category}
                        </span>
                        <span className="text-[10px] font-semibold text-pink-600">
                          {topic.expected_behavior}
                        </span>
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-gray-900">
                        {topic.title}
                      </h4>

                      <div className="p-3 rounded-xl bg-pink-50/60 border border-pink-100">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-pink-600 mb-0.5">
                          Ask like this
                        </p>
                        <p className="text-xs sm:text-sm font-semibold text-gray-800">
                          &ldquo;{topic.sample_question}&rdquo;
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                          Expected Answer Preview
                        </p>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {topic.answer_preview}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        onTryQuestion({
                          profileId: data.pre_care.default_profile.id,
                          question: topic.sample_question,
                        })
                      }
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-primary to-[#EC4899] text-white text-xs font-bold shadow-sm hover:shadow-md hover:opacity-95 transition-all cursor-pointer"
                    >
                      Try This Question Live
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === "post_care" ? (
            <div className="space-y-5">
              {/* Post-Care Overview Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50/70 border border-pink-100">
                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
                  {data.post_care.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {data.post_care.how_it_works}
                </p>
              </div>

              {/* Named Post-Care Patient Selector Pills */}
              <div className="flex flex-wrap gap-2">
                {patients.map((patient, idx) => {
                  const selected = idx === selectedPatientIndex;
                  return (
                    <button
                      key={patient.id}
                      type="button"
                      onClick={() => setSelectedPatientIndex(idx)}
                      className={`px-4 py-2.5 rounded-2xl text-left border transition-all cursor-pointer ${
                        selected
                          ? "bg-white border-pink-400 shadow-md ring-2 ring-pink-200/70"
                          : "bg-white/75 border-gray-200 hover:border-pink-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-[#EC4899] text-white text-xs font-bold flex items-center justify-center">
                          {patient.name[0]}
                        </span>
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-gray-900">
                            {patient.name}
                          </div>
                          <div className="text-[10px] font-semibold text-teal-700">
                            {patient.treatment_stage}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Post-Care Patient Details + Sample Questions */}
              {activePatient && (
                <div className="space-y-4">
                  <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white font-bold flex items-center justify-center shadow">
                          <UserCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-base sm:text-lg font-bold text-gray-900">
                            {activePatient.name}
                          </h4>
                          <p className="text-xs text-gray-500 font-medium">
                            {activePatient.department} ·{" "}
                            <span className="text-teal-700 font-bold">
                              {activePatient.treatment_stage}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 text-[11px]">
                        <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 font-semibold">
                          UHID: {activePatient.uhid}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 font-semibold">
                          <Stethoscope className="w-3 h-3" />
                          {activePatient.doctor}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-600">
                      {activePatient.summary}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activePatient.sample_questions.map((sq) => (
                      <div
                        key={sq.question}
                        className={`p-5 bg-white rounded-2xl border shadow-sm flex flex-col justify-between gap-4 ${
                          sq.is_emergency
                            ? "border-rose-200 bg-rose-50/20"
                            : "border-gray-100 hover:border-pink-200"
                        }`}
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                                sq.is_emergency
                                  ? "bg-rose-100 text-rose-700"
                                  : "bg-teal-50 text-teal-700"
                              }`}
                            >
                              {sq.is_emergency && (
                                <AlertTriangle className="w-3 h-3" />
                              )}
                              {sq.label}
                            </span>
                          </div>

                          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-pink-600 mb-0.5">
                              Ask like this
                            </p>
                            <p className="text-xs sm:text-sm font-semibold text-gray-900">
                              &ldquo;{sq.question}&rdquo;
                            </p>
                          </div>

                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                              Expected Behavior: {sq.expected_behavior}
                            </p>
                            <p className="text-xs text-gray-600 leading-relaxed">
                              {sq.sample_reply_preview}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            onTryQuestion({
                              profileId: activePatient.id,
                              question: sq.question,
                            })
                          }
                          className={`w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-white text-xs font-bold shadow-sm hover:shadow-md transition-all cursor-pointer ${
                            sq.is_emergency
                              ? "bg-gradient-to-r from-rose-500 to-pink-600"
                              : "bg-gradient-to-r from-primary to-[#EC4899]"
                          }`}
                        >
                          Chat as {activePatient.name.split(" ")[0]}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-gray-600 font-medium">
                  Predefined dataset served live from{" "}
                  <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800">
                    /api/care-preview
                  </code>
                </p>
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200 hover:border-pink-300 text-xs font-bold text-gray-700 shadow-sm cursor-pointer"
                >
                  {copiedJson ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy JSON
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-slate-900 text-teal-200 text-xs overflow-x-auto leading-relaxed max-h-[55vh] custom-scrollbar">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
