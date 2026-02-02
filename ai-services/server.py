from fastapi import FastAPI, HTTPException
import httpx
from ai_services import organize_schedule, predict_working_time

app = FastAPI()

@app.get("/api/ai/schedule")
def generate_schedule():
    try:
        return organize_schedule()
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@app.get("api/ai/schedule")
def predict_working_time():
    try:
        return predict_working_time()
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    