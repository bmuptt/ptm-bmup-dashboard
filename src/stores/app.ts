// Utilities
import type { IResProfile } from '@/model/auth-interface'
import type { ICoreSetting } from '@/model/core-setting-interface'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    profileGlobal: null as IResProfile | null,
    coreSetting: null as ICoreSetting | null
  }),

  actions: {
    addProfileGlobal(data: IResProfile | null) {
      this.profileGlobal = data
    },
    addCoreSetting(data: ICoreSetting | null) {
      this.coreSetting = data
    },
  },
})
