import { logger } from '../middlewares/logger.js'
import mongoose from 'mongoose'

export const connectDB=async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_URI)
        logger.info(`Connected to MongoDB : ${conn.connection.host}`)
    }
    catch(err){
        logger.error(`Error in connecting to Mongo : ${err.message}`)
        process.exit(1)
    }
}