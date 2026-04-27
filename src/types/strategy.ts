export interface Strategy {
  audience: { summary: string; segments: string[] };
  competitors: { summary: string; names: string[] };
  channels: { summary: string; list: string[] };
  content: { summary: string; types: string[] };
  adCopy: { summary: string; examples: string[] };
  budget: { summary: string; breakdown: string[] };
  growth: { summary: string; milestones: string[] };
}

export interface StrategyRequest {
  product_name: string;
  product_description: string;
  target_audience: string;
  budget: string;
}
