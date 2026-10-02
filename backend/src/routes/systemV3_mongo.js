import { logger } from "../middlewares/logger.js";
import os from 'os'
import { Metric } from "../models/metrics.js";
import { Router } from 'express'

const router=Router()

const getCpuUsage=()=>{
    const cpus=os.cpus()
    let totalIdle=0
    let totalTick=0

    cpus.forEach((cpu)=>{
        for (const type in cpu.times){
            totalTick+=cpu.times[type]
        }
        totalIdle+=cpu.times.idle
    })
    
    return Math.round((((totalTick/cpus.length)-(totalIdle/cpus.length))/(totalTick/cpus.length))*100)
}

setInterval(async()=>{
    try{
        const memTotal=os.totalmem()
        const memFree=os.freemem()
        const memUsed=memTotal-memFree

        await Metric.create({
            cpuUsage:getCpuUsage(),
            memUsageMB:Math.round(memUsed/(1024*1024)),
            memPercentage:Math.round((memUsed/memTotal)*100)
        })
    }
    catch(err){
        logger.error(`Database ingestion error : ${err.message}`)
    }
},3000)

/**
 * @route   GET /api/system/metrics
 * @desc    Fetches latest 30 time-series data points from MongoDB
 */

router.get('/metrics',async(req,res,next)=>{
    try{
        const rawMetric=await Metric.find().sort({timestamp:-1}).limit(30).lean()

        const history=rawMetric.reverse()

        res.status(200).json({
            current:history[history.length-1]||null,
            history
        })
    }
    catch(err){
        logger.error(`Error in quering data from DB : ${err.message}`)
        next(err)
    }
})

/**
 * @route   GET /api/system/services
 * @desc    Simulates health checks & latency for connected microservices
 */
router.get('/services', (req, res) => {
  const services = [
    {
      id: 'auth-db',
      name: 'Authentication Database (PostgreSQL)',
      status: 'ONLINE',
      latencyMs: Math.floor(Math.random() * 15) + 5,
      lastChecked: new Date().toISOString(),
    },
    {
      id: 'cache-redis',
      name: 'Session Cache (Redis)',
      status: 'ONLINE',
      latencyMs: Math.floor(Math.random() * 5) + 1,
      lastChecked: new Date().toISOString(),
    },
    {
      id: 'payment-gateway',
      name: 'Stripe Payment Processor',
      status:
        Math.random() < 0.05
          ? 'OFFLINE'
          : Math.random() < 0.2
          ? 'DEGRADED'
          : 'ONLINE',
      latencyMs: Math.floor(Math.random() * 150) + 80,
      lastChecked: new Date().toISOString(),
    },
    {
      id: 'email-service',
      name: 'Notification Service (SendGrid)',
      status: 'ONLINE',
      latencyMs: Math.floor(Math.random() * 40) + 20,
      lastChecked: new Date().toISOString(),
    },
  ];

  res.status(200).json({
    totalServices: services.length,
    overallHealth: services.some((s) => s.status === 'OFFLINE')
      ? 'CRITICAL'
      : services.some((s) => s.status === 'DEGRADED')
      ? 'DEGRADED'
      : 'HEALTHY',
    services,
  })
})

export default router