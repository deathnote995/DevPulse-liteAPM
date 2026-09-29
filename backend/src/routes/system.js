// import os from 'os'
// import { Router } from 'express'
// import { timeStamp } from 'console'

// const router=Router()

// router.get('/metrics',(req,res)=>{
//     const totalMem=os.totalmem()
//     const freeMem=os.freemem
//     const usedMem=totalMem-freeMem

//     const metrics={
//         cpuCount:os.cpus().length,
//         cpuModel:os.cpuModel()[0].model,
//         memory:{
//             totalMB:Math.round(totalMem/(1024*1024)),
//             usedMB:Math.round(usedMem/(1024*1024)),
//             freeMB:Math.round(freeMem/(1024*1024)),
//             usagePercentage:Math.round((usedMem/totalMem)*100)
//         },
//         systemUptimeSeconds:Math.round(os.uptime()),
//         nodeUptimeSeconds:Math.round(process.uptime()),
//         timeStamp:new Date().toISOString()
//     }

//     res.status(200).json(metrics)
// })

// export default router

import os, { arch, platform } from 'os'
import { Router } from 'express'
import { logger } from '../middlewares/logger.js'
import { table, timeStamp } from 'console'
import { toASCII } from 'punycode'
import { uptime } from 'process'

const router=Router()

const getCpuUsage=()=>{
    const cpus = os.cpus()
    let totalIdle=0
    let totalTick=0

    cpus.forEach((cpu)=>{
        for (const type in cpu.times){
            totalTick+=cpu.times[type]
        }
        totalIdle+=cpu.times.idle
    })

    const idle=totalIdle/cpus.length
    const total=totalTick/cpus.length
    const usagePercentage=Math.round(((total-idle)/total)*100)

    return usagePercentage
}

/**
 * @route   GET /api/system/metrics
 * @desc    Returns real-time host machine hardware metrics
 */

router.get('/metrics',(req,res)=>{
    const totalMem=os.totalmem()
    const freeMem=os.freemem()
    const usedMem=totalMem-freeMem

    const metrics={
        platform:os.platform(),
        arch:os.arch(),
        cpu:{
            model:os.cpus()[0]?.model||'Generic CPU',
            cores:os.cpus().length,
            usagePercentage:getCpuUsage()
        },
        memory:{
            totalMB:Math.round(totalMem/(1024*1024)),
            usedMB:Math.round(usedMem/(1024*1024)),
            freeMB:Math.round(freeMem/(1024*1024)),
            usagePercentage:Math.round((usedMem/totalMem)*100)
        },
        uptime:{
            systemSeconds:Math.round(os.uptime()),
            processSeconds:Math.round(process.uptime())
        },
        timeStamp:new Date().toISOString()
    }

    logger.info("System metrics requested")
    res.status(200).json(metrics)
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