import React, { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  HeartPulse,
  Sparkles,
  Stethoscope,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import type { CarePreviewData } from "../types/sakhi";
import { SAMPLE_CARE_DATA } from "../data/sampleCareData";

interface CareDataPreviewModalProps {
  open: boolean;
  data: CarePreviewData | null;
  onClose: () => void;
  onTryQuestion: (params: { profileId: string; question: string }) => void;
}

type ModalTab = "pre_care" | "post_care";

export const CareDataPreviewModal: React.FC<CareDataPreviewModalProps> = ({
  open,
  data,
  onClose,
  onTryQuestion,
}) => {
  const [activeTab, setActiveTab] = useState<ModalTab>("pre_care");
  const [selectedPatientIndex, setSelectedPatientIndex] = useState(0);

  if (!open) return null;

  // Use live data if available; fallback immediately to local sample data
  const currentData: CarePreviewData = data || SAMPLE_CARE_DATA;
  const patients = currentData.post_care?.patients || [];
  const activePatient = patients[selectedPatientIndex] || patients[0];
  const preCareTopics = currentData.pre_care?.topics || [];

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
              Sample Care Data &amp; Live Try Guide
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-serif">
              What Sakhi Knows — Sample Care Data &amp; Live Preview
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Explore sample verified care knowledge and clinical scenarios.
              This sample data applies across all predefined patient profiles
              (Pre-Care &amp; Post-Care) and new visitors too, so you can preview
              how Sakhi replies and click any question to try it live.
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
            Pre-Care Guidelines ({preCareTopics.length})
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
            Post-Care Scenarios ({patients.length})
          </button>

          <div className="ml-auto hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200/60">
            <Users className="w-3.5 h-3.5 text-pink-500" />
            <span>Applies to all profiles &amp; new visitors</span>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-5 custom-scrollbar bg-[#FAFBFF]">
          {activeTab === "pre_care" ? (
            <div className="space-y-5">
              {/* Pre-Care Overview Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-teal-50 to-pink-50/70 border border-teal-100">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900">
                    {currentData.pre_care.title}
                  </h3>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white text-teal-700 border border-teal-200">
                    Applies to: Pre-Care Profiles &amp; New Visitors
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {currentData.pre_care.how_it_works}
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
                          profileId:
                            currentData.pre_care.default_profile?.id ||
                            "venkatesh",
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
          ) : (
            <div className="space-y-5">
              {/* Post-Care Overview Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50/70 border border-pink-100">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900">
                    {currentData.post_care.title}
                  </h3>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white text-pink-700 border border-pink-200">
                    Applies to: Active Clinical Profiles
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {currentData.post_care.how_it_works}
                </p>
              </div>

              {/* Patient Selector Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {patients.map((pat, idx) => (
                  <button
                    key={pat.id}
                    type="button"
                    onClick={() => setSelectedPatientIndex(idx)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      selectedPatientIndex === idx
                        ? "bg-white border-pink-400 text-pink-700 shadow-sm ring-2 ring-pink-100"
                        : "bg-white/80 border-gray-200/80 text-gray-600 hover:bg-white hover:border-gray-300"
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{pat.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-pink-50 text-pink-600 font-normal">
                      {pat.department}
                    </span>
                  </button>
                ))}
              </div>

              {/* Active Selected Patient Card */}
              {activePatient && (
                <div className="p-5 sm:p-6 bg-white rounded-2xl border border-pink-100 shadow-sm space-y-5">
                  {/* Patient Info Row */}
                  <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-gray-100">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-teal-700 uppercase tracking-wider mb-1">
                        <Stethoscope className="w-3.5 h-3.5" />
                        {activePatient.department} · {activePatient.treatment_stage}
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 font-serif">
                        {activePatient.name}{" "}
                        <span className="text-xs font-mono font-normal text-gray-400">
                          ({activePatient.uhid})
                        </span>
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {activePatient.doctor} · {activePatient.clinic}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="inline-block text-[11px] font-bold px-3 py-1 rounded-full bg-pink-50 text-pink-700 border border-pink-200">
                        {activePatient.care_type}
                      </span>
                      <p className="text-[11px] text-gray-400 font-mono mt-1">
                        Phone: {activePatient.phone}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-600">
                    {activePatient.summary}
                  </p>

                  {/* Sample Questions & Expected Behaviors */}
                  <div className="space-y-3 pt-1">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      Sample Scenarios &amp; Zero-Trust Expected Behaviors
                    </h5>

                    {activePatient.sample_questions.map((sq, qIdx) => (
                      <div
                        key={qIdx}
                        className={`p-4 rounded-xl border transition-all ${
                          sq.is_emergency
                            ? "bg-rose-50/50 border-rose-200 hover:border-rose-300"
                            : "bg-gray-50/70 border-gray-200/80 hover:border-pink-200"
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              sq.is_emergency
                                ? "bg-rose-100 text-rose-700"
                                : "bg-white text-gray-700 border border-gray-200"
                            }`}
                          >
                            {sq.is_emergency && (
                              <AlertTriangle className="w-3 h-3 text-rose-600" />
                            )}
                            {sq.label}
                          </span>
                        </div>

                        <div className="space-y-1.5 mb-3">
                          <p className="text-xs sm:text-sm font-semibold text-gray-900">
                            &ldquo;{sq.question}&rdquo;
                          </p>
                          <div className="p-2.5 rounded-lg bg-white border border-gray-100 space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
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
          )}
        </div>
      </div>
    </div>
  );
};
