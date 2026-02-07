import jwt
import os
from dotenv import load_dotenv
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from pydantic import BaseModel
# Import từ file của bạn
from ai_services import organize_schedule, predict_working_time

# Load environment variables
load_dotenv()
ACCESS_SECRET = os.getenv("ACCESS_SECRET")
class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # 2. Lấy accessToken từ Cookie
        token = request.cookies.get("accessToken")

        if not token:
            return JSONResponse(
                status_code=401,
                content={"message": "Bạn chưa đăng nhập (Thiếu token)"}
            )

        try:
            # 3. Decode và Verify token
            # PyJWT sẽ tự check thời hạn (exp) nếu trong token có trường đó
            payload = jwt.decode(token, ACCESS_SECRET, algorithms=["HS256"])
            
            # Lưu thông tin user vào request để dùng ở các Route bên dưới
            request.state.user = payload
            
        except jwt.ExpiredSignatureError:
            return JSONResponse(status_code=403, content={"message": "Token đã hết hạn"})
        except jwt.InvalidTokenError:
            return JSONResponse(status_code=403, content={"message": "Token không hợp lệ"})
        except Exception as e:
            return JSONResponse(status_code=500, content={"message": f"Lỗi hệ thống: {str(e)}"})

        return await call_next(request)

app = FastAPI()

# Kích hoạt Middleware
app.add_middleware(AuthMiddleware)

# 1. Định nghĩa cấu trúc dữ liệu gửi lên
class WorkingTimeRequest(BaseModel):
    name: str
    description: str

@app.post("/working-time")
async def working_time(data: WorkingTimeRequest, request: Request):
    try:
        cookies = request.cookies
        result = await predict_working_time(data.name, data.description, cookies)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/schedule")
async def schedule(request: Request):
    try:
        cookies = request.cookies
        result = await organize_schedule(cookies=cookies)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))