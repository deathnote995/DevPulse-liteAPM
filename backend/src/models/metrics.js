import mongoose from "mongoose";

const metricSchema=new mongoose.Schema(
    {
        timestamp:{
            type:Date,
            default:Date.now,
            expires:'1d'
        },
        cpuUsage:{
            type:Number,
            required:true
        },
        memUsageMB:{
            type:Number,
            required:true
        },
        memPercentage:{
            type:Number,
            required:true
        }
    },
    {
        timeseries:{
            timeField:'timestamp',
            granularity:'seconds'
        }
    }
)

export const Metric=mongoose.model('Metric',metricSchema)