import dns from 'dns'
dns.setServers(['8.8.8.8','8.8.4.4'])


import { logger, httpLogger } from "./middlewares/logger.js";
import healthRouter from "./routes/health.js"
import systemRouter from "./routes/systemV3_mongo.js"
import { connectDB } from "./config/db.js";
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

connectDB()

const app=express()
const PORT=process.env.PORT||5000

app.use(cors({
    origin:['http://localhost:5173'],
    methods:['GET','PUT','POST','DELETE']
}))

app.use(express.json())
app.use(httpLogger)

app.use('/api',healthRouter)
app.use('/api/system',systemRouter)

app.use((err,req,res,next)=>{
    res.status(err.status||500).json({
        message:err.message||'Internal server error'
    })
})

app.listen(PORT,()=>{
    logger.info(`DevPulse server running on PORT:${PORT}`)
})