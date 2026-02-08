import {createProxyMiddleware, fixRequestBody} from 'http-proxy-middleware'
import services from '#@/configs/configs.services.js'

export default function setupRoute(app){
    app.use(
        '/api/ai',
        createProxyMiddleware({
            target: services.ai.url,
            changeOrigin: true,
            secure: false, 
            ws: true,     
            pathRewrite: { "^/api/ai": "/api" },
            on: {
                proxyReq: (proxyReq, req, res) => {
                    fixRequestBody(proxyReq, req);
                    console.log("Send request successfully");
                },
                proxyRes: (proxyRes, req, res) => {
                    console.log("Received a response from the service", proxyRes.statusCode);
                },
                error: (err, req, res) => {
                    console.error("Proxy error", err);
                }
            }
        })
    )
    app.use(
        '/api/crud',
        createProxyMiddleware({
            target: services.crud.url,
            changeOrigin: true,
            secure: false, 
            ws: true,     
            pathRewrite: { "^/api/crud": "/api" },
            on: {
                proxyReq: (proxyReq, req, res) => {
                    fixRequestBody(proxyReq, req);
                    console.log("Send request successfully");
                },
                proxyRes: (proxyRes, req, res) => {
                    console.log("Received a response from the service", proxyRes.statusCode);
                },
                error: (err, req, res) => {
                    console.error("Proxy error", err);
                }
            }
        })
    )
}