import httpx
from fastapi import Request
OTHER_SERVICE_URL = "http://localhost:3001"

async def get_tasks(cookies):
    async with httpx.AsyncClient(cookies=cookies) as client:
        resp = await client.get(
            f"{OTHER_SERVICE_URL}/task/tasks",
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

async def get_user_info(cookies):
    async with httpx.AsyncClient(cookies=cookies) as client:
        resp = await client.get(
            f"{OTHER_SERVICE_URL}/info",
            timeout=5.0
        )
        resp.raise_for_status()
        data = resp.json()
        return data