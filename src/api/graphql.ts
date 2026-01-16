import axios from 'axios'

type GraphQLError = { message?: string }
type GraphQLResponse<T> = { data?: T; errors?: GraphQLError[] }

export const gql = async <T>(query: string): Promise<T> => {
  const res = await axios.post<GraphQLResponse<T>>('/api/q', { query })

  if (res.data?.errors?.length) {
    throw new Error(res.data.errors[0]?.message ?? 'GraphQL error')
  }
  if (!res.data?.data) throw new Error('Missing GraphQL data')

  return res.data.data
}
