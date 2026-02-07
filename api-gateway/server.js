import app from '#@/app.js'
import 'dotenv/config'

const PORT = process.env.PORT || 8080

app.listen(PORT, async () => {
    console.log(`Connected api gateway successfully in port ${PORT}`)
})