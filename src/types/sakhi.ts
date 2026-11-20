export interface InteractiveButton {
  type?: string;
  reply: {
    id: string;
    title: string;
  };
}

export interface InteractiveListRow {
  id: string;
  title: string;
  description?: string;
}

export interface InteractiveListSection {
  title?: string;
  rows: InteractiveListRow[];
}

export interface SakhiResponsePayload {
  type: "text" | "image" | "interactive";
  text?: {
    body: string;
    preview_url?: boolean;
  };
  image?: {
    link: string;
    caption?: string;
  };
  interactive?: {
    type: "button" | "list";
    header?: { type?: string; text?: string };
    body?: { text?: string };
    footer?: { text?: string };
    action: {
      button?: string;
      buttons?: InteractiveButton[];
      sections?: InteractiveListSection[];
    };
  };
  metadata?: {
    mode?: string;
    intent?: string;
    route?: string;
    language?: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: "user" | "sakhi";
  timestamp: string;
  text?: string;
  payload?: SakhiResponsePayload;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  sub_category?: string;
  language: string;
  infographic_url?: string | null;
  youtube_link?: string | null;
}

export interface PatientProfileOption {
  id: string;
  phone: string;
  name: string;
  stage: string;
  careType: "Guest" | "Pre-Care" | "Post-Care";
  language: "en" | "te" | "tinglish";
  description: string;
  suggestedPrompts: string[];
}

export interface LaunchChatOptions {
  profilePhone?: string;
  initialPrompt?: string;
  language?: "en" | "te" | "tinglish";
}

export interface PreCareTopicPreview {
  id: string;
  category: string;
  title: string;
  sample_question: string;
  expected_behavior: string;
  answer_preview: string;
}

export interface PostCareSampleQuestion {
  label: string;
  question: string;
  expected_behavior: string;
  sample_reply_preview: string;
  is_emergency?: boolean;
}

export interface PostCarePatientPreview {
  id: string;
  name: string;
  phone: string;
  uhid: string;
  department: string;
  treatment_stage: string;
  doctor: string;
  clinic: string;
  care_type: string;
  summary: string;
  sample_questions: PostCareSampleQuestion[];
}

export interface CarePreviewData {
  version: string;
  description: string;
  pre_care: {
    title: string;
    summary: string;
    how_it_works: string;
    default_profile: {
      id: string;
      name: string;
      phone: string;
      stage: string;
      care_type: string;
    };
    topics: PreCareTopicPreview[];
  };
  post_care: {
    title: string;
    summary: string;
    how_it_works: string;
    patients: PostCarePatientPreview[];
  };
}
