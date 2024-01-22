import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface BearState {
  bears: number
  increase: (by: number) => void
  startHour: {
    hour: number
    minute: number
  }
  endHour: {
    hour: number
    minute: number
  }
  step: number
  setStartHour: (hour: number, minute: number) => void
  setEndHour: (hour: number, minute: number) => void
  setStep: (step: number) => void
}

export const useSettingsStore = create<BearState>()(
  persist(
    (set) => ({
      startHour: {
        hour: 6,
        minute: 0
      },
      endHour: {
        hour: 20,
        minute: 0
      },
      step: 30,
      bears: 0,
      increase: (by) => set((state) => ({ bears: state.bears + by })),
      setStartHour: (hour, minute) => set(() => ({ startHour: { hour: hour, minute: minute } })),
      setEndHour: (hour, minute) => set(() => ({ endHour: { hour: hour, minute: minute } })),
      setStep: (step) => set(() => ({ step: step }))
    }),
    {
      name: 'bear-storage'
    }
  )
)
