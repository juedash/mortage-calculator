<template>
  <section class="bg-gray-50 m-auto min-h-screen w-full">
    <div class="container m-auto py-10 px-6">
      <div class="grid grid-cols-1 md:grid-cols-3 w-full gap-6 items-start">
        <main class="md:col-span-2">
          <CardSkeleton>
            <h2 class="text-2xl font-semibold tracking-tight text-center">Mortgage Calculator</h2>
            <p class="text-slate-400 text-center text-xs">
              Calculations are made for region: <span class="capitalize">{{ location }}</span>
            </p>
            <!-- use change for live calculations, submit for GraphQL -->
            <MortageCalculatorForm
              :initial-values="{
                commission,
                propertyPrice,
                totalSavings,
                annualRepaymentRate,
              }"
              @change="onFormChange"
              @submit="onFormSubmit"
            />
          </CardSkeleton>
        </main>

        <aside class="md:col-span-1 space-y-6 flex flex-col">
          <CardSkeleton>
            <h3 class="text-lg font-semibold">Implied loan</h3>
            <p class="mt-2 text-2xl font-semibold text-slate-700">
              {{ formatMoney(rawLoanAmount) }}
            </p>
          </CardSkeleton>

          <CardSkeleton>
            <h3 class="text-lg font-semibold">Loan to value</h3>
            <p class="mt-2 text-2xl font-semibold text-slate-700">
              {{ (loanToValue * 100).toFixed(1) }}%
            </p>
          </CardSkeleton>
          <CardSkeleton v-if="loadingRates || ratesTable || ratesError">
            <div v-if="loadingRates" class="text-sm text-slate-500">Loading rates…</div>
            <div v-else-if="ratesError" class="text-sm text-red-500">{{ ratesError }}</div>
            <div v-else-if="ratesTable">
              <MortageCalculatorRatesTable
                :table="ratesTable"
                title="Rates table"
                subtitle="Based on your inputs"
              />
            </div>
          </CardSkeleton>
        </aside>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import CardSkeleton from './CardSkeleton.vue'
import MortageCalculatorForm from './MortageCalculatorForm.vue'
import MortageCalculatorRatesTable from './MortageCalculatorRatesTable.vue'
import type { MortgageFormValues } from '@/types/MortageCalculator'

import { useMortgageCalculator } from '@/composables/useMortgageCalculator'
import { useRatesTable } from '@/composables/useRatesTable'
import { useTaxes } from '@/composables/useTaxes'

import { useLocationStore } from '@/stores/location'

const { ratesTable, loading: loadingRates, error: ratesError, fetchRatesTable } = useRatesTable()

const propertyPrice = ref(320000)
const totalSavings = ref(80000)
const commission = ref(false)
const annualRepaymentRate = ref(2)

const { brokerTax, cityTax } = useTaxes()

const { rawLoanAmount, loanToValue } = useMortgageCalculator({
  propertyPrice,
  totalSavings,
  commission,
  brokerTax: brokerTax.value,
  cityTax: cityTax.value,
})

const formatMoney = (n: number) => n.toLocaleString()

const onFormChange = (values: MortgageFormValues) => {
  propertyPrice.value = values.propertyPrice
  totalSavings.value = values.totalSavings
  commission.value = values.commission
  annualRepaymentRate.value = values.annualRepaymentRate
}

const onFormSubmit = async () => {
  await fetchRatesTable({
    propertyPrice: propertyPrice.value,
    annualRepaymentRate: annualRepaymentRate.value,
    loanAmount: rawLoanAmount.value,
  })
}

const { region } = useLocationStore()
const location = ref(region)
</script>
