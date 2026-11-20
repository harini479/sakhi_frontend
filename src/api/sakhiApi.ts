import {
  CarePreviewData,
  KnowledgeArticle,
  SakhiResponsePayload,
} from "@/types/sakhi";

// Direct-HTTPS backend connectivity strategy:
// In standalone Cloud Run deployments, pass VITE_API_BASE_URL at Docker build time
// (e.g., https://backend-service-xxxxx-el.a.run.app).
// VITE_BACKEND_API_URL is supported as a backwards-compatible fallback.
// When omitted (local dev proxy or unified preview), relative /api/* paths are used.
const RAW_API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_BACKEND_API_URL ||
  "";

export const API_BASE_URL = RAW_API_BASE.trim().replace(/\/+$/, "");

export type ApiErrorKind =
  | "timeout"
  | "network"
  | "unauthorized"
  | "forbidden"
  | "server"
  | "client"
  | "invalid_response";

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;

  constructor(kind: ApiErrorKind, message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
  }
}

const CHAT_TIMEOUT_MS = 25_000;
const METADATA_TIMEOUT_MS = 10_000;

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError("timeout", "Request timed out");
    }
    throw new ApiError("network", "Unable to reach the service");
  } finally {
    globalThis.clearTimeout(timeoutId);
  }
}

function buildHeaders(
  contentType: boolean,
  authToken?: string | null
): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (contentType) {
    headers["Content-Type"] = "application/json";
  }
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }
  return headers;
}

function classifyHttpError(status: number): ApiError {
  if (status === 401) {
    return new ApiError("unauthorized", "Authentication required", status);
  }
  if (status === 403) {
    return new ApiError("forbidden", "Access denied", status);
  }
  if (status >= 500) {
    return new ApiError("server", "Service temporarily unavailable", status);
  }
  return new ApiError("client", `Request failed (${status})`, status);
}

export async function sendChatMessage(params: {
  message: string;
  sessionPhone: string;
  language?: string;
  interactiveReply?: { id: string; title: string } | null;
  authToken?: string | null;
}): Promise<SakhiResponsePayload[]> {
  const response = await fetchWithTimeout(
    `${API_BASE_URL}/api/chat`,
    {
      method: "POST",
      headers: buildHeaders(true, params.authToken),
      body: JSON.stringify({
        message: params.message,
        sessionPhone: params.sessionPhone,
        language: params.language || "en",
        interactiveReply: params.interactiveReply || null,
      }),
    },
    CHAT_TIMEOUT_MS
  );

  if (!response.ok) {
    throw classifyHttpError(response.status);
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new ApiError("invalid_response", "Unexpected response format");
  }

  if (
    !data ||
    typeof data !== "object" ||
    !Array.isArray((data as { responses?: unknown }).responses)
  ) {
    return [];
  }

  return (data as { responses: SakhiResponsePayload[] }).responses;
}

export async function fetchCarePreview(
  authToken?: string | null
): Promise<CarePreviewData | null> {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/care-preview`,
      {
        method: "GET",
        headers: buildHeaders(false, authToken),
      },
      METADATA_TIMEOUT_MS
    );
    if (!response.ok) return null;
    return (await response.json()) as CarePreviewData;
  } catch {
    return null;
  }
}

export async function fetchKnowledgeRecommendations(
  lens: string,
  lang = "en",
  limit = 6,
  authToken?: string | null
): Promise<KnowledgeArticle[]> {
  try {
    const url = `${API_BASE_URL}/api/proxy/knowledge_hub/recommendations?lens=${encodeURIComponent(
      lens
    )}&lang=${encodeURIComponent(lang)}&limit=${limit}`;

    const response = await fetchWithTimeout(
      url,
      {
        method: "GET",
        headers: buildHeaders(false, authToken),
      },
      METADATA_TIMEOUT_MS
    );
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
