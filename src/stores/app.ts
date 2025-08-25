// Utilities
import type { IResProfile } from '@/model/auth-interface'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    profileGlobal: null as IResProfile | null
  }),

  actions: {
    addProfileGlobal(data: IResProfile | null) {
      this.profileGlobal = data
    },
  },
})
