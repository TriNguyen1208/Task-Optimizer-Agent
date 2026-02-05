from pydantic import BaseModel, Field, field_validator
from langchain.agents import create_agent
from langchain.tools import tool
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.rate_limiters import InMemoryRateLimiter
from dotenv import load_dotenv
from datetime import datetime, date as date_type, time
from typing import List 
import json

from data_services import get_tasks, get_user_info

load_dotenv()

# For opik
import google.genai
from opik import configure 
from opik.integrations.genai import track_genai 
import opik

configure() 
client = google.genai.Client()
gemini_client = track_genai(client) 

#-----
class SingleTask(BaseModel):
    """Information of a schedule unit, including a task and the time to do the task"""
    date: date_type = Field(description="The date to do the task, with the format: DD/MM/YYYY")
    start_time: time = Field(description="The time to start doing the task, with format: HH:MM")
    end_time: time = Field(description="The time to stop doing the task, with format: HH:MM")
    task_id: int = Field(description="The task's id")

    @field_validator("date", mode="before")
    @classmethod
    def parse_date(cls, v):
        if isinstance(v, str):
            return datetime.strptime(v, "%d/%m/%Y").date()
        return v

    @field_validator("start_time", "end_time", mode="before")
    @classmethod
    def parse_time(cls, v):
        if isinstance(v, str):
            return datetime.strptime(v, "%H:%M").time()
        return v

class ScheduleOutput(BaseModel):
    """Output schedule, including many schedule units"""
    tasks: List[SingleTask]

def get_current_date():
    now = datetime.now()
    return now.strftime("%d/%m/%Y")

# @tool 
# @opik.track(name="get_data")
# def get_data():
#     """Tool to read user's information, and the tasks information"""
#     json_path="mock_data.json"
#     with open(json_path, "r", encoding="utf-8") as f:
#         data = json.load(f)
#     return data

@opik.track(name="get_data")
async def get_data(user_id: int):
    """Tool to read user's information, and the tasks information. The input parameter is the user's id"""
    tasks, _ = await get_tasks(user_id)
    user_info = await get_user_info(user_id)
    return {"tasks": tasks, "user_info": user_info}

@tool
@opik.track(name="get_weekday")
def get_weekday(date_str: str) -> str:
    """Return weekday of a date in DD/MM/YYYY format"""
    dt = datetime.strptime(date_str, "%d/%m/%Y")
    return dt.strftime("%A")

rate_limiter = InMemoryRateLimiter(
    requests_per_second=0.15,   # ~9 req/phút
    max_bucket_size=1
)

gemini_model = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash-lite",
    temperature=0,
    rate_limiter=rate_limiter,
    max_retries=0
)

schedule_agent = create_agent(
    model=gemini_model,
    tools=[get_data, get_weekday],
    response_format=ScheduleOutput  
)

@opik.track(name="schedule")
async def organize_schedule(user_id: int):
    # messages = [
    #     {"role": "system", "content": "Your job is to read user tasks and arrange them into a logical schedule."},
    #     {"role": "user", "content": "Using tool to read neccessary information, and the tasks I have to make plan (schedule) to do tasks."
    #     "It would be great if my tasks can be done at least 1 day earlier than the deadline."
    #     "Remember that total predicted hours to do the task must be at least equal to 'working hours' attribute in each task."},
    # ]
    system_instruction = """
    You are an expert AI Task Scheduler. Your goal is to generate a high-precision schedule.
    You have 2 main tasks: 
    1. Read user's information (NOTE that they are facts, not preferences!). Understand user's information deeply.
    2. Generate a high-precision schedule following these reasoning steps (Chain of Thought):
        Step 1: Calculate "Internal Deadlines" for each task (Should be earlier than the deadline).
        Step 2: Map out available time slots per day (considering school and sleep).
        Step 3: Distribute tasks based on their nature described in input data.
        Step 4: Double-check if the total hours for tasks are sufficient (at least equal to the input working hours).
    """
    input_data = await get_data(user_id)
    input_data_str = json.dumps(input_data, ensure_ascii=False, indent=2)
    messages = [
        {"role": "system", "content": system_instruction},
        {
            "role": "user", 
            "content": f"Today is {get_current_date()}. Read information of me and my tasks, then generate appropriate schedule.\n"
                        f"My information and tasks: \n{input_data_str}\n"
        }
    ]

    result: ScheduleOutput = await schedule_agent.ainvoke({
        "messages": messages
    })
    result = result["structured_response"]

    data = result.model_dump(mode="json")

    with open("output.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

    return data["tasks"] 

async def predict_working_time(name: str, description: str, user_id: int):
    _, finished_tasks = await get_tasks(user_id)
    user_info = await get_user_info(user_id)

    input_data = {
        "new_task_name": name,
        "new_task_description": description,
        "finished_tasks": finished_tasks,
        "my_info": user_info
    }
    input_data_str = json.dumps(input_data, ensure_ascii=False, indent=2)

    messages = [
        {
            "role": "system", 
            "content": "You predict the real working hours of my task (it is a float number)"
        },
        {
            "role": "user", 
            "content": f"You predict the working hours of my new task. You have its name and description,"
                        "and you predict based on my information, my tasks and corresponding working hours in the past."
                        f"Just answer a number. My input:\n\n{input_data_str}\n\n"
        }
    ]

    response = await gemini_model.ainvoke(messages)

    return response.content