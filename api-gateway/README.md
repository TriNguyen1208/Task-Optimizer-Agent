- Dùng ngôn ngữ lập trình javascript
- Folder này dùng để nhận request từ frontend sau đó quyết định nên điều phối với services nào.

# Cách chạy:
- Trước hết, nhớ: `npm install find-my-way`
- Chạy: `docker-compose up`
- Chạy: 
    `node api-gateway/index.js` (khi chạy app)
hoặc `node api-gateway/web_index.js` (khi chạy web lúc code)

Chạy xong 2 cái trên là gửi API được, các API liệt kê như bên dưới

Management services:
# Tasks List
1. Get all tasks in tasks list
    GET /api/manage/task
Return:
    [
        {
            'id': int,
            'name': str,
            'description': str,
            'deadline': date,
            'working_time': int,
            'finished': bool,
            <!-- 'schedule': array[ [start_time, end_time], ... ] -->
        }
        ...
    ]

2. Get a specific task by id:
    GET /api/manage/tasks/{id}
Return:
    {
        'id': int,
        'name': str,
        'description': str,
        'deadline': date,
        'working_time': int
    }

3. Post a task to the tasks list:
    POST /api/manage/tasks
Return: 
    {
        'id': int,
        'name': str,
        'description': str,
        'deadline': datetime,
        'working_time': int,
        'finished': bool
    }

4. Edit a task:
    PATCH /api/manage/tasks/{id}
Required fields: 
    {
        'id': int,
        'name': str,
        'description': str,
        'deadline': datetime,
        'working_time': int,
        'finished': bool
    }

5. Delete a task:
    DELETE /api/manage/tasks/{id}
Return: 
    {
        'id': int,
        'name': str,
        'description': str,
        'deadline': datetime,
        'working_time': int,
        'finished': bool
    }

# Schedule
1. Get schedule of all tasks: 
    GET /api/manage/schedule
Return:
    [
        {
            'date': DATE,
            'start_time': time (hh:mm:ss),
            'end_time': time,
            'task_name': str
        },
        ...
    ]

2. Get schedule by id:
    GET /api/manage/schedule/by-id/{id}
Return:
    {
        'id': int,
        'date': date,
        'start_time': time,
        'end_time': time,
        'task_name': str
    }

3. Get schedule by date
    GET /api/manage/schedule/by-date/{date}
Return:
    [
        {
            'id': int,
            'date': date,
            'start_time': time,
            'end_time': time,
            'task_name': str
        },
        ...
    ]

4. Get schedule between start_date to end_date
    GET /api/manage/schedule/between-dates
    body: {start_date, end_date}
Return:
    [
        {
            'id': int,
            'date': date,
            'start_time': time,
            'end_time': time,
            'task_name': str
        },
        ...
    ]

5. Get schedule by task's id:
    GET /api/manage/schedule/by-task/{task_id}
Return:
    [
        {
            'id': int,
            'date': date,
            'start_time': time,
            'end_time': time,
            'task_name': str
        },
        ...
    ]

6. Update schedule
    PATCH /api/manage/schedule/{id}
    body: {date, start_time, end_time, task_id}
Return:
    {
        'id': int,
        'date': date,
        'start_time': time,
        'end_time': time,
        'task_name': str
    }

7. Add schedule
    POST /api/manage/schedule
    body: {date, start_time, end_time, task_id}
Return:
    {
        'id': int,
        'date': date,
        'start_time': time,
        'end_time': time,
        'task_name': str
    }

8. Delete schedule
    DELETE /api/manage/schedule/{id}
Return:
    {
        'id': int,
        'date': date,
        'start_time': time,
        'end_time': time,
        'task_name': str
    }