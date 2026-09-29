import { logger, httpLogger } from "./middlewares/logger.js";
import healthRouter from "./routes/health.js"
import systemRouter from "./routes/system.js"
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

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