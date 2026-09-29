import morgan from 'morgan'
import winston from 'winston'

const levels={error:0, warn:1, info:2, http:3, debug:4}

const logFormat=winston.format.combine(
    winston.format.timestamp({format:'YYYY-MM-DD HH:mm:ss'}),
    winston.format.errors({stack:true}),
    winston.format.printf(({timestamp,level,message,stack})=>
        `[${timestamp}][${level.toUpperCase()}]: ${stack||message}`
    )
)

const transports=[
    new winston.transports.File(
        {
            filename:'logs/error.log',
            level:'error'
        }
    ),
    new winston.transports.File({
        filename:'logs/info.log',
        level:'http'
    }),
    new winston.transports.Console({
        format:winston.format.combine(
            winston.format.colorize({all:true}),
            logFormat
        )
    })
]

export const logger=winston.createLogger({
    level:process.env.NODE_ENV==='development'?'debug':'info',
    levels,
    format:logFormat,
    transports
})

const stream={
    write:(message)=>logger.http(message.trim())
}

const morganFormat=':method :url :status :res[content-length] - :response-time ms'

export const httpLogger=morgan(morganFormat,{stream})