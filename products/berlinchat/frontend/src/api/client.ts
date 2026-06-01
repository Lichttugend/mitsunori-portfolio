import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000",
});

// インターセプターでJWTトークンを付与
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface ChatResponse {
  message: string;
  explanation?: string;
  character: "freya" | "finn";
}

export async function sendMessage(
  content: string,
  language: "ja" | "en" = "ja"
): Promise<ChatResponse> {
  const { data } = await api.post<ChatResponse>("/chat/message", {
    content,
    language,
  });
  return data;
}

export async function getChatHistory(): Promise<ChatResponse[]> {
  const { data } = await api.get<ChatResponse[]>("/chat/history");
  return data;
}

export async function login(email: string, password: string): Promise<string> {
  const { data } = await api.post<{ access_token: string }>("/auth/login", {
    email,
    password,
  });
  return data.access_token;
}

export async function register(
  email: string,
  password: string
): Promise<void> {
  await api.post("/auth/register", { email, password });
}

export default api;
