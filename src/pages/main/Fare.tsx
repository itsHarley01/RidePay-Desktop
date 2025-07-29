import React, { useEffect, useState } from 'react'
import { getTariff, updateTariff } from '../../api/tariffApi'
import { toast, ToastContainer } from 'react-toastify'
import { Pencil, Ruler, CreditCard, X } from 'lucide-react'
import 'react-toastify/dist/ReactToastify.css'

export default function Fare() {
  const [distanceBased, setDistanceBased] = useState({ minimumDistance: '', minimumFee: '' })
  const [fixed, setFixed] = useState({ minimumFee: '' })
  const [originalDistanceBased, setOriginalDistanceBased] = useState({ minimumDistance: '', minimumFee: '' })
  const [originalFixed, setOriginalFixed] = useState({ minimumFee: '' })

  const [editingType, setEditingType] = useState<'distanceBased' | 'fixed' | null>(null)
  const [loading, setLoading] = useState(true)
  const [canEditTariff, setCanEditTariff] = useState(true)

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
        await updateTariff({ type, ...distanceBased })
        setOriginalDistanceBased(distanceBased)
      } else {
        await updateTariff({ type, ...fixed })
        setOriginalFixed(fixed)
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
              <div>
                <label className="block text-gray-700 font-medium mb-1">Minimum Distance (km)</label>
                <input
                  type="number"
                  value={distanceBased.minimumDistance}
                  onChange={(e) =>
                    setDistanceBased({ ...distanceBased, minimumDistance: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                  min="0"
                  disabled={!canEditTariff || editingType !== 'distanceBased'}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Minimum Fare (₱)</label>
                <input
                  type="number"
                  value={distanceBased.minimumFee}
                  onChange={(e) =>
                    setDistanceBased({ ...distanceBased, minimumFee: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                  min="0"
                  disabled={!canEditTariff || editingType !== 'distanceBased'}
                />
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
                  value={fixed.minimumFee}
                  onChange={(e) => setFixed({ minimumFee: e.target.value })}
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

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}
