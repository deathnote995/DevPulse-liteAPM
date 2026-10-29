import {create} from 'zustand'

export const useAppStore=create(set=>({
    isPollingActive:true,
    togglePolling:()=>set(state=>({isPollingActive:!state.isPollingActive})),

    pollingInterval:3000,
    setPollInterval:(interval)=>set({pollingInterval:interval}),
}))