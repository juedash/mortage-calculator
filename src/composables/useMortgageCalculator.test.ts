import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useMortgageCalculator } from './useMortgageCalculator'

function setup(
  overrides?: Partial<{
    propertyPrice: number
    totalSavings: number
    commission: boolean
    brokerTax: number
    cityTax: number
  }>,
) {
  const propertyPrice = ref(overrides?.propertyPrice ?? 320000)
  const totalSavings = ref(overrides?.totalSavings ?? 80000)
  const commission = ref(overrides?.commission ?? false)

  const brokerTax = overrides?.brokerTax ?? 0.0357
  const cityTax = overrides?.cityTax ?? 0.06

  const calc = useMortgageCalculator({
    propertyPrice,
    totalSavings,
    commission,
    brokerTax,
    cityTax,
  })

  return { propertyPrice, totalSavings, commission, brokerTax, cityTax, ...calc }
}

describe('useMortgageCalculator', () => {
  it('computes costs, total, loan, and ltv when commission is off', () => {
    const { notaryCosts, brokerCosts, stampDutyCosts, totalCost, rawLoanAmount, loanToValue } =
      setup({ commission: false })

    expect(notaryCosts.value).toBe(5004)
    expect(brokerCosts.value).toBe(0)
    expect(stampDutyCosts.value).toBe(19200)
    expect(totalCost.value).toBe(24204)
    expect(rawLoanAmount.value).toBe(264204)
    expect(loanToValue.value).toBeCloseTo(264204 / 320000, 10)
  })

  it('includes broker costs when commission is on', () => {
    const { brokerCosts, totalCost, rawLoanAmount, loanToValue } = setup({ commission: true })

    expect(brokerCosts.value).toBe(11424)
    expect(totalCost.value).toBe(35628)
    expect(rawLoanAmount.value).toBe(275628)
    expect(loanToValue.value).toBeCloseTo(275628 / 320000, 10)
  })

  it('reacts when savings and price change', () => {
    const { propertyPrice, totalSavings, rawLoanAmount, loanToValue } = setup({
      commission: false,
      propertyPrice: 320000,
      totalSavings: 80000,
    })

    const firstLoan = rawLoanAmount.value

    totalSavings.value += 10_000
    expect(rawLoanAmount.value).toBe(firstLoan - 10_000)

    propertyPrice.value = 400_000
    expect(loanToValue.value).toBeCloseTo(rawLoanAmount.value / 400_000, 10)
  })

  it('returns loanToValue = 0 when propertyPrice <= 0', () => {
    const { loanToValue } = setup({ propertyPrice: 0 })
    expect(loanToValue.value).toBe(0)
  })
})
