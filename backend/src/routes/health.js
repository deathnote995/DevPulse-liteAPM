import {Router} from 'express'
import {logger} from '../middlewares/logger.js'

const router=Router()

router.get('/health',(req,res)=>{
    const status={
        status:'UP',
        uptime:process.uptime,
        timestamp:new Date().toISOString()
    }
    logger.info('System health check completed successfully')
    res.status(200).json(status)
})

router.get('/health/error-test',(req,res,next)=>{
    try{
        throw new Error(('Data base connection timed out to make connection'))
    }
    catch(err){
        logger.error(`Health check failed with : ${err.message}`);
        next(err)
    }
})

export default router