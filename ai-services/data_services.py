import httpx

OTHER_SERVICE_URL = "http://localhost:3001/api"

async def get_tasks(user_id: int):
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{OTHER_SERVICE_URL}/task/{user_id}",
            timeout=5.0
        )
        resp.raise_for_status()
        
        data = resp.json()
        unfinished_tasks = []
        finished_tasks = []
        for t in data["tasks"]:
            if (t["finished"] == True): finished_tasks.append(t)
            else: unfinished_tasks.append(t)
        
        return unfinished_tasks, finished_tasks

async def get_user_info(user_id: int):
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{OTHER_SERVICE_URL}/info/{user_id}",
            timeout=5.0
        )
        resp.raise_for_status()
        return resp.json()["data"]