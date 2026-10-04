const baseUrl='http://localhost:5000/api'

const getMetrics=async()=>{
    const response=await fetch(`${baseUrl}/system/metrics`)
    if(!response.ok)
        throw new Error('Error in fetching system metrics from server')
    const data=await response.json()
    return data
}

const getServiceStatus=async()=>{
    const response=await fetch(`${baseUrl}/system/services`)
    if(!response.ok)
        throw new Error('Error in fetching service status from server')
    return await response.json()
}

export default {getMetrics,getServiceStatus}