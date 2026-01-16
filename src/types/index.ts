export type NumberStepper = {
  label: string
  modelValue: number
  step: number
  min?: number
  max?: number
  required?: boolean
  disabled?: boolean
  hint?: string
  name?: string
  inputId?: string
}

export type RateTableEntry = {
  borrowingRate: number
  monthlyRate: number
}

export type RatesTable = Record<string, RateTableEntry>

export type FetchRatesTableArgs = {
  propertyPrice: number
  annualRepaymentRate: number
  loanAmount: number
  yearsFixed?: number[]
}
