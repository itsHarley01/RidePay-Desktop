import axiosInstance from './axiosInstance'

// New distanceBased tariff type
export interface DistanceBasedTariff {
  type: 'distanceBased'
  minimumFare: number // 2 decimals
  succeedingDistance: number // 1 decimal
  succeedingFare: number // 2 decimals
}

export interface FixedTariff {
  type: 'fixed'
  minimumFee: number // 2 decimals
}

export type Tariff = {
  distanceBased?: {
    minimumFare: number
    succeedingDistance: number
    succeedingFare: number
  }
  fixed?: {
    minimumFee: number
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

// PUT /api/tariff/fixedEnabled
export const setFixedEnabled = async (enabled: boolean): Promise<{ message: string }> => {
  const response = await axiosInstance.put('/tariff/set', { fixedEnabled: enabled })
  return response.data
}

// GET /api/tariff/fixedEnabled
export const getFixedEnabled = async (): Promise<{ fixedEnabled: boolean }> => {
  const response = await axiosInstance.get<{ fixedEnabled: boolean }>('/tariff/set')
  return response.data
}

