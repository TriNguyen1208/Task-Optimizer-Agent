import json
import os
from datetime import datetime, date as date_type, time
from typing import List
from dotenv import load_dotenv
from pydantic import BaseModel, Field, field_validator
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.rate_limiters import InMemoryRateLimiter
import opik
from langchain.tools import tool
from langchain.agents import create_agent

# Import từ file service của bạn
from data_services import get_tasks, get_user_info, get_task_by_id, get_schedule

load_dotenv()

# --- Định nghĩa Schema ---
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
    tasks: List[SingleTask]

# --- Cấu hình Model ---
rate_limiter = InMemoryRateLimiter(requests_per_second=0.15)

gemini_model = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash-lite", # Nên dùng bản ổn định
    temperature=0,
    rate_limiter=rate_limiter
)
def get_current_date():
    now = datetime.now()
    return now.strftime("%d/%m/%Y")

@tool
@opik.track(name="get_weekday")
def get_weekday(date_str: str) -> str:
    """Return weekday of a date in DD/MM/YYYY format"""
    dt = datetime.strptime(date_str, "%d/%m/%Y")
    return dt.strftime("%A")

async def get_data(cookies: dict):
    tasks, _ = await get_tasks(cookies)
    user_info = await get_user_info(cookies)
    return {"tasks": tasks, "user_info": user_info}

@opik.track(name="get_data_for_1_task")
async def get_data_schedule_1_task(cookies: dict, task_id: int):
    task = await get_task_by_id(cookies, task_id)
    user_info = await get_user_info(cookies)
    schedule = await get_schedule(cookies)
    return {"new_task": task, "user_info": user_info, "existed_schedule": schedule}

schedule_agent = create_agent(
    model=gemini_model,
    tools=[get_weekday],
    response_format=ScheduleOutput  
)

@opik.track(name="schedule")
async def organize_schedule(cookies: dict):
    system_instruction = """
    You are an expert AI Task Scheduler. Your goal is to generate a high-precision schedule.
    You have 2 main tasks: 
    1. Read user's information (NOTE that they are facts, not preferences!). Understand user's information deeply.
    2. Generate a high-precision schedule following these reasoning steps (Chain of Thought):
        Step 1: Calculate "Internal Deadlines" for each task (Should be earlier than the deadline).
        Step 2: Map out available time slots per day (considering school and sleep).
        Step 3: Distribute tasks based on their nature described in input data.
        Step 4: Double-check if the total hours for tasks are sufficient (at least equal to the input working hours).
    3. Output Data Formatting Rules:
        - Dates: MUST be in 'YYYY-MM-DD' or 'DD/MM/YYYY' format.
        - Times: MUST be in 'HH:MM' format (24-hour clock, e.g., 08:30, 15:45).
        - Consistency: Ensure start_time is always before end_time for the same task.
        - Structure: Your response must strictly follow the ScheduleOutput schema.
    """
    
    input_data = await get_data(cookies)
    input_data_str = json.dumps(input_data, ensure_ascii=False, indent=2)
    
    messages = [
        {"role": "system", "content": system_instruction},
        {
            "role": "user", 
            "content": f"Today is {get_current_date()}. Read information of me and my tasks, then generate appropriate schedule.\n"
                        f"My information and tasks: \n{input_data_str}\n"
        }
    ]

    # Kết quả trả về trực tiếp là object ScheduleOutput
    result = await schedule_agent.ainvoke({"messages": messages})
  
    final_output = result.get("structured_response") or result.get("output")
    
    if isinstance(final_output, ScheduleOutput):
        return final_output.model_dump()["tasks"]
    return final_output # Nếu là dict

@opik.track(name="schedule_1_task")
async def orgranize_schedule_1_task(cookies: dict, task_id: int):
    system_instruction = """
    You are an expert AI Task Scheduler. Your goal is to generate a high-precision schedule for the input task.
    You have 2 main tasks: 
    1. Read user's information (NOTE that they are facts, not preferences!). Understand user's information deeply.
    2. Generate a high-precision schedule following these reasoning steps (Chain of Thought):
        Step 1: Calculate "Internal Deadlines" for the input task (Should be earlier than the deadline).
        Step 2: Map out available time slots per day (considering school and sleep). Remember to read my schedule of existed tasks,
        my new task's schedules cannot be overlapped with the existed schedules.
        Step 3: Distribute the task based on its nature described in input data.
        Step 4: Double-check if the total hours for tasks are sufficient (at least equal to the input working hours).
    3. Output Data Formatting Rules:
        - Dates: MUST be in 'YYYY-MM-DD' or 'DD/MM/YYYY' format.
        - Times: MUST be in 'HH:MM' format (24-hour clock, e.g., 08:30, 15:45).
        - Consistency: Ensure start_time is always before end_time for the same task.
        - Structure: Your response must strictly follow the ScheduleOutput schema.
        - Special values: Age = 0 and WorkingTime = 0 are default values, skip them if they are equal to 0.
    """
    
    input_data = await get_data_schedule_1_task(cookies, task_id)
    input_data_str = json.dumps(input_data, ensure_ascii=False, indent=2)
    
    messages = [
        {"role": "system", "content": system_instruction},
        {
            "role": "user", 
            "content": f"Today is {get_current_date()}. Read information of me, my new task, and my existed schedules, then generate appropriate schedule for my new task.\n"
                        f"My information and tasks: \n{input_data_str}\n"
        }
    ]

    # Kết quả trả về trực tiếp là object ScheduleOutput
    result: ScheduleOutput = await schedule_agent.ainvoke({"messages": messages})
  
    final_output = result.get("structured_response") or result.get("output")
    
    if isinstance(final_output, ScheduleOutput):
        return final_output.model_dump()["tasks"]
    return final_output 

class TimePrediction(BaseModel):
    hours: int = Field(description="The predicted working hours as an integer")
    reasoning: str = Field(description="Short explanation why you chose this number") 

@opik.track(name="predict_working_time")
async def predict_working_time(name: str, description: str, cookies: dict):
    _, finished_tasks = await get_tasks(cookies)
    user_info = await get_user_info(cookies)

    input_data = {
        "new_task_name": name,
        "new_task_description": description,
        "finished_tasks": finished_tasks,
        "my_info": user_info
    }
    
    messages = [
        {"role": "system", "content": "You predict real working hours of task (an integer)."},
        {"role": "user", "content": f"Input Data: {json.dumps(input_data, ensure_ascii=False)}"}
    ]

    structured_llm = gemini_model.with_structured_output(TimePrediction)

    result = await structured_llm.ainvoke(messages)
    return result.hours
