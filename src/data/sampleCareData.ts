import { CarePreviewData } from "../types/sakhi";

export const SAMPLE_CARE_DATA: CarePreviewData = {
  version: "1.0",
  description:
    "Sample Pre-Care knowledge base and Post-Care clinic patient profiles for trying Sakhi without an external database. Applies across all predefined patient profiles and new visitors.",
  pre_care: {
    title: "Sample Pre-Care Knowledge & Guidelines",
    summary:
      "Universal sample guidance available for anyone exploring fertility options, pregnancy preparation, diet, emotional support, or searching nearby fertility clinics by pincode.",
    how_it_works:
      "Ask in English, Telugu (తెలుగు), Hindi (हिन्दी), or Tinglish. Sakhi answers directly from verified fertility and pregnancy knowledge, supports emotional wellbeing, and finds nearby hospitals when you share a 6-digit pincode. Applies to Pre-Care profiles (like Venkatesh) and new visitors alike.",
    default_profile: {
      id: "venkatesh",
      name: "Venkatesh",
      phone: "+911111111111",
      stage: "Pre-Care · General Inquiry",
      care_type: "Pre-Care",
    },
    topics: [
      {
        id: "pc-stomach-ache",
        category: "General Health Triage",
        title: "Stomach Ache & Abdominal Pain Check",
        sample_question: "I have a stomach ache today",
        expected_behavior: "1-Question Severity Gate",
        answer_preview:
          "Asks where the pain is located and its severity. Reassures for mild discomfort; immediately escalates to medical team if pain is severe, rigid, or paired with high fever.",
      },
      {
        id: "pc-headache",
        category: "General Health Triage",
        title: "Headache & Migraine Screening",
        sample_question: "I have a bad headache",
        expected_behavior: "Onset & Severity Check",
        answer_preview:
          "Checks whether onset was sudden or gradual, and whether vision or neurological symptoms are present. Shares quiet rest and hydration for mild tension; immediately escalates severe onset.",
      },
      {
        id: "pc-ivf-overview",
        category: "Fertility Treatments",
        title: "What is IVF & Step-by-Step Journey",
        sample_question: "What is IVF and what are its main stages?",
        expected_behavior: "Knowledge + AI Explanation",
        answer_preview:
          "Explains all 5 IVF stages clearly—ovarian stimulation (8–12 days), trigger shot & egg retrieval, lab fertilization/culture, painless embryo transfer, and the 12–14 day two-week wait—plus common medical reasons IVF is recommended.",
      },
      {
        id: "pc-iui-overview",
        category: "Fertility Treatments",
        title: "What is IUI & Typical Success Rates",
        sample_question: "What is IUI and what is its typical success rate?",
        expected_behavior: "Knowledge + AI Explanation",
        answer_preview:
          "Explains Intrauterine Insemination (washed sperm placed directly in the uterus at ovulation, 5–10 min procedure) and typical 10–20% per-cycle success rates for women under 35 over 3–4 cycles.",
      },
      {
        id: "pc-age-fertility",
        category: "Fertility Planning",
        title: "How Age Affects Fertility & Ovarian Reserve",
        sample_question: "Does age really affect our chances of conceiving?",
        expected_behavior: "Empathetic Medical Guidance",
        answer_preview:
          "Explains natural egg reserve changes after 32–35, reassures couples about options in their mid-30s/40s, and recommends AMH blood test and AFC scan to assess your personal timeline.",
      },
      {
        id: "pc-egg-quality",
        category: "Diet & Nutrition",
        title: "Indian Foods & Habits for Egg Quality",
        sample_question: "What natural foods can help improve egg quality?",
        expected_behavior: "Culturally-Aware Nutrition",
        answer_preview:
          "Shares practical 90-day egg-maturation nutrition: antioxidants (amla, pomegranate, spinach), healthy fats (walnuts, flaxseeds), plant/lean proteins (dal, paneer, eggs), folate, Vitamin D, and caffeine limits.",
      },
      {
        id: "pc-preg-routine",
        category: "Pregnancy Care",
        title: "Healthy Daily Routines During Pregnancy",
        sample_question: "Healthy routines during pregnancy",
        expected_behavior: "Trimester Wellness Guide",
        answer_preview:
          "Covers small frequent protein/iron-rich meals, folic acid & prenatal vitamins, 8–10 glasses hydration, left-side rest, gentle walking/prenatal yoga, and scheduled scans.",
      },
      {
        id: "pc-emotional-tww",
        category: "Emotional Support",
        title: "Two-Week Wait & Family Pressure Support",
        sample_question: "I feel anxious during the two-week wait. How do I stay calm?",
        expected_behavior: "Compassionate Support",
        answer_preview:
          "Validates waiting anxiety, explains why progesterone mimics symptoms, offers 4-4-6 grounding breathwork, and suggests kind boundaries around family questions.",
      },
      {
        id: "pc-hospitals",
        category: "Hospital Discovery",
        title: "Find Fertility & Maternity Hospitals by Pincode",
        sample_question: "Find fertility hospitals near 500034",
        expected_behavior: "Interactive Hospital List",
        answer_preview:
          "Returns an interactive list of fertility & maternity clinics near pincode 500034 (Banjara Hills / Hyderabad). Tap any hospital card to view phone, address, and Google Maps link.",
      },
      {
        id: "pc-telugu",
        category: "Multilingual Care",
        title: "Ask in Telugu, Hindi, or Tinglish",
        sample_question: "IVF అంటే ఏమిటి? తెలుగులో వివరించండి",
        expected_behavior: "Native Telugu Reply",
        answer_preview:
          "Detects Telugu script automatically and replies warmly in natural Telugu explaining the IVF process step by step.",
      },
    ],
  },
  post_care: {
    title: "Sample Post-Care Clinical Guidelines & Patient Scenarios",
    summary:
      "Active clinic patient scenarios linked to specific departments and treatment stages. Demonstrates zero-trust clinical rules: 1-question symptom triage, immediate emergency escalation, and strict treatment-stage safety.",
    how_it_works:
      "Switch to any named Post-Care profile or test clinical scenarios. Sakhi checks their active treatment stage, asks 1 clarifying triage question for mild symptoms, escalates red flags immediately, and keeps guidance strictly scoped to their treatment.",
    patients: [
      {
        id: "ananya-reddy",
        name: "Ananya Reddy",
        phone: "+918888888882",
        uhid: "TEST-IVF-02",
        department: "Fertility",
        treatment_stage: "IVF Stimulation Phase",
        doctor: "Dr. Sample Gynecologist",
        clinic: "Sakhi Fertility & Wellness Clinic, Hyderabad",
        care_type: "Post-Care",
        summary:
          "Undergoing daily IVF stimulation injections prior to trigger shot and egg retrieval.",
        sample_questions: [
          {
            label: "Symptom Triage (1-Question Gate)",
            question: "I have bloating after my stimulation injections",
            expected_behavior: "Asks 1 OHSS screening question",
            sample_reply_preview:
              "Asks whether you have shortness of breath, severe pain, nausea, or rapid weight gain (>2 lbs/day). Reply 'No, just mild bloating' for safe hydration guidance, or 'Yes, severe pain' to trigger clinic escalation.",
            is_emergency: false,
          },
          {
            label: "Immediate Red-Flag Escalation",
            question: "I missed my stimulation injection dose today",
            expected_behavior: "Immediate Clinic Escalation",
            sample_reply_preview:
              "Flags missed stimulation dosage as urgent and immediately alerts the clinic nursing team so they can advise on dosage timing.",
            is_emergency: true,
          },
          {
            label: "Treatment Education",
            question: "What is the trigger shot before egg retrieval?",
            expected_behavior: "Stage-Specific Education",
            sample_reply_preview:
              "Explains hCG/Lupron trigger shot taken precisely 36 hours before egg retrieval to mature the eggs.",
          },
          {
            label: "Zero-Trust Stage Guardrail",
            question: "What is the success rate of IUI?",
            expected_behavior: "Treatment Scope Protection",
            sample_reply_preview:
              "Politely keeps guidance strictly within Ananya's active IVF Stimulation Phase rather than mixing advice from unrelated treatments.",
          },
        ],
      },
      {
        id: "priya-sharma",
        name: "Priya Sharma",
        phone: "+918888888883",
        uhid: "TEST-IUI-02",
        department: "Fertility",
        treatment_stage: "IUI Cycle",
        doctor: "Dr. Sample Gynecologist",
        clinic: "Sakhi Fertility & Wellness Clinic, Hyderabad",
        care_type: "Post-Care",
        summary:
          "Post-IUI procedure care with mild cramping and spotting monitoring.",
        sample_questions: [
          {
            label: "Symptom Triage (Cramping)",
            question: "I have mild cramping after my IUI procedure",
            expected_behavior: "Asks 1 Clarifying Question",
            sample_reply_preview:
              "Checks for severe pain, heavy bleeding, or fever >100.4°F before reassuring that mild cramping for 1–2 days after IUI is normal.",
            is_emergency: false,
          },
          {
            label: "Symptom Triage (Spotting)",
            question: "I noticed light spotting after IUI",
            expected_behavior: "Asks 1 Bleeding Check",
            sample_reply_preview:
              "Checks whether bleeding is soaking a pad in an hour or paired with sharp pelvic pain; otherwise reassures light pink/brown spotting is normal after catheter insertion.",
            is_emergency: false,
          },
          {
            label: "Cycle Expectations",
            question: "What is the typical success rate of IUI?",
            expected_behavior: "Stage-Specific Education",
            sample_reply_preview:
              "Shares realistic IUI expectations (10–20% per cycle for women under 35, often 3–4 cycles).",
          },
        ],
      },
      {
        id: "kavya-nair",
        name: "Kavya Nair",
        phone: "+918888888884",
        uhid: "TEST-OBS-01",
        department: "Obstetrics",
        treatment_stage: "First Trimester",
        doctor: "Dr. Sample Gynecologist",
        clinic: "Sakhi Fertility & Wellness Clinic, Hyderabad",
        care_type: "Post-Care",
        summary:
          "First-trimester prenatal care with nausea/hydration screening and diet guidance.",
        sample_questions: [
          {
            label: "Morning Sickness Triage",
            question: "I have morning sickness and nausea today",
            expected_behavior: "Dehydration Screening",
            sample_reply_preview:
              "Checks if unable to keep fluids down >12 hours, dizzy, or dark urine before sharing dry crackers, ginger, B6, and small-sip hydration advice.",
            is_emergency: false,
          },
          {
            label: "Cramping Safety Check",
            question: "I have mild lower abdominal cramping",
            expected_behavior: "Ectopic / Bleeding Screen",
            sample_reply_preview:
              "Screens for severe one-sided pain or vaginal bleeding before explaining normal uterine expansion.",
            is_emergency: false,
          },
          {
            label: "First Trimester Diet",
            question: "What diet should I follow in the first trimester?",
            expected_behavior: "Prenatal Nutrition",
            sample_reply_preview:
              "Highlights folic acid/prenatal vitamins, avoiding raw meats/unpasteurized dairy/high-mercury fish, and limiting caffeine under 200 mg/day.",
          },
        ],
      },
      {
        id: "rohan-verma",
        name: "Rohan Verma",
        phone: "+918888888881",
        uhid: "TEST-GEN-02",
        department: "General Medicine",
        treatment_stage: "Initial Assessment",
        doctor: "Dr. Sample Physician",
        clinic: "Sakhi Fertility & Wellness Clinic, Hyderabad",
        care_type: "Post-Care",
        summary:
          "General Medicine follow-up demonstrating fever triage and instant chest-pain emergency escalation.",
        sample_questions: [
          {
            label: "Fever Triage",
            question: "I have a fever since yesterday",
            expected_behavior: "Temperature & Duration Check",
            sample_reply_preview:
              "Asks highest recorded temperature and duration; escalates if >=103°F/confusion/>72 hrs, otherwise shares hydration & rest advice.",
            is_emergency: false,
          },
          {
            label: "Immediate Emergency Alert",
            question: "I am having chest pain",
            expected_behavior: "Instant Emergency Escalation",
            sample_reply_preview:
              "Triggers immediate emergency escalation advising prompt doctor/hospital evaluation right away.",
            is_emergency: true,
          },
          {
            label: "Headache Screening",
            question: "I have a headache today",
            expected_behavior: "Onset & Severity Check",
            sample_reply_preview:
              "Checks sudden vs gradual onset and severity before sharing hydration and quiet rest advice.",
            is_emergency: false,
          },
        ],
      },
    ],
  },
};
