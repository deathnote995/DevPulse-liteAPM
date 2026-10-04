import { useQuery } from "@tanstack/react-query";
import {getMetrics, getServiceStatus} from '../api/systemApi.js'

const useSystemMetrics=()=> {
    return useQuery({
        queryKey:['system-metrics'],
        queryFn:getMetrics,
        refetchInterval:3000
    })
}

const useSystemServices=()=>{
    return useQuery({
        queryKey:['system-services'],
        queryFn:getServiceStatus,
        refetchInterval:5000
    })
}

export default {useSystemMetrics,useSystemServices}