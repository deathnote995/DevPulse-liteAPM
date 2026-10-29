import React from 'react';
import { useSystemMetrics, useSystemServices } from './hooks/useSystemData.js';
import MetricChart from './components/MetricsChart.jsx';
import { LogViewer } from './components/LogViewer.jsx';
import { useAppStore } from './store/appStore.js';

export default function App() {
  const { data: metricsData, isLoading: metricsLoading, isError: metricsError } = useSystemMetrics();
  const { data: servicesData, isLoading: servicesLoading } = useSystemServices();

  // Zustand State Actions
  const { isPollingActive, togglePolling } = useAppStore();

  if (metricsLoading || servicesLoading) {
    return <div style={{ padding: '2rem', color: '#fff' }}>Loading DevPulse APM Telemetry...</div>;
  }

  if (metricsError) {
    return (
      <div style={{ padding: '2rem', color: '#f87171' }}>
        Failed to connect to DevPulse API backend. Ensure backend is running on port 5000!
      </div>
    );
  }

  // Get current CPU usage to trigger warning banner
  const latestCpu = metricsData?.current?.cpuUsage || 0;

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', background: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      
      {/* HEADER & CONTROL BAR */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #1e293b', paddingBottom: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem' }}>DevPulse APM Dashboard</h1>
          <p style={{ margin: '0.25rem 0 0 0', color: '#94a3b8' }}>
            Overall System Health:{' '}
            <strong style={{ color: servicesData?.overallHealth === 'HEALTHY' ? '#4ade80' : '#f87171' }}>
              {servicesData?.overallHealth}
            </strong>
          </p>
        </div>

        {/* Zustand Global Controls */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {latestCpu > 80 && (
            <span style={{ background: '#7f1d1d', color: '#fca5a5', padding: '0.5rem 1rem', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.85rem' }}>
              ⚠️ High CPU Warning! ({latestCpu}%)
            </span>
          )}
          <button 
            onClick={togglePolling}
            style={{ 
              background: isPollingActive ? '#0284c7' : '#475569', 
              color: '#fff', 
              border: 'none', 
              padding: '0.5rem 1rem', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {isPollingActive ? '🟢 Live Streaming (Pause)' : '⏸️ Stream Paused (Resume)'}
          </button>
        </div>
      </header>

      {/* TIME-SERIES CHART */}
      <section style={{ marginBottom: '2rem' }}>
        <MetricChart history={metricsData?.history || []} />
      </section>

      {/* MONITORED SERVICES GRID */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Monitored Microservices</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {servicesData?.services.map((service) => (
            <div key={service.id} style={{ background: '#1e293b', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>{service.name}</h4>
              <p style={{ margin: '0.25rem 0' }}>
                Status:{' '}
                <span
                  style={{
                    fontWeight: 'bold',
                    color:
                      service.status === 'ONLINE'
                        ? '#4ade80'
                        : service.status === 'DEGRADED'
                        ? '#facc15'
                        : '#f87171',
                  }}
                >
                  {service.status}
                </span>
              </p>
              <p style={{ margin: '0.25rem 0', color: '#94a3b8', fontSize: '0.9rem' }}>Latency: {service.latencyMs}ms</p>
            </div>
          ))}
        </div>
      </section>

      {/* LIVE LOGS VIEWER */}
      <section>
        <LogViewer />
      </section>

    </div>
  );
}



// import MetricsChart from "./components/MetricsChart";
// import React from "react";
// import {useSystemMetrics, useSystemServices} from "./hooks/useSystemData.js";

// export default function App() {
//   const { data: metricsData, isLoading: metricsLoading, isError: metricsError } = useSystemMetrics();
//   const { data: servicesData, isLoading: servicesLoading } = useSystemServices();

//   if (metricsLoading || servicesLoading) return <div style={{ padding: '2rem' }}>Loading APM Telemetry...</div>;
//   if (metricsError) return <div style={{ padding: '2rem', color: 'red' }}>Failed to connect to DevPulse API backend.</div>;

//   return (
//     <div style={{ padding: '2rem', fontFamily: 'sans-serif', background: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
//       <header style={{ marginBottom: '2rem' }}>
//         <h1>DevPulse Dashboard</h1>
//         <p>Overall System Health: <strong style={{ color: servicesData?.overallHealth === 'HEALTHY' ? '#4ade80' : '#f87171' }}>{servicesData?.overallHealth}</strong></p>
//       </header>

//       {/* Time Series Chart */}
//       <section style={{ marginBottom: '2rem' }}>
//         <MetricsChart history={metricsData?.history || []} />
//       </section>

//       {/* Service Status List */}
//       <section>
//         <h2>Monitored Services</h2>
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
//           {servicesData?.services.map((service) => (
//             <div key={service.id} style={{ background: '#1e293b', padding: '1rem', borderRadius: '8px' }}>
//               <h4>{service.name}</h4>
//               <p>Status: <span style={{ fontWeight: 'bold', color: service.status === 'ONLINE' ? '#4ade80' : service.status === 'DEGRADED' ? '#facc15' : '#f87171' }}>{service.status}</span></p>
//               <p>Latency: {service.latencyMs}ms</p>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// }

// const App=()=>{
//   const {data:metricsData, isLoadnig:metricLoading, isError:metricError }=useSystemMetrics()
//   const {data:servicesData, isLoadnig:servicesLoading }=useSystemServices()

//   if(metricLoading||servicesLoading) return <div>Loading APM data....</div>
//   if(metricError) return <div>Failed to connect to devPulse backend API</div>

//   return(
//       <div>
//         <header>
//           <h1>DevPulse Dashboard</h1>
//           <p>Overall System Health </p>
//         </header>

//         <section>
//           <MetricChart history={metricsData?.history||[]}/>
//         </section>

//         <section>
//           <h2>Minitored Services</h2>
//           <div>
//             {servicesData?.services.map(service=>(
//               <div key={service.id}>
//                 <h4>{service.name}</h4>
//                 <p>Status:</p>
//                 <p>Latency:</p>
//               </div>
//             ))}
//           </div>
//         </section>
//       </div>
//   )
// }

// export default App