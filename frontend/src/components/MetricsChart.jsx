import React from "react";
import {LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

const MetricChart=({history})=>{
    return(
        <div>
            <h3>Live CPU Metrics</h3>
            <ResponsiveContainer>
                <LineChart data={history}>
                    <XAxis dataKey="timestamp"/>
                        <YAxis domain={[0,100]}/>
                            <Tooltip/>
                                <Line type={"monotone"} dataKey={"cpuUsage"} name="CPU %"/>
                                <Line type={"monotone"} dataKey={"memPercentage"} name="RAM %"/>
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default MetricChart