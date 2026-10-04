import MetricChart from "./components/MetricsChart";
import React from "react";
import {useSystemMetrics, useSystemServices} from "./hooks/useSystemData.js";

const App=()=>{
  const {data:metricsData, isLoadnig:metricLoading, isError:metricError }=useSystemMetrics()
  const {data:servicesData, isLoadnig:servicesLoading }=useSystemServices()
}