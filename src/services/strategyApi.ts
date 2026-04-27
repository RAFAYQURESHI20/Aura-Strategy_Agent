/**
 * Strategy API service — typed wrapper for /api/strategy endpoints.
 */

import { post, get } from "./api";
import type { Strategy, StrategyRequest } from "../types/strategy";

export interface HealthResponse {
  status: string;
  timestamp: string;
}

/**
 * Generate a marketing strategy from the backend CrewAI crew.
 */
export async function generateStrategy(request: StrategyRequest): Promise<Strategy> {
  return post<StrategyRequest, Strategy>("/api/strategy/generate", request);
}

/**
 * Check backend health.
 */
export async function checkHealth(): Promise<HealthResponse> {
  return get<HealthResponse>("/api/health");
}

