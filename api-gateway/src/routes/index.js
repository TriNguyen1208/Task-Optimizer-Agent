import {createProxyMiddleware} from 'http-proxy-middleware'
import services from '#@/configs/configs.services.js'

export default function setupRoute(app){
    app.use(
        createProxyMiddleware({
            target: services.ai.url,
            changeOrigin: true,
            pathRewrite: { "^/api/ai": "/api" }
        })
    )
    app.use(
        createProxyMiddleware({
            target: services.crud.url,
            changeOrigin: true,
            pathRewrite: { "^/api/crud": "/api"}
        })
    )
}