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