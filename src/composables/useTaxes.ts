import { onMounted, ref } from 'vue'
import { fetchCityTax, fetchBrokerTax } from '@/api/graphql'
import { useLocationStore } from '@/stores/location'

export function useTaxes() {
  const location = useLocationStore()

  const brokerTax = ref(0.0714)
  const cityTax = ref(0.06)

  const taxesLoading = ref(false)
  const taxesError = ref<string | null>(null)

  const load = async () => {
    taxesLoading.value = true
    taxesError.value = null

    try {
      const region = location.region
      const [c, b] = await Promise.all([fetchCityTax(region), fetchBrokerTax(region, false)])
      cityTax.value = c
      brokerTax.value = b
    } catch (e: unknown) {
      taxesError.value = e instanceof Error ? e.message : 'Failed to load taxes'
    } finally {
      taxesLoading.value = false
    }
  }

  onMounted(() => {
    void load()
  })

  return { brokerTax, cityTax, taxesLoading, taxesError, load }
}
