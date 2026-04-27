/**
 * Base API client for Aura Strategy frontend.
 * Handles request/response lifecycle, error handling, and timeouts.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const DEFAULT_TIMEOUT = 300_000; // 5 minutes — CrewAI can be slow

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number = DEFAULT_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError("Request timed out. The AI is still thinking — try again.", 408);
    }
    throw error;
  } finally {
    clearTimeout(id);
  }
}

/**
 * Generic GET request
 */
export async function get<T>(path: string): Promise<T> {
  const response = await fetchWithTimeout(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new ApiError(errorBody || `HTTP ${response.status}`, response.status);
  }

  return response.json() as Promise<T>;
}

/**
 * Generic POST request
 */
export async function post<TRequest, TResponse>(
  path: string,
  body: TRequest
): Promise<TResponse> {
  const response = await fetchWithTimeout(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new ApiError(errorBody || `HTTP ${response.status}`, response.status);
  }

  return response.json() as Promise<TResponse>;
}

export { ApiError };

