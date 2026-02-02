import httpx

OTHER_SERVICE_URL = "https://localhost:3001/api/manage"

async def get_tasks():
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{OTHER_SERVICE_URL}/task",
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

async def get_user_info():
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{OTHER_SERVICE_URL}/info",
            timeout=5.0
        )
        resp.raise_for_status()
        return resp.json()