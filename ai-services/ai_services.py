import json
import os
from datetime import datetime, date as date_type, time
from typing import List
from dotenv import load_dotenv
from pydantic import BaseModel, Field, field_validator
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.rate_limiters import InMemoryRateLimiter
import opik
from langchain_core.tools import tool
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from data_services import get_tasks, get_user_info, get_task_by_id, get_schedule
import re
load_dotenv()

class SingleTask(BaseModel):
    """Information of a schedule unit, including a task and the time to do the task"""
    date: date_type = Field(description="The date to do the task, with the format: YYYY-MM-DD")
    start_time: time = Field(description="The time to start doing the task, with format: HH:MM")
    end_time: time = Field(description="The time to stop doing the task, with format: HH:MM")
    task_id: int = Field(description="The task's id")

    @field_validator("date", mode="before")
    @classmethod
    def parse_date(cls, v):
        if isinstance(v, (datetime, date_type)):
            return v if isinstance(v, date_type) else v.date()
        
        if isinstance(v, str):
            match_iso = re.match(r'^(\d{4})-(\d{2})-(\d{2})', v)
            if match_iso:
                return date_type(int(match_iso.group(1)), int(match_iso.group(2)), int(match_iso.group(3)))
            
            for fmt in ("%Y-%m-%d", "%d/%m/%Y"):
                try:
                    return datetime.strptime(v, fmt).date()
                except ValueError:
                    continue
        return v

    @field_validator("start_time", "end_time", mode="before")
    @classmethod
    def parse_time(cls, v):
        if isinstance(v, (time, datetime)):
            return v if isinstance(v, time) else v.time()
        
        if isinstance(v, str):
            match = re.search(r'(\d{1,2}):(\d{2})', v)
            if match:
                return time(hour=int(match.group(1)), minute=int(match.group(2)))
        return v

class ScheduleOutput(BaseModel):
    tasks: List[SingleTask]

rate_limiter = InMemoryRateLimiter(requests_per_second=0.15)

gemini_model = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash", 
    temperature=0,
    rate_limiter=rate_limiter
)
def get_current_date():
    now = datetime.now()
    return now.strftime("%Y-%m-%d")

@tool
def get_weekday(date_str: str) -> str:
    """Return weekday of a date. Input date_str MUST be in YYYY-MM-DD format."""
    try:
        dt = datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        try:
            dt = datetime.strptime(date_str, "%d/%m/%Y")
        except ValueError:
            return "Invalid date format. Please use YYYY-MM-DD."
            
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

tools = [get_weekday]
llm_with_tools = gemini_model.bind_tools(tools)
structured_llm = llm_with_tools.with_structured_output(ScheduleOutput)
prompt = ChatPromptTemplate.from_messages([
    ("system", "{system_instruction}"),
    MessagesPlaceholder(variable_name="messages"),
])
schedule_chain = prompt | structured_llm

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
        - Dates: MUST be in 'YYYY-MM-DD' format ONLY (e.g., '2026-02-12'). Do not use 'DD/MM/YYYY'.
        - Times: MUST be in 'HH:MM' format (24-hour clock, e.g., 08:30, 15:45).
        - Consistency: Ensure start_time is always before end_time for the same task.
        - Structure: Your response must strictly follow the ScheduleOutput schema.
    """
    
    input_data = await get_data(cookies)
    input_data_str = json.dumps(input_data, ensure_ascii=False, indent=2)
    user_message = {
        "role": "user", 
        "content": f"Today is {get_current_date()}. Read information of me and my tasks, then generate appropriate schedule.\n"
                        f"My information and tasks: \n{input_data_str}\n"
    }

    result = await schedule_chain.ainvoke({
        "system_instruction": system_instruction,
        "messages": [user_message]
    })
    return result.tasks

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
        - Dates: MUST be in 'YYYY-MM-DD' format ONLY (e.g., '2026-02-12'). Do not use 'DD/MM/YYYY'.
        - Times: MUST be in 'HH:MM' format (24-hour clock, e.g., 08:30, 15:45).
        - Consistency: Ensure start_time is always before end_time for the same task.
        - Structure: Your response must strictly follow the ScheduleOutput schema.
        - Special values: Age = 0 and WorkingTime = 0 are default values, skip them if they are equal to 0.
    """
    
    input_data = await get_data_schedule_1_task(cookies, task_id)
    input_data_str = json.dumps(input_data, ensure_ascii=False, indent=2)
    user_message = {
        "role": "user", 
            "content": f"Today is {get_current_date()}. Read information of me, my new task, and my existed schedules, then generate appropriate schedule for my new task.\n"
                        f"My information and tasks: \n{input_data_str}\n"
    }

    result = await schedule_chain.ainvoke({
        "system_instruction": system_instruction,
        "messages": [user_message]
    })

    return result.tasks 

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