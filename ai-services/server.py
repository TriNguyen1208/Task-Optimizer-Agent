from fastapi import FastAPI, HTTPException
import httpx
from ai_services import organize_schedule, predict_working_time

app = FastAPI()

@app.get("/api/schedule")
def schedule():
    try:
        return organize_schedule()
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@app.get("api/working-time")
def working_time(name: str, description: str):
    try:
        return predict_working_time(name, description)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    