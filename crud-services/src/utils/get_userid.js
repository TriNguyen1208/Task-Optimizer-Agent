import 'dotenv/config'
import jwt from 'jsonwebtoken'

export default function getUserId(req){
    const { accessToken } = req.cookies
    if (!accessToken) {
        return null
    }
    const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET);
    const id = decoded.user_id;
    return id
}