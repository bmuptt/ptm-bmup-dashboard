import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

export const useTheme = () => {
  const appStore = useAppStore()

  const primaryColor = computed(() => {
    return appStore.coreSetting?.primary_color || 'primary'
  })

  const secondaryColor = computed(() => {
    return appStore.coreSetting?.secondary_color || '#1E40AF'
  })

  const logo = computed(() => {
    return appStore.coreSetting?.logo || '/static/img/no_image.png'
  })

  const appName = computed(() => {
    return appStore.coreSetting?.name || '-'
  })

  const appDescription = computed(() => {
    return appStore.coreSetting?.description || ''
  })

  return {
    primaryColor,
    secondaryColor,
    logo,
    appName,
    appDescription
  }
}
