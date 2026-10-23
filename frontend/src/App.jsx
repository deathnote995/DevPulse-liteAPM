import MetricsChart from "./components/MetricsChart";
import React from "react";
import {useSystemMetrics, useSystemServices} from "./hooks/useSystemData.js";

export default function App() {
  const { data: metricsData, isLoading: metricsLoading, isError: metricsError } = useSystemMetrics();
  const { data: servicesData, isLoading: servicesLoading } = useSystemServices();

  if (metricsLoading || servicesLoading) return <div style={{ padding: '2rem' }}>Loading APM Telemetry...</div>;
  if (metricsError) return <div style={{ padding: '2rem', color: 'red' }}>Failed to connect to DevPulse API backend.</div>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', background: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1>DevPulse Dashboard</h1>
        <p>Overall System Health: <strong style={{ color: servicesData?.overallHealth === 'HEALTHY' ? '#4ade80' : '#f87171' }}>{servicesData?.overallHealth}</strong></p>
      </header>

      {/* Time Series Chart */}
      <section style={{ marginBottom: '2rem' }}>
        <MetricsChart history={metricsData?.history || []} />
      </section>

      {/* Service Status List */}
      <section>
        <h2>Monitored Services</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {servicesData?.services.map((service) => (
            <div key={service.id} style={{ background: '#1e293b', padding: '1rem', borderRadius: '8px' }}>
              <h4>{service.name}</h4>
              <p>Status: <span style={{ fontWeight: 'bold', color: service.status === 'ONLINE' ? '#4ade80' : service.status === 'DEGRADED' ? '#facc15' : '#f87171' }}>{service.status}</span></p>
              <p>Latency: {service.latencyMs}ms</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

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