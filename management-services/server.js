const initTaskRoutes = require('./routes/taskRoutes');
const initScheduleRoutes = require('./routes/scheduleRoutes')
const initDatabase = require('./db/init');

const router = require('find-my-way')({
    defaultRoute: (req, res) => {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Route not found' }));
    }
});

const adapt = (controllerFn) => {
    return (req, res, params) => {
        req.params = params || {}; 
        return controllerFn(req, res);
    };
};

// Init 
initDatabase()
initTaskRoutes(router, adapt);
initScheduleRoutes(router, adapt);

// Adapter: ICP -> HTTP
process.on('message', async (msg) => {
    const { id, path, method, payload } = msg;

    const req = {
        method: method,
        url: path,
        body: payload || {},
        headers: {}
    };

    const res = {
        statusCode: 200,
        headers: {},

        json: (data) => {
            process.send({ id, data, statusCode: res.statusCode });
        },

        status: (code) => {
            res.statusCode = code;
            return res; 
        },

        send: (data) => {
            process.send({ id, data, statusCode: res.statusCode });
        },
        end: (data) => {
            process.send({ id, data, statusCode: res.statusCode });
        }
    };

    router.lookup(req, res);
});

console.log('Service 1 started with optimized Router');

// FOR website (just for implementation phase)-------------------------------------------------------
const http = require('http');
if (process.env.MODE === 'WEB') {
    const PORT = process.env.PORT || 3001; 
    const server = http.createServer((req, res) => {
        let body = [];
        req.on('data', (chunk) => body.push(chunk));
        req.on('end', () => {
            const bodyStr = Buffer.concat(body).toString();
            req.body = bodyStr ? JSON.parse(bodyStr) : {};
            
            res.json = (data) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
            };
            res.status = (code) => {
                res.statusCode = code;
                return res;
            }
            res.send = res.end; 

            router.lookup(req, res);
        });
    });

    server.listen(PORT, () => {
        console.log(`Service running in WEB MODE on port ${PORT}`);
    });
} else {
    console.log('Service running in ELECTRON MODE (IPC)');
}