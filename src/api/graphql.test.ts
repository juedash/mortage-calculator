import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { fetchCityTax, fetchBrokerTax } from './graphql'

type GraphQLRequestBody = {
  query: string
  variables?: Record<string, unknown>
  operationName?: string
}

vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
  },
}))

const mockPost = vi.mocked(axios.post)

describe('graphql.ts', () => {
  beforeEach(() => {
    mockPost.mockReset()
  })

  describe('fetchCityTax()', () => {
    it('calls gql and returns tax', async () => {
      mockPost.mockResolvedValueOnce({
        data: { data: { calculateCityTax: { tax: 0.06 } } },
      })

      const tax = await fetchCityTax('berlin')
      expect(tax).toBe(0.06)

      const [, body] = mockPost.mock.calls[0] ?? []
      const sentQuery = (body as GraphQLRequestBody).query

      expect(sentQuery).toContain('calculateCityTax')
      expect(sentQuery).toContain('region: "berlin"')
    })
  })

  describe('fetchBrokerTax()', () => {
    it('calls gql and returns tax', async () => {
      mockPost.mockResolvedValueOnce({
        data: { data: { calculateMaklerFee: { tax: 0.0714 } } },
      })

      const tax = await fetchBrokerTax('berlin', false)
      expect(tax).toBe(0.0714)

      const [, body] = mockPost.mock.calls[0] ?? []
      const sentQuery = (body as GraphQLRequestBody).query

      expect(sentQuery).toContain('calculateMaklerFee')
      expect(sentQuery).toContain('region: "berlin"')
      expect(sentQuery).toContain('new_property: false')
    })
  })
})
