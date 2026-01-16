import { ref } from 'vue'
import { gql } from '@/api/graphql'
import type { RatesTable, FetchRatesTableArgs } from '@/types'

export const useRatesTable = () => {
  const ratesTable = ref<RatesTable | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchRatesTable = async ({
    propertyPrice,
    annualRepaymentRate,
    loanAmount,
    yearsFixed = [5, 10, 15, 20, 25, 30],
  }: FetchRatesTableArgs) => {
    if (loading.value) return

    loading.value = true
    error.value = null

    try {
      const query = `
        query {
          root {
            rates_table(
              property_price: ${Math.round(propertyPrice)},
              repayment: ${Number(annualRepaymentRate)},
              loan_amount: ${Math.round(loanAmount)},
              years_fixed: [${yearsFixed.join(',')}]
            )
          }
        }
      `

      const res = await gql<{ root: { ratesTable: RatesTable } }>(query)

      if (!res?.root?.ratesTable) throw new Error("YYou couldn't fetch rates table")
      ratesTable.value = res.root.ratesTable
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      error.value = e?.message ?? 'Failed to fetch rates table'
      ratesTable.value = null
    } finally {
      loading.value = false
    }
  }

  return { ratesTable, loading, error, fetchRatesTable }
}
