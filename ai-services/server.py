from fastapi import FastAPI, HTTPException
import httpx
from ai_services import organize_schedule, predict_working_time

app = FastAPI()

@app.get("/api/schedule/{user_id}")
async def schedule(user_id: int):
    try:
        result = await organize_schedule(user_id)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@app.get("/api/working-time/{user_id}")
async def working_time(name: str, description: str, user_id: int):
    try:
        result = await predict_working_time(name, description, user_id)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    