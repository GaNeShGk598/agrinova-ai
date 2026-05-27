const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
const REQUEST_TIMEOUT_MS = 15_000;

function getToken(): string | null {
  return localStorage.getItem("agn_token");
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiFetch<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...authHeaders(),
    ...(opts.headers as Record<string, string> | undefined ?? {}),
  };

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...opts,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timer);

    let body: unknown = null;
    try { body = await res.json(); } catch (_) {}

    if (!res.ok) {
      const rawMsg =
        body && typeof body === "object"
          ? ((body as Record<string, unknown>).detail ??
             (body as Record<string, unknown>).message)
          : res.statusText;
      throw new Error(
        typeof rawMsg === "string" ? rawMsg : JSON.stringify(rawMsg) || `HTTP ${res.status}`
      );
    }
    return body as T;
  } catch (err) {
    clearTimeout(timer);
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("Request timed out. Please check your connection.");
    }
    throw err;
  }
}

async function apiUpload<T>(path: string, formData: FormData): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30_000);

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: authHeaders(),
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timer);
    const body = await res.json().catch(() => null);
    if (!res.ok) {
      throw new Error(
        (body as Record<string, unknown>)?.detail as string ?? res.statusText
      );
    }
    return body as T;
  } catch (err) {
    clearTimeout(timer);
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("Upload timed out. Image may be too large.");
    }
    throw err;
  }
}

export interface SoilProfile {
  ph: number;
  n: number;
  p: number;
  k: number;
  organic_matter?: number;
  moisture?: number;
}

export interface UserRegister {
  name: string;
  email: string;
  password: string;
  region?: string;
  language?: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserOut {
  id: string;
  name: string;
  email: string;
  region?: string;
  language?: string;
}

export interface TokenOut {
  access_token: string;
  token_type: string;
  user: UserOut;
}

export interface CropCandidate {
  crop: string;
  confidence: number;
  reasoning: string;
}

export interface CropPredictResponse {
  candidates: CropCandidate[];
  explanation: string;
  best_pick?: string;
  recommendation_summary?: string;
  next_steps?: string[];
}

export interface CropPredictRequest {
  soil: SoilProfile;
  season: string;
  region: string;
}

export interface YieldRequest {
  crop: string;
  soil: SoilProfile;
  rainfall_mm?: number;
  temperature_c?: number;
  area_acres?: number;
}

export interface YieldResponse {
  crop: string;
  yield_q_per_ha: number;
  range_low: number;
  range_high: number;
  category: string;
}

export interface WeatherResponse {
  forecast: {
    current?: {
      temperature_2m?: number;
      relative_humidity_2m?: number;
      precipitation?: number;
      weather_code?: number;
    };
    daily?: {
      time?: string[];
      temperature_2m_max?: number[];
      temperature_2m_min?: number[];
      precipitation_sum?: number[];
      weather_code?: number[];
    };
  };
  suggestions: string[];
}

export interface AlertIn {
  farm_id?: string;
  type: "irrigation" | "disease" | "weather" | "market";
  severity: "low" | "medium" | "high";
  title: string;
  message: string;
}

export interface AlertOut extends AlertIn {
  id: string;
  user_id: string;
  created_at: string;
}

export interface MarketPoint {
  week: string;
  price: number;
}

export interface MarketTrend {
  crop: string;
  unit: string;
  series: MarketPoint[];
  trend: "rising" | "stable" | "falling";
  change_pct: number;
}

export interface FertilizerRequest {
  crop: string;
  soil: SoilProfile;
  area_acres?: number;
}

export interface RotationRequest {
  current_crop: string;
  seasons?: number;
}

export interface DiseaseResult {
  disease: string;
  severity: string;
  confidence: number;
  remedies: string[];
  explanation: string;
}

const auth = {
  register: (data: UserRegister) =>
    apiFetch<TokenOut>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: UserLogin) =>
    apiFetch<TokenOut>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  setSession: (tok: TokenOut) => {
    localStorage.setItem("agn_token", tok.access_token);
    localStorage.setItem("agn_user", JSON.stringify(tok.user));
  },

  clearSession: () => {
    localStorage.removeItem("agn_token");
    localStorage.removeItem("agn_user");
  },

  currentUser: (): UserOut | null => {
    const u = localStorage.getItem("agn_user");
    return u ? (JSON.parse(u) as UserOut) : null;
  },

  isAuthenticated: (): boolean => !!getToken(),
};

const crop = {
  predict: (data: CropPredictRequest) =>
    apiFetch<CropPredictResponse>("/predict-crop", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

const disease = {
  analyzeLeaf: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return apiUpload<DiseaseResult>("/analyze-leaf", form);
  },
};

const yieldApi = {
  estimate: (data: YieldRequest) =>
    apiFetch<YieldResponse>("/estimate-yield", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

const weather = {
  get: (lat: number, lon: number) =>
    apiFetch<WeatherResponse>(`/weather?lat=${lat}&lon=${lon}`),
};

const alerts = {
  list: () => apiFetch<AlertOut[]>("/alerts"),
  create: (data: AlertIn) =>
    apiFetch<AlertOut>("/alerts", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  evaluate: (soil_moisture: number, humidity: number) =>
    apiFetch<{ created: AlertOut[] }>(
      `/alerts/evaluate?soil_moisture=${soil_moisture}&humidity=${humidity}`,
      { method: "POST" }
    ),
};

const market = {
  prices: (cropName: string = "wheat", weeks: number = 8) =>
    apiFetch<MarketTrend>(
      `/market-prices?crop=${encodeURIComponent(cropName)}&weeks=${weeks}`
    ),
};

const fertilizer = {
  recommend: (data: FertilizerRequest) =>
    apiFetch<Record<string, unknown>>("/fertilizer", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

const rotation = {
  plan: (data: RotationRequest) =>
    apiFetch<Record<string, unknown>>("/rotation-plan", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export const api = {
  auth,
  crop,
  disease,
  yield: yieldApi,
  weather,
  alerts,
  market,
  fertilizer,
  rotation,
};
