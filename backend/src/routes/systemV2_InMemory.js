import { Router } from "express"
import os from 'os'
import { logger } from "../middlewares/logger.js"

const router=Router()

const METRIC_HISTORY_LIMIT=20
const metricHistoryBuffer=[]

const getCpuUsage=()=>{
    const cpus=os.cpus()
    let totalTick=0
    let totalIdle=0

    cpus.forEach(cpu => {
        for(const type in cpu.times){
            totalTick+=cpu.times[type]
        }
        totalIdle+=cpu.times.idle
    });

    const idle=totalIdle/cpus.length
    const total=totalTick/cpus.length
    const cpuUsagePercentage=Math.round(((total-idle)/total)*100)

    return cpuUsagePercentage
}

setInterval(()=>{
    const totalMem=os.totalmem()
    const freeMem=os.freemem()
    const usedMem=totalMem-freeMem

    const sample={
        timestamp:new Date().toLocaleTimeString(),
        cpuUsage:getCpuUsage(),
        memUsageMB:Math.round(usedMem/(1024*1024)),
        useMemPercentage:Math.round((usedMem/totalMem)*100)
    }

    metricHistoryBuffer.push(sample)

    if(metricHistoryBuffer.length>METRIC_HISTORY_LIMIT)
        metricHistoryBuffer.shift()
},3000)

/**
 * @route GET /api/system/metrics
 * @desc Returns historical metric time-series for UI charting
 */

router.get('/metrics',(req,res)=>{
    logger.info("System metrics requested")
    logger.info(metricHistoryBuffer)
    res.status(200).json({
        current:metricHistoryBuffer[metricHistoryBuffer.length-1]||null,
        history:metricHistoryBuffer
    })
})

/**
 * @route   GET /api/system/services
 * @desc    Simulates health checks & latency for connected microservices
 */

router.get('/services',(req,res)=>{
    const services=[
        {
            id:'auth-db',
            name:'Authentication Database (PostgreSql)',
            status:'ONLINE',
            latencyMs:Math.floor(Math.round*5)+1,
            lastChecked:new Date().toISOString()
        },
        {
            id: 'cache-redis',
            name: 'Session Cache (Redis)',
            status: 'ONLINE',
            latencyMs: Math.floor(Math.random() * 5) + 1, // 1-6ms
            lastChecked: new Date().toISOString(),
        },
        {
            id: 'payment-gateway',
            name: 'Stripe Payment Processor',
            // Randomly simulate DEGRADED status ~20% of the time for testing UI alerts
            status: Math.random() > 0.8 ? 'DEGRADED' : 'ONLINE',
            latencyMs: Math.floor(Math.random() * 150) + 80, // 80-230ms
            lastChecked: new Date().toISOString(),
        },
        {
            id: 'email-service',
            name: 'Notification Service (SendGrid)',
            status: 'ONLINE',
            latencyMs: Math.floor(Math.random() * 40) + 20,
            lastChecked: new Date().toISOString(),
        }
    ]

    logger.info("Service status health check executed")
        res.status(200).json({
            totalServices:services.length,
            overallHealth:services.some(s=>s.status==='OFFLINE')
            ?'CRITICAL':services.some(s=>s.status==='DEGRADED')
            ?'DEGRADED':'HEALTHY',
            services
        })
})

export default router