import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLocationStore = defineStore('location', () => {
  const region = ref('berlin')

  const setRegion = (next: string) => {
    region.value = next
  }

  return { region, setRegion }
})
