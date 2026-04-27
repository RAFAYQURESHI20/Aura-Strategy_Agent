from typing import List
from crewai import Agent, Crew, Process, Task
from crewai_tools import ScrapeWebsiteTool, DirectoryReadTool, FileWriterTool, FileReadTool  # Not available in crewai 0.11.2; custom tool used
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from crewai.tools import BaseTool
from serpapi import GoogleSearch
load_dotenv()
import os
from crewai import LLM
import yaml


# planning llm
llm = LLM(
  model='gemini/gemini-2.0-flash',
  temperature=0.5,
)




SERP_API_KEY= os.getenv("SERPER_API_KEY")
print("SERP_API_KEY loaded:", bool(SERP_API_KEY))



#custom tool
class SerpApiSearchTool(BaseTool):
  name:str = "google_search"
  description:str = "Search google using SerpApi and return the results"
  
  def _run(self,query:str):
    params = {
        "q": query,
        "hl": "en",
        "gl": "us",
        "api_key": SERP_API_KEY 
    }
    search = GoogleSearch(params)
    results = search.get_dict()
    
    # Extract top results (titles + links)
    if "organic_results" in results:
        return [
            {"title": r["title"], "link": r["link"], "snippet": r.get("snippet", "")}
            for r in results["organic_results"][:5]
        ]
    return {"error": "No results found"}





# pydantic model for content output
class Content(BaseModel):
    content_type: str = Field(...,
                              description="The type of content to be created (e.g., blog post, social media post, video)")
    topic: str = Field(..., description="The topic of the content")
    target_audience: str = Field(..., description="The target audience for the content")
    tags: List[str] = Field(..., description="Tags to be used for the content")
    content: str = Field(..., description="The content itself")





class MarketingCrew:
    """Marketing crew for strategy, content creation and SEO."""

    def __init__(self):
        # Load configs using absolute paths so imports work from any cwd
        base_dir = os.path.dirname(os.path.abspath(__file__))
        with open(os.path.join(base_dir, "Config", "Agent.yaml"), "r") as f:
            self.agents_config = yaml.safe_load(f)
        with open(os.path.join(base_dir, "Config", "Tasks.yaml"), "r") as f:
            self.tasks_config = yaml.safe_load(f)

        # Head of marketing
        self.head_of_marketing = Agent(
            **self.agents_config["head_of_marketing"],
            tools=[SerpApiSearchTool(), ScrapeWebsiteTool()],
            inject_date=True,
            max_rpm=10
        )

        # Social media content creator
        self.content_creator_social_media = Agent(
            **self.agents_config["content_creator_social_media"],
            tools=[SerpApiSearchTool(), ScrapeWebsiteTool(), FileWriterTool()],
            inject_date=True,
            allow_delegation=True,
            max_iter=10
        )

        # Blog writer
        self.content_writer_blogs = Agent(
            **self.agents_config["content_writer_blogs"],
            tools=[SerpApiSearchTool(), FileWriterTool()],
            inject_date=True,
            max_iter=5
        )

        # SEO specialist
        self.seo_specialist = Agent(
            **self.agents_config["seo_specialist"],
            tools=[FileReadTool(), FileWriterTool()],
            inject_date=True,
            max_iter=3
        )

        # Tasks
        self.market_research = Task(
            **self.tasks_config["market_research"],
            agent=self.head_of_marketing
        )

        self.prepare_marketing_strategy = Task(
            **self.tasks_config["prepare_marketing_strategy"],
            agent=self.head_of_marketing
        )

        self.create_content_calendar = Task(
            **self.tasks_config["create_content_calendar"],
            agent=self.content_creator_social_media
        )

        self.prepare_post_drafts = Task(
            **self.tasks_config["prepare_post_drafts"],
            agent=self.content_creator_social_media,
            output_json=Content
        )

        self.prepare_scripts_for_reels = Task(
            **self.tasks_config["prepare_scripts_for_reels"],
            agent=self.content_creator_social_media,
            output_json=Content
        )

        self.content_research_for_blogs = Task(
            **self.tasks_config["content_research_for_blogs"],
            agent=self.content_writer_blogs
        )

        self.draft_blogs = Task(
            **self.tasks_config["draft_blogs"],
            agent=self.content_writer_blogs,
            output_json=Content
        )

        self.seo_optimization = Task(
            **self.tasks_config["seo_optimization"],
            agent=self.seo_specialist,
            output_json=Content
        )

        # Crew
        self.crew = Crew(
            agents=[
                self.head_of_marketing,
                self.content_creator_social_media,
                self.content_writer_blogs,
                self.seo_specialist
            ],
            tasks=[
                self.market_research,
                self.prepare_marketing_strategy,
                self.create_content_calendar,
                self.prepare_post_drafts,
                self.prepare_scripts_for_reels,
                self.content_research_for_blogs,
                self.draft_blogs,
                self.seo_optimization
            ],
            verbose=True,
            process=Process.sequential,
            max_rpm=10
        )



if __name__ == "__main__":
    from datetime import datetime
    inputs = {
        "product_name": "AI Powered Learning Management system",
        "target_audience": "Small and Medium Enterprises (SMEs)",
        "product_description": "An AI-powered Learning Management System (LMS) designed to help small and medium enterprises (SMEs) create, manage, and deliver personalized training programs for their employees. The LMS uses artificial intelligence to analyze employee performance, identify skill gaps, and recommend tailored learning paths to enhance employee development and productivity.",
        "budget": "Rs. 50000",
        "current_date": datetime.now().strftime("%Y-%m-%d"),
    }
    marketing_crew = MarketingCrew()
    marketing_crew.crew.kickoff(inputs=inputs)
    print('Marketing Crew has been successfully created and run!')
