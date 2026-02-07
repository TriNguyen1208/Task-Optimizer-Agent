import {createProxyMiddleware, fixRequestBody} from 'http-proxy-middleware'
import services from '#@/configs/configs.services.js'

export default function setupRoute(app){
    app.use(
        '/api/ai',
        createProxyMiddleware({
            target: 'http://localhost:3002',
            changeOrigin: true,
            secure: false, 
            ws: true,     
            pathRewrite: { "^/api/ai": "/api" },
            on: {
                proxyReq: (proxyReq, req, res) => {
                    fixRequestBody(proxyReq, req);
                    console.log("--- Gửi request đi thành công ---");
                },
                proxyRes: (proxyRes, req, res) => {
                    console.log("--- Nhận được phản hồi từ Service ---", proxyRes.statusCode);
                },
                error: (err, req, res) => {
                    console.error("--- Lỗi Proxy ---", err);
                }
            }
        })
    )
    app.use(
        '/api/crud',
        createProxyMiddleware({
            target: 'http://localhost:3001',
            changeOrigin: true,
            secure: false, 
            ws: true,     
            pathRewrite: { "^/api/crud": "/api" },
            on: {
                proxyReq: (proxyReq, req, res) => {
                    fixRequestBody(proxyReq, req); // Quan trọng nhất cho POST request
                    console.log("--- Gửi request đi thành công ---");
                },
                proxyRes: (proxyRes, req, res) => {
                    console.log("--- Nhận được phản hồi từ Service ---", proxyRes.statusCode);
                },
                error: (err, req, res) => {
                    console.error("--- Lỗi Proxy ---", err);
                }
            }
        })
    )
}