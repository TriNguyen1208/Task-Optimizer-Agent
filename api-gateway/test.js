// test-integration.js
const { fork } = require('child_process');
const path = require('path');

// 1. Khởi tạo Service 1 (giống hệt cách API Gateway làm)
// Lưu ý: Trỏ đúng vào file server.js mới mà bạn đã sửa
const servicePath = path.join(__dirname, '../management-services/server.js');
const service1 = fork(servicePath);

console.log('🚀 Starting Integration Test...');

// 2. Hàm tiện ích để gửi request và đợi kết quả
const sendRequest = (method, endpoint, body = {}) => {
    return new Promise((resolve, reject) => {
        const requestId = `TEST-${Date.now()}`;
        
        // Lắng nghe phản hồi (Dùng once để nghe 1 lần rồi thôi)
        const listener = (msg) => {
            if (msg.id === requestId) {
                // Remove listener để tránh memory leak nếu test nhiều
                service1.off('message', listener);
                resolve(msg);
            }
        };

        service1.on('message', listener);

        // Gửi message xuống Service 1
        
        console.log(`\n[SENDING] ${method} ${endpoint}`);
        endpoint = endpoint.replace('/api/manage', '/api');
        service1.send({
            id: requestId,
            path: endpoint,    
            method: method,
            payload: body
        });
    });
};

const runTasksTests = async () => {
    try {
        // TEST 1: Get all tasks
        const res1 = await sendRequest('GET', '/api/manage/tasks/');
        console.log('[RESPONSE 1]:', JSON.stringify(res1.data, null, 2));

        // TEST 2: Create a task
        const newTask = {
            name: "Test from Node Script",
            working_time: 150,
            finished: false
        };
        const res2 = await sendRequest('POST', '/api/manage/tasks/', newTask);
        console.log('[RESPONSE 2]:', res2.data);
        
        if (res2.data && res2.data.task) {
            const newId = res2.data.task.id;

            // TEST 3: Update task
            console.log(`\n--- 3. UPDATE (PATCH) ID: ${newId} ---`);
            const updateData = {
                name: "Updated Name", 
                working_time: 20,            
                finished: true                 
            };
            
            const res3 = await sendRequest('PATCH', `/api/manage/tasks/${newId}`, updateData);
            console.log('[RESPONSE 3]:', res3.data);

            // TEST 4: Delete task
            console.log(`\n--- 4. DELETE ID: ${newId} ---`);
            const res4 = await sendRequest('DELETE', `/api/manage/tasks/${newId}`);
            console.log('[RESPONSE 4]:', res4.data);
        }

    } catch (error) {
        console.error('Test Failed:', error);
    } finally {
        // Test xong thì kill process con để thoát
        console.log('Tests finished successfully. Killing service.');
        service1.kill();
        process.exit(0);
    }
};

// Đợi 1 chút cho DB connect rồi chạy test
const runScheduleTests = async () => {
    let taskId = null;
    let scheduleId = null;

    try {
        console.log('\n--- BƯỚC 1: TẠO TASK GIẢ (Để lấy ID) ---');
        const taskRes = await sendRequest('POST', '/api/manage/tasks/', {
            name: "Task for Schedule Routing Test",
            working_time: 60
        });
        
        if (!taskRes.data || !taskRes.data.task) {
            throw new Error("Không tạo được Task, dừng test.");
        }
        taskId = taskRes.data.task.id;
        console.log(`✅ Created Task ID: ${taskId}`);

        // ---------------------------------------------------------

        console.log('\n--- BƯỚC 2: TẠO SCHEDULE (POST) ---');
        const newSchedule = {
            date: "2024-05-20",
            start_time: "08:00",
            end_time: "10:00",
            task_id: taskId
        };
        const schedRes = await sendRequest('POST', '/api/manage/schedule/', newSchedule);
        console.log('[RESPONSE CREATE]:', schedRes.data);
        
        if (schedRes.data && schedRes.data.task) {
             scheduleId = schedRes.data.task.id;
        } else {
             throw new Error("Không tạo được Schedule.");
        }

        // ---------------------------------------------------------

        console.log(`\n--- BƯỚC 3: GET BY ID (${scheduleId}) ---`);
        // Route của bạn: /api/schedule/by-id/:id
        const resById = await sendRequest('GET', `/api/manage/schedule/by-id/${scheduleId}`);
        console.log('[RESPONSE GET BY ID]:', resById.data);

        // ---------------------------------------------------------

        console.log(`\n--- BƯỚC 4: GET BY DATE (2024-05-20) ---`);
        // Route của bạn: /api/schedule/by-date/:date
        // Lưu ý: Date nằm trên URL
        const resByDate = await sendRequest('GET', `/api/manage/schedule/by-date/2024-05-20`);
        console.log('[RESPONSE GET BY DATE]:', resByDate.data);

        // ---------------------------------------------------------

        console.log(`\n--- BƯỚC 5: GET BY TASK ID (${taskId}) ---`);
        // Route của bạn: /api/schedule/by-task/:task_id
        const resByTask = await sendRequest('GET', `/api/manage/schedule/by-task/${taskId}`);
        console.log('[RESPONSE GET BY TASK]:', resByTask.data);

        // ---------------------------------------------------------
        
        console.log(`\n--- BƯỚC 6: GET BETWEEN DATES ---`);
        // Route của bạn: /api/schedule/between-dates/
        // Hàm này controller cũ của bạn dùng req.body, nên ta gửi payload
        const resBetween = await sendRequest('GET', `/api/manage/schedule/between-dates/`, {
            from_date: "2024-05-19",
            to_date: "2024-05-21"
        });
        console.log('[RESPONSE BETWEEN]:', resBetween.data);

        // ---------------------------------------------------------

        console.log(`\n--- BƯỚC 7: DELETE SCHEDULE ID ${scheduleId} ---`);
        // Route: DELETE /api/schedule/:id
        const delRes = await sendRequest('DELETE', `/api/manage/schedule/${scheduleId}`);
        console.log('[RESPONSE DELETE]:', delRes.data);

    } catch (err) {
        console.error('❌ Test Failed:', err);
    } finally {
        // Dọn dẹp: Xóa task giả
        if (taskId) {
            console.log(`\n--- CLEANUP: Deleting Task ID ${taskId} ---`);
            await sendRequest('DELETE', `/api/manage/tasks/${taskId}`);
        }
        
        console.log('\n🏁 Tests finished. Killing service.');
        service1.kill();
        process.exit(0);
    }
};

// Gọi hàm chạy test
setTimeout(runTasksTests, 1000);