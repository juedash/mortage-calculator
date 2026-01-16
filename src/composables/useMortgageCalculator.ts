// src/composables/useMortgageCalculator.ts
import { computed } from 'vue'
import type { MortageCalculatorInputs } from '@/types/MortageCalculator'

export function useMortgageCalculator({
  propertyPrice,
  totalSavings,
  commission,
  brokerTax,
  cityTax,
}: MortageCalculatorInputs) {
  const notaryCosts = computed(() => 2144 + 0.013 * (propertyPrice.value - 100000))

  const brokerCosts = computed(() => (commission.value ? brokerTax * propertyPrice.value : 0))
  const stampDutyCosts = computed(() => cityTax * propertyPrice.value)

  const totalCost = computed(() => notaryCosts.value + brokerCosts.value + stampDutyCosts.value)

  const rawLoanAmount = computed(() => totalCost.value - totalSavings.value + propertyPrice.value)

  const loanToValue = computed(() =>
    propertyPrice.value > 0 ? rawLoanAmount.value / propertyPrice.value : 0,
  )

  return {
    notaryCosts,
    brokerCosts,
    stampDutyCosts,
    totalCost,
    rawLoanAmount,
    loanToValue,
  }
}
