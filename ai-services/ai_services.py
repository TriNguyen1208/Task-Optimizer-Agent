from pydantic import BaseModel, Field
from langchain.agents import create_agent
from langchain.tools import tool
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.rate_limiters import InMemoryRateLimiter
from dotenv import load_dotenv
from datetime import datetime
from typing import List
import json

from data_services import get_tasks, get_user_info

load_dotenv()

class SingleTask(BaseModel):
    """Information of a schedule unit, including a task and the time to do the task"""
    date: str = Field(description="The date to do the task, with the format: DD/MM/YYYY")
    start_time: str = Field(description="The time to start doing the task, with format: HH:MM")
    end_time: str = Field(description="The time to stop doing the task, with format: HH:MM")
    task_id: int = Field(description="The task's id")

class ScheduleOutput(BaseModel):
    """Output schedule, including many schedule units"""
    tasks: List[SingleTask]

# @tool 
# def get_data():
#     """Tool to read user's information, and the tasks information"""
#     json_path="mock_data.json"
#     with open(json_path, "r", encoding="utf-8") as f:
#         data = json.load(f)
#     return data

@tool
def get_data():
    """Tool to read user's information, and the tasks information"""
    tasks, _ = get_tasks()
    user_info = get_user_info()
    return {"tasks": tasks, "user_info": user_info}

@tool
def get_weekday(date_str: str) -> str:
    """Return weekday of a date in DD/MM/YYYY format"""
    dt = datetime.strptime(date_str, "%d/%m/%Y")
    return dt.strftime("%A")

rate_limiter = InMemoryRateLimiter(
    requests_per_second=0.15,   # ~9 req/phút
    max_bucket_size=1
)

gemini_model = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0,
    rate_limiter=rate_limiter,
    max_retries=0
)

schedule_agent = create_agent(
    model=gemini_model,
    tools=[get_data, get_weekday],
    response_format=ScheduleOutput  
)

def organize_schedule():
    messages = [
        {"role": "system", "content": "Your job is to read user tasks and arrange them into a logical schedule."},
        {"role": "user", "content": "Using tool to read neccessary information, and the tasks I have to make plan (schedule) to do tasks"},
    ]

    result: ScheduleOutput = schedule_agent.invoke({
        "messages": messages
    })["structured_response"]

    data = result.model_dump()

    with open("output.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

    return data["tasks"] 

def predict_working_time(name: str, description: str):
    _, finished_tasks = get_tasks()
    user_info = get_user_info()

    input = {
        "new_task_name": name,
        "new_task_description": description,
        "finished_tasks": finished_tasks,
        "my_info": user_info
    }

    messages = [
        {
            "role": "system", 
            "content": "You predict the real working hours of my task (it is a float number)"
        },
        {
            "role": "user", 
            "content": 
            [
                {"You predict the working hours of my new task. You have its name and description, and you predict based on my information, my tasks and corresponding working hours in the past. Just answer the number."},
                {input}
            ]
        }
    ]

    result = gemini_model.invoke({
        "messages": messages
    })["structured_response"]

    return result