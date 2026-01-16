import axios from 'axios'

type GraphQLError = { message?: string }
type GraphQLResponse<T> = { data?: T; errors?: GraphQLError[] }

export const gql = async <T>(query: string): Promise<T> => {
  const res = await axios.post<GraphQLResponse<T>>('/api/q', { query })

  if (res.data?.errors?.length) {
    throw new Error(res.data.errors[0]?.message ?? 'GraphQL error')
  }
  if (!res.data?.data) throw new Error('Missing  data')

  return res.data.data
}

export const fetchCityTax = async (region = 'berlin') => {
  const q = `
    mutation {
      calculateCityTax(input: { region: "${region}" }) { tax }
    }
  `
  const res = await gql<{ calculateCityTax: { tax: number } }>(q)
  return res.calculateCityTax.tax
}

export const fetchBrokerTax = async (region = 'berlin', newProperty = false) => {
  const q = `
    mutation {
      calculateMaklerFee(input: { region: "${region}", new_property: ${newProperty} }) { tax }
    }
  `
  const res = await gql<{ calculateMaklerFee: { tax: number } }>(q)
  return res.calculateMaklerFee.tax
}
