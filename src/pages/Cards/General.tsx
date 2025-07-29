import React, { useEffect, useState } from 'react'
import { Pencil, CreditCard, X } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { getCardPrice, updateCardPrice } from '../../api/cardApi'

export default function General() {
  const [price, setPrice] = useState('')
  const [originalPrice, setOriginalPrice] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [canEdit, setCanEdit] = useState(true) // Default true, update in effect

  useEffect(() => {
    const role = localStorage.getItem('role')
    // Restrict both transport cooperative and operator admins
    const restrictedRoles = ['admin-transport-cooperative', 'admin-operator']
    setCanEdit(!restrictedRoles.includes(role || ''))

    const fetchPrice = async () => {
      try {
        const data = await getCardPrice()
        setPrice(data?.price?.toString() || '')
        setOriginalPrice(data?.price?.toString() || '')
      } catch (err) {
        console.error('Failed to fetch card price', err)
        toast.error('Failed to fetch card price.')
      } finally {
        setLoading(false)
      }
    }

    fetchPrice()
  }, [])

  const handleSave = async () => {
    try {
      const numericPrice = parseFloat(price)
      if (isNaN(numericPrice) || numericPrice < 0) {
        toast.error('Please enter a valid price.')
        return
      }

      await updateCardPrice(numericPrice)
      setOriginalPrice(price)
      setIsEditing(false)
      toast.success('Card price updated successfully!')
    } catch (error) {
      toast.error('Failed to update card price.')
    }
  }

  return (
    <div className="p-6">
      {loading ? (
        <p className="mt-6 text-gray-500">Loading card price...</p>
      ) : (
        <div className="mt-6 max-w-xl bg-gray-100 p-4 rounded-lg shadow-lg shadow-gray-400 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xl font-semibold text-[#0A2A54]">
              <CreditCard size={20} /> Card Price
            </div>
            {canEdit && (
              isEditing ? (
                <button
                  onClick={() => {
                    setPrice(originalPrice)
                    setIsEditing(false)
                  }}
                  className="text-gray-500 hover:text-red-600"
                >
                  <X size={20} />
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <Pencil size={18} />
                </button>
              )
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Price (₱)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                min="0"
                disabled={!canEdit || !isEditing}
              />
            </div>

            {isEditing && canEdit && (
              <button
                onClick={handleSave}
                className="bg-yellow-500 text-white px-6 py-2 rounded-lg shadow hover:bg-yellow-400 transition"
              >
                Save Changes
              </button>
            )}
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}
