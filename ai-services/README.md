- Dùng ngôn ngữ lập trình python nha
# Dependencies
fastapi
uvicorn
pydantic
langchain
langchain-core
langchain-google-genai
python-dotenv
opik
google-generativeai

# Configure .env (tạo file .env trong thư mục ai-services/)
GOOGLE_API_KEY = ...
OPIK_API_KEY = ...

# Run AI server
cd ai-services
uvicorn server:app --port 3002

# APIs
1. Get schedule:
GET /api/schedule
Return:
    [
        {
            'date': date (yyyy/mm/dd)
            'start_time': time (hh:mm:ss)
            'end_time': time (hh:mm:ss)
            'task_id': int
        },
        ...
    ]

2. Predict working time
GET /api/working-time
Body: name (str), description (str)
Return: float