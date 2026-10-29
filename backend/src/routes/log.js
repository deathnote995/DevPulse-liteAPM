import express from 'express';
import fs from 'fs';
import path from 'path';
import { logger } from '../middlewares/logger.js';

const router=express.Router()

router.get('/logs',(req,res)=>{
    try{
        const logFilePath=path.join(process.cwd(),'logs','info.log')

        if(!fs.existsSync(logFilePath))
            return res.json({logs:['No log file found yet, Trigger some traffic!']})

        const logData=fs.readFileSync(logFilePath,'utf-8')
        const logLines=logData.trim().split('\n').slice(-50)

        res.json({logs:logLines})
    }
    catch(err){
        logger.error(`Failed to read log file : ${err.message}`)
        res.status(500).json({error:'Failed to read log file'})
    }
})

export default router