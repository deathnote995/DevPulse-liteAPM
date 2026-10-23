import { useQuery } from "@tanstack/react-query";
import {getMetrics, getServiceStatus} from '../api/systemApi.js'

export const useSystemMetrics=()=> {
    return useQuery({
        queryKey:['system-metrics'],
        queryFn:getMetrics,
        refetchInterval:3000
    })
}

export const useSystemServices=()=>{
    return useQuery({
        queryKey:['system-services'],
        queryFn:getServiceStatus,
        refetchInterval:5000
    })
}

// export {useSystemMetrics,useSystemServices}