const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

interface ApiResponse<T> {
  data: T;
  error?: string;
  ok: boolean;
}
export const fetchData = async <T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any
): Promise<ApiResponse<T> & { ok: boolean }> => {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = method === "DELETE" ? null : await response.json();

  if (data.message) {
    return { data, ok: response.ok || true };
  }

  return { data: null as any, error: data.error, ok: false };
};
