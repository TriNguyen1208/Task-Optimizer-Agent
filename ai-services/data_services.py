import httpx
from fastapi import Request
import os

if os.getenv("NODE_ENV") == 'production':
    CURD_SERVICE_URL = os.getenv("CRUD_SERVICE_PRO")
else:
    CURD_SERVICE_URL = os.getenv("CRUD_SERVICE_DEV")
    
async def get_tasks(cookies):
    async with httpx.AsyncClient(cookies=cookies) as client:
        resp = await client.get(
            f"{CURD_SERVICE_URL}/task/tasks",
            timeout=5.0
        )
        resp.raise_for_status()
        
        data = resp.json()
        unfinished_tasks = []
        finished_tasks = []
        for t in data:
            if (t["finished"] == True): finished_tasks.append(t)
            else: unfinished_tasks.append(t)
        return unfinished_tasks, finished_tasks

async def get_task_by_id(cookies, id):
    async with httpx.AsyncClient(cookies=cookies) as client:
        resp = await client.get(
            f"{CURD_SERVICE_URL}/task/{id}",
            timeout=5.0
        )
        resp.raise_for_status()
        return resp.json()
    
async def get_schedule(cookies):
    async with httpx.AsyncClient(cookies=cookies) as client:
        resp = await client.get(
            f"{CURD_SERVICE_URL}/schedule",
            timeout=5.0
        )
        resp.raise_for_status()
        return resp.json()

async def get_user_info(cookies):
    async with httpx.AsyncClient(cookies=cookies) as client:
        resp = await client.get(
            f"{CURD_SERVICE_URL}/info",
            timeout=5.0
        )
        resp.raise_for_status()
        data = resp.json()
        return data