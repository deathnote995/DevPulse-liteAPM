import React from "react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const MetricChart = ({ history = [] }) => {
  return (
    // 1. Fixed height (300px) on wrapper div gives ResponsiveContainer dimensions to calculate!
    <div style={{ width: '100%', height: '300px', background: '#1e293b', padding: '1rem', borderRadius: '8px' }}>
      <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Live CPU & Memory Usage (%)</h3>
      
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={history}>
          {/* 2. Format ISO timestamp into a readable time string (e.g. "12:55:47") */}
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={(str) => {
              if (!str) return '';
              const date = new Date(str);
              return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            }}
            stroke="#94a3b8" 
          />
          <YAxis domain={[0, 100]} stroke="#94a3b8" />
          <Tooltip />
          
          <Line 
            type="monotone" 
            dataKey="cpuUsage" 
            stroke="#38bdf8" 
            name="CPU %" 
            strokeWidth={2} 
            isAnimationActive={false} 
          />
          <Line 
            type="monotone" 
            dataKey="memPercentage" 
            stroke="#a855f7" 
            name="RAM %" 
            strokeWidth={2} 
            isAnimationActive={false} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MetricChart;



// import React from "react";
// import {LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

// const MetricChart=({history})=>{
//     return(
//         <div>
//             <h3>Live CPU Metrics</h3>
//             <ResponsiveContainer>
//                 <LineChart data={history}>
//                     <XAxis dataKey="timestamp"/>
//                         <YAxis domain={[0,100]}/>
//                             <Tooltip/>
//                                 <Line type={"monotone"} dataKey={"cpuUsage"} name="CPU %"/>
//                                 <Line type={"monotone"} dataKey={"memPercentage"} name="RAM %"/>
//                 </LineChart>
//             </ResponsiveContainer>
//         </div>
//     )
// }

// export default MetricChart
