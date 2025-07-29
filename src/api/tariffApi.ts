import axiosInstance from './axiosInstance'

export interface DistanceBasedTariff {
  type: 'distanceBased'
  minimumDistance: string
  minimumFee: string
}

export interface FixedTariff {
  type: 'fixed'
  minimumFee: string
}

export type Tariff = {
  distanceBased?: {
    minimumDistance: string
    minimumFee: string
  }
  fixed?: {
    minimumFee: string
  }
}

type UpdateTariffPayload = DistanceBasedTariff | FixedTariff

// GET /api/tariff
export const getTariff = async (): Promise<Tariff> => {
  const response = await axiosInstance.get<Tariff>('/tariff')
  return response.data
}

// PUT /api/tariff
export const updateTariff = async (
  payload: UpdateTariffPayload
): Promise<{ message: string }> => {
  const response = await axiosInstance.put('/tariff', payload)
  return response.data
}
