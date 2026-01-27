const http = require('http');
const { fork } = require('child_process');
const path = require('path');

const service1 = fork(path.join(__dirname, '../management-services/server.js'), [], {
    env: { ...process.env, MODE: 'WEB', PORT: 3001 }
});

const service2 = fork(path.join(__dirname, '../ai-services/server.js'), [], {
    env: { ...process.env, MODE: 'WEB', PORT: 3002 }
});

const GATEWAY_PORT = 3000; //frontend call this port

const requestToService = (servicePort, clientReq, clientRes) => {
    const options = {
        hostname: 'localhost',
        port: servicePort,
        path: clientReq.url.replace('/api/manage', '/api').replace('/api/ai', '/api'), // Rewrite Path
        method: clientReq.method,
        headers: clientReq.headers,
    };

    const proxyReq = http.request(options, (proxyRes) => {
        clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(clientRes);
    });

    clientReq.pipe(proxyReq); // Chuyển luồng dữ liệu từ Client -> Service
    
    proxyReq.on('error', (e) => {
        console.error(e);
        clientRes.statusCode = 500;
        clientRes.end('Gateway Error');
    });
};

const server = http.createServer((req, res) => {
    // CORS Header (Để Frontend chạy port khác gọi được vào)
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    console.log(`[WEB-GATEWAY] ${req.method} ${req.url}`);

    if (req.url.startsWith('/api/manage')) {
        requestToService(3001, req, res); // Chuyển tiếp sang Service 1
    } else if (req.url.startsWith('/api/ai')) {
        requestToService(3002, req, res); // Chuyển tiếp sang Service 2
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
});

server.listen(GATEWAY_PORT, () => {
    console.log(`WEB GATEWAY listening at http://localhost:${GATEWAY_PORT}`);
});