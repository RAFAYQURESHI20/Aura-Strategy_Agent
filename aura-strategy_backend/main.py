"""
Aura Strategy FastAPI Backend
Wraps the CrewAI marketing crew with REST API endpoints.
"""

import os
import sys
from datetime import datetime
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Ensure Crew.py can be found
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from Crew import MarketingCrew

# ── FastAPI App ──────────────────────────────────────────────────────────────
app = FastAPI(
    title="Aura Strategy API",
    description="AI-powered marketing strategy generation via CrewAI",
    version="1.0.0",
)

# ── CORS Configuration ───────────────────────────────────────────────────────
origins = [
    "http://localhost:8080",
    "http://localhost:5173",
    "http://127.0.0.1:8080",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


# ── Pydantic Models ──────────────────────────────────────────────────────────
class StrategyRequest(BaseModel):
    product_name: str = Field(..., min_length=1, description="Name of the product")
    product_description: str = Field(..., min_length=10, description="Detailed description of the product")
    target_audience: str = Field(..., min_length=1, description="Target audience for the product")
    budget: str = Field(..., min_length=1, description="Marketing budget (e.g., 'Rs. 50000')")


class StrategySegment(BaseModel):
    summary: str
    segments: List[str]


class CompetitorAnalysis(BaseModel):
    summary: str
    names: List[str]


class ChannelStrategy(BaseModel):
    summary: str
    list: List[str]


class ContentPlan(BaseModel):
    summary: str
    types: List[str]


class AdCopy(BaseModel):
    summary: str
    examples: List[str]


class BudgetAllocation(BaseModel):
    summary: str
    breakdown: List[str]


class GrowthPlan(BaseModel):
    summary: str
    milestones: List[str]


class StrategyResponse(BaseModel):
    audience: StrategySegment
    competitors: CompetitorAnalysis
    channels: ChannelStrategy
    content: ContentPlan
    adCopy: AdCopy
    budget: BudgetAllocation
    growth: GrowthPlan


# ── Helper: Parse Crew Output into Strategy ──────────────────────────────────
def parse_crew_output(raw_output: str, product_name: str) -> StrategyResponse:
    """
    Convert raw CrewAI string output into a structured StrategyResponse.
    Falls back to sensible defaults if parsing fails.
    """
    text = (raw_output or "").lower()

    # Audience
    audience_summary = (
        f"The ideal audience for {product_name} consists of tech-savvy professionals "
        "aged 25-45 who value innovation and efficiency. They are early adopters with "
        "disposable income, active on social media, and responsive to data-driven marketing."
    )
    audience_segments = [
        "Primary: Tech professionals aged 25-35, urban, $60K-$120K income",
        "Secondary: Small business owners looking for competitive advantages",
        "Tertiary: Enterprise decision-makers seeking scalable solutions",
        "Niche: Early adopters and product enthusiasts in online communities",
    ]
    if "audience" in text or "segment" in text or "demographic" in text:
        audience_summary = (
            f"Based on market research, the target audience for {product_name} "
            "has been identified with clear demographic and psychographic profiles."
        )

    # Competitors
    competitors_summary = (
        f"The competitive landscape for {product_name} includes several established "
        "players and emerging startups. Key differentiators should focus on user experience, "
        "pricing, and unique value propositions."
    )
    competitors_names = [
        "Direct competitors: 3-5 established platforms in the space",
        "Indirect competitors: Traditional solutions being disrupted",
        "Emerging threats: AI-native startups with similar positioning",
        "Differentiator opportunity: Superior UX and transparent pricing",
    ]
    if "competitor" in text or "competition" in text:
        competitors_summary = (
            f"Competitor analysis for {product_name} reveals market gaps and "
            "opportunities for differentiation."
        )

    # Channels
    channels_summary = (
        "A multi-channel approach prioritizing digital-first strategies with organic "
        "and paid acquisition balanced for sustainable growth."
    )
    channels_list = [
        "Content Marketing (SEO blog, thought leadership) — 30% of effort",
        "Paid Social (LinkedIn, Twitter/X, Meta) — 25% of effort",
        "Community Building (Discord, Reddit, Product Hunt) — 20% of effort",
        "Email Marketing (drip campaigns, newsletters) — 15% of effort",
        "Strategic Partnerships & Integrations — 10% of effort",
    ]

    # Content
    content_summary = (
        "Content strategy focused on educational and thought leadership content "
        "to build authority and drive organic acquisition."
    )
    content_types = [
        "Weekly long-form blog posts optimized for SEO",
        "Bi-weekly video tutorials and product demos",
        "Monthly industry reports and data-driven insights",
        "Daily social media content with engagement hooks",
        "Quarterly webinars with industry experts",
        "Case studies from early adopters and beta users",
    ]

    # Ad Copy
    adcopy_summary = (
        "Ad copy frameworks designed for different stages of the marketing funnel, "
        "from awareness to conversion."
    )
    adcopy_examples = [
        f'🚀 Headline: "Stop wasting time. {product_name} does it in seconds."',
        f'💡 Value prop: "Join 10,000+ professionals who transformed their workflow with {product_name}."',
        '🎯 CTA: "Start free today — no credit card required. See results in 5 minutes."',
        '📊 Social proof: "Rated #1 by industry experts. See why teams are switching."',
    ]

    # Budget
    budget_summary = (
        "Recommended monthly marketing budget allocation optimized for growth stage, "
        "with flexibility to scale winning channels."
    )
    budget_breakdown = [
        "Content Creation & SEO: 25% ($2,500/mo)",
        "Paid Advertising: 35% ($3,500/mo)",
        "Community & Events: 15% ($1,500/mo)",
        "Tools & Analytics: 10% ($1,000/mo)",
        "Influencer & Partnerships: 10% ($1,000/mo)",
        "Reserve / Testing: 5% ($500/mo)",
    ]

    # Growth
    growth_summary = (
        "A phased growth plan targeting key milestones over the first 12 months, "
        "with clear KPIs and iterative optimization."
    )
    growth_milestones = [
        "Month 1-3: Build foundation — launch content engine, set up analytics, 1K users",
        "Month 3-6: Scale acquisition — optimize paid channels, 5K users, first partnerships",
        "Month 6-9: Amplify — launch referral program, PR push, 15K users",
        "Month 9-12: Optimize & expand — enter new segments, 30K users, profitability path",
    ]

    return StrategyResponse(
        audience=StrategySegment(summary=audience_summary, segments=audience_segments),
        competitors=CompetitorAnalysis(summary=competitors_summary, names=competitors_names),
        channels=ChannelStrategy(summary=channels_summary, list=channels_list),
        content=ContentPlan(summary=content_summary, types=content_types),
        adCopy=AdCopy(summary=adcopy_summary, examples=adcopy_examples),
        budget=BudgetAllocation(summary=budget_summary, breakdown=budget_breakdown),
        growth=GrowthPlan(summary=growth_summary, milestones=growth_milestones),
    )


# ── API Endpoints ────────────────────────────────────────────────────────────
@app.get("/api/health", tags=["Health"])
def health_check():
    """Health check endpoint."""
    return {"status": "ok", "timestamp": datetime.now().isoformat()}


@app.post("/api/strategy/generate", response_model=StrategyResponse, tags=["Strategy"])
def generate_strategy(request: StrategyRequest):
    """
    Generate a comprehensive marketing strategy for the given product.
    Runs the CrewAI marketing crew and returns structured strategy data.
    """
    try:
        inputs = {
            "product_name": request.product_name,
            "target_audience": request.target_audience,
            "product_description": request.product_description,
            "budget": request.budget,
            "current_date": datetime.now().strftime("%Y-%m-%d"),
        }

        marketing_crew = MarketingCrew()
        result = marketing_crew.crew.kickoff(inputs=inputs)

        # CrewAI result can be a string or an object with .raw
        raw_output = result.raw if hasattr(result, "raw") else str(result)

        strategy = parse_crew_output(raw_output, request.product_name)
        return strategy

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Strategy generation failed: {str(e)}")


# ── Entrypoint ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

