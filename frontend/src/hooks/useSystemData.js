import { useQuery } from "@tanstack/react-query";
import {getMetrics, getServiceStatus, getLogs} from '../api/systemApi.js'
import { useAppStore } from "../store/appStore.js";

export const useSystemMetrics=()=> {
    const isPollingActive=useAppStore(state=>state.isPollingActive)
    const pollInterval=useAppStore(state=>state.pollingInterval)

    return useQuery({
        queryKey:['system-metrics'],
        queryFn:getMetrics,
        refetchInterval:isPollingActive?pollInterval:false
    })
}

export const useSystemServices=()=>{
    const isPollingActive=useAppStore(state=>state.isPollingActive)

    return useQuery({
        queryKey:['system-services'],
        queryFn:getServiceStatus,
        refetchInterval:isPollingActive?5000:false
    })
}

export const useSystemLogs=()=>{
    const isPollingActive=useAppStore(state=>state.isPollingActive)

    return useQuery({
        queryKey:['system-logs'],
        queryFn:getLogs,
        refetchInterval:isPollingActive?4000:false
    })
}

// export {useSystemMetrics,useSystemServices}