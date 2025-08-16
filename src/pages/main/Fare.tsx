import React, { useEffect, useState } from 'react'
import { getTariff, updateTariff } from '../../api/tariffApi'
import { toast, ToastContainer } from 'react-toastify'
import { Pencil, Ruler, CreditCard, X } from 'lucide-react'
import 'react-toastify/dist/ReactToastify.css'
import { Switch } from '@headlessui/react'
import { getFixedEnabled, setFixedEnabled } from '../../api/tariffApi'

export default function Fare() {
  const [distanceBased, setDistanceBased] = useState({
    minimumFare: 0,
    succeedingDistance: 0,
    succeedingFare: 0
  })
  const [fixed, setFixed] = useState({ minimumFee: 0 })

  const [originalDistanceBased, setOriginalDistanceBased] = useState({
    minimumFare: 0,
    succeedingDistance: 0,
    succeedingFare: 0
  })
  const [originalFixed, setOriginalFixed] = useState({ minimumFee: 0 })

  const [editingType, setEditingType] = useState<'distanceBased' | 'fixed' | null>(null)
  const [loading, setLoading] = useState(true)
  const [canEditTariff, setCanEditTariff] = useState(true)
  const [isDistanceBased, setIsDistanceBased] = useState(false)
  const [isFixedEnabled, setIsFixedEnabled] = useState(false)

   useEffect(() => {
    const fetchFixed = async () => {
      try {
        const { fixedEnabled } = await getFixedEnabled()
        setIsFixedEnabled(fixedEnabled)
      } catch (error) {
        console.error('Failed to fetch fixedEnabled:', error)
      }
    }

    fetchFixed()
  }, [])

    const handleToggle = async (value: boolean) => {
      setIsFixedEnabled(value) // optimistic update
      setLoading(true)
      try {
        const response = await setFixedEnabled(value)
        setIsFixedEnabled(response.fixedEnabled) // confirm backend value
      } catch (error) {
        console.error('Failed to update fixedEnabled:', error)
        setIsFixedEnabled(!value) // revert on error
      } finally {
        setLoading(false)
      }
    }

  useEffect(() => {
    const role = localStorage.getItem('role')
    setCanEditTariff(!(role === 'admin-transport-cooperative' || role === 'admin-operator'))

    const fetchTariff = async () => {
      try {
        const data = await getTariff()
        if (data.distanceBased) {
          setDistanceBased(data.distanceBased)
          setOriginalDistanceBased(data.distanceBased)
        }
        if (data.fixed) {
          setFixed(data.fixed)
          setOriginalFixed(data.fixed)
        }
      } catch (error) {
        console.warn('Tariff not yet set or failed to fetch')
      } finally {
        setLoading(false)
      }
    }

    fetchTariff()
  }, [])

  const handleSave = async (type: 'distanceBased' | 'fixed') => {
    try {
      if (type === 'distanceBased') {
        const payload = {
          type,
          minimumFare: parseFloat(distanceBased.minimumFare.toFixed(2)),
          succeedingDistance: parseFloat(distanceBased.succeedingDistance.toFixed(1)),
          succeedingFare: parseFloat(distanceBased.succeedingFare.toFixed(2))
        }
        await updateTariff(payload)
        setOriginalDistanceBased(payload)
      } else {
        const payload = {
          type,
          minimumFee: parseFloat(fixed.minimumFee.toFixed(2))
        }
        await updateTariff(payload)
        setOriginalFixed(payload)
      }

      toast.success(`${type} tariff updated successfully.`)
      setEditingType(null)
    } catch (error) {
      toast.error(`Failed to update ${type} tariff.`)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-[#0A2A54] relative inline-block pb-2">
        Fare
        <span className="absolute left-0 bottom-0 w-full h-1 bg-yellow-400 rounded"></span>
      </h1>

      <div className="mt-6 border-b border-gray-300"></div>

      {loading ? (
        <p className="mt-6 text-gray-500">Loading tariff settings...</p>
      ) : (
        <div className="mt-6 flex flex-col lg:flex-row gap-6">

          {/* Distance-Based Tariff */}
          <div className="border-gray-50 p-4 rounded-lg bg-gray-100 shadow-lg shadow-gray-400 relative flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xl font-semibold text-[#0A2A54]">
                <Ruler size={20} /> Distance-Based Tariff
              </div>
              {canEditTariff && (
                editingType === 'distanceBased' ? (
                  <button
                    onClick={() => {
                      setDistanceBased(originalDistanceBased)
                      setEditingType(null)
                    }}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <X size={20} />
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingType('distanceBased')}
                    className="text-gray-500 hover:text-gray-800"
                  >
                    <Pencil size={18} />
                  </button>
                )
              )}
            </div>

            <div className="space-y-4">
              {/* Minimum Fare */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Minimum Fare (₱)</label>
                <input
                  type="number"
                  step="0.01"
                  value={distanceBased.minimumFare}
                  onChange={(e) =>
                    setDistanceBased({ ...distanceBased, minimumFare: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                  min="0"
                  disabled={!canEditTariff || editingType !== 'distanceBased'}
                />
              </div>

              {/* Succeeding Distance & Fare */}
              <div className="flex flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium mb-1">Succeeding Distance (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={distanceBased.succeedingDistance}
                    onChange={(e) =>
                      setDistanceBased({ ...distanceBased, succeedingDistance: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                    min="0"
                    disabled={!canEditTariff || editingType !== 'distanceBased'}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium mb-1">Succeeding Fare (₱)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={distanceBased.succeedingFare}
                    onChange={(e) =>
                      setDistanceBased({ ...distanceBased, succeedingFare: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                    min="0"
                    disabled={!canEditTariff || editingType !== 'distanceBased'}
                  />
                </div>
              </div>

              {editingType === 'distanceBased' && canEditTariff && (
                <button
                  onClick={() => handleSave('distanceBased')}
                  className="bg-yellow-500 text-white px-6 py-2 rounded-lg shadow hover:bg-yellow-400 transition"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>

          {/* Fixed Tariff */}
          <div className="border-gray-50 p-4 rounded-lg bg-gray-100 shadow-lg shadow-gray-400 relative flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xl font-semibold text-[#0A2A54]">
                <CreditCard size={20} /> Fixed Tariff
              </div>
              {canEditTariff && (
                editingType === 'fixed' ? (
                  <button
                    onClick={() => {
                      setFixed(originalFixed)
                      setEditingType(null)
                    }}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <X size={20} />
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingType('fixed')}
                    className="text-gray-500 hover:text-gray-800"
                  >
                    <Pencil size={18} />
                  </button>
                )
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Minimum Fare (₱)</label>
                <input
                  type="number"
                  step="0.01"
                  value={fixed.minimumFee}
                  onChange={(e) => setFixed({ minimumFee: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                  min="0"
                  disabled={!canEditTariff || editingType !== 'fixed'}
                />
              </div>

              {editingType === 'fixed' && canEditTariff && (
                <button
                  onClick={() => handleSave('fixed')}
                  className="bg-yellow-500 text-white px-6 py-2 rounded-lg shadow hover:bg-yellow-400 transition"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      )}

       <div className="p-4 my-10 border rounded-xl bg-white shadow-sm w-full max-w-sm">
        {/* Label */}
        <label className="block text-gray-800 font-semibold mb-3 text-lg">
          Tariff Type
        </label>

        {/* Toggle Row */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700 font-medium">
            {isFixedEnabled ? 'Fixed Enabled' : 'Fixed Disabled'}
          </span>
        
          <Switch
            checked={isFixedEnabled}
            onChange={handleToggle}
            disabled={loading}
            className={`${
              isFixedEnabled ? 'bg-blue-500' : 'bg-gray-300'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200`}
          >
            <span
              className={`${
                isFixedEnabled ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>

        {/* Detail Text */}
        <p className="mt-2 text-sm text-gray-500">
          {isDistanceBased
            ? 'Fare is calculated based on distance traveled.'
            : 'Fare is fixed regardless of distance.'}
        </p>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}
