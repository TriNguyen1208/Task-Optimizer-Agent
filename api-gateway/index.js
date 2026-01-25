const { ipcMain } = require('electron');
const { fork } = require('child_process');
const path = require('path');

const service1 = fork(path.join(__dirname, '../management-services/server.js')); 
const service2 = fork(path.join(__dirname, '../ai-services/server.js')); 

const pendingRequests = new Map();

const REQUEST_TIMEOUT = 10000;

const setupServiceListener = (service, serviceName) => {
    service.on('message', (response) => {
        // response: { id, data, error, statusCode }
        const request = pendingRequests.get(response.id);
        
        if (request) {
            clearTimeout(request.timeoutId);

            if (response.error) {
                request.reject(new Error(`[${serviceName}] ${response.error}`));
            } else {
                request.resolve({
                    data: response.data,
                    statusCode: response.statusCode || 200
                });
            }
            pendingRequests.delete(response.id);
        }
    });

    service.on('error', (err) => {
        console.error(`[${serviceName}] Crashed:`, err);
        // Có thể thêm logic restart service tại đây nếu cần
    });
};

setupServiceListener(service1, 'Service1-Management');
setupServiceListener(service2, 'Service2-AI');

// Routing
ipcMain.handle('request-to-service', async (event, args) => {
    const { url, payload, method } = args;

    const pathStr = url;
    const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return new Promise((resolve, reject) => {
        // A. Thiết lập Timeout (Chống treo app)
        const timeoutId = setTimeout(() => {
            if (pendingRequests.has(requestId)) {
                pendingRequests.delete(requestId);
                reject(new Error('Gateway Timeout: Service did not respond in time.'));
            }
        }, REQUEST_TIMEOUT);

        pendingRequests.set(requestId, { resolve, reject, timeoutId });

        // B. Xử lý URL
        const messagePacket = { 
            id: requestId, 
            method, 
            payload,
            path: pathStr 
        };

        // C. Điều hướng (Routing) & Rewrite Path
        // CASE 1: Service Management (/api/manage/...)
        if (pathStr.startsWith('/api/manage')) {
            messagePacket.path = pathStr.replace('/api/manage', '/api');  
            service1.send(messagePacket);
        } 
        
        // CASE 2: Service AI (/api/ai/...)
        else if (pathStr.startsWith('/api/ai')) {
            messagePacket.path = pathStr.replace('/api/ai', '/api');
            service2.send(messagePacket);
        } 
        
        // CASE 3: 404 Not Found
        else {
            clearTimeout(timeoutId);
            pendingRequests.delete(requestId);
            reject(new Error(`Gateway Error: No service found for path ${pathStr}`));
        }
    });
});