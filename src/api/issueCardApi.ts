import axiosInstance from './axiosInstance'

interface IssueCardPayload {
  tagUid: string
  userUid: string
  cardPrice: number
  cardType: string
  cardIssuanceFee: number
  cardIssuanceLocation: string
  organization: string
  amount: number // total amount (usually cardPrice + cardIssuanceFee)
}

export async function issueCard(payload: IssueCardPayload) {
  try {
    const response = await axiosInstance.post(`/card/issuance`, payload)
    return response.data
  } catch (error: any) {
    console.error('Error issuing card:', error)
    throw error.response?.data || { message: 'Unexpected error occurred' }
  }
}
