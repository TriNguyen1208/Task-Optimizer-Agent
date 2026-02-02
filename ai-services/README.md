- Dùng ngôn ngữ lập trình python nha

# APIs
1. Get schedule:
GET /api/schedule
Return:
    [
        {
            'date': 
            'start_time':
            'end_time':
            'task_id': int
        },
        ...
    ]

2. Predict working time
GET /api/working-time
Body: name (str), description (str)
Return: float