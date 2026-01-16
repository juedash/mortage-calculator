import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useMortgageCalculator } from './useMortgageCalculator'

describe('useMortgageCalculator', () => {
  it('computes costs, total, loan, and ltv when commission is off', () => {
    const propertyPrice = ref(320000)
    const totalSavings = ref(80000)
    const commission = ref(false)

    const brokerTax = 0.0357
    const cityTax = 0.06

    const { notaryCosts, brokerCosts, stampDutyCosts, totalCost, rawLoanAmount, loanToValue } =
      useMortgageCalculator({
        propertyPrice,
        totalSavings,
        commission,
        brokerTax,
        cityTax,
      })

    // notary: 2144 + 0.013 * (320000 - 100000) = 2144 + 2860 = 5004
    expect(notaryCosts.value).toBe(5004)

    // commission off
    expect(brokerCosts.value).toBe(0)

    // stamp duty: 0.06 * 320000 = 19200
    expect(stampDutyCosts.value).toBe(19200)

    // total: 5004 + 0 + 19200 = 24204
    expect(totalCost.value).toBe(24204)

    // loan: total - savings + price = 24204 - 80000 + 320000 = 264204
    expect(rawLoanAmount.value).toBe(264204)

    // ltv: 264204 / 320000 = 0.8256375
    expect(loanToValue.value).toBeCloseTo(0.8256375, 10)
  })

  it('includes broker costs when commission is on', () => {
    const propertyPrice = ref(320000)
    const totalSavings = ref(80000)
    const commission = ref(true)

    const brokerTax = 0.0357
    const cityTax = 0.06

    const { brokerCosts, totalCost, rawLoanAmount } = useMortgageCalculator({
      propertyPrice,
      totalSavings,
      commission,
      brokerTax,
      cityTax,
    })

    // broker: 0.0357 * 320000 = 11424
    expect(brokerCosts.value).toBe(11424)

    // total: 5004 + 11424 + 19200 = 35628
    expect(totalCost.value).toBe(35628)

    // loan: 35628 - 80000 + 320000 = 275628
    expect(rawLoanAmount.value).toBe(275628)
  })
})
