import type { Ref } from 'vue'

export type MortgageFormValues = {
  commission: boolean
  propertyPrice: number
  totalSavings: number
  annualRepaymentRate: number
}

export type MortageCalculatorInputs = {
  propertyPrice: Ref<number>
  totalSavings: Ref<number>
  commission: Ref<boolean>
  brokerTax: number
  cityTax: number
}
