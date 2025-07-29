import React, { useEffect, useState } from 'react'
import {
  getShares,
  updateMainShares,
  updateOperatorShares
} from '../../api/sharesApi'
import { toast, ToastContainer } from 'react-toastify'
import { Users, Building2, Pencil, X } from 'lucide-react'
import 'react-toastify/dist/ReactToastify.css'

export default function Shares() {
  const [dotrShare, setDotrShare] = useState('')
  const [coopShare, setCoopShare] = useState('')
  const [operatorShare, setOperatorShare] = useState('')
  const [driverShare, setDriverShare] = useState('')

  const [originalData, setOriginalData] = useState({})
  const [editing, setEditing] = useState<'main' | 'operatorDriver' | null>(null)
  const [role, setRole] = useState<string | null>(null)

  const isTransportCoop = role === 'admin-transport-cooperative'
  const isOperator = role === 'admin-operator'
  const isFullyRestricted = isOperator // cannot edit anything

  useEffect(() => {
    const userRole = localStorage.getItem('role')
    setRole(userRole)

    const fetchData = async () => {
      try {
        const data = await getShares()
        setDotrShare(data.dotrShare)
        setCoopShare(data.coopShare)
        setOperatorShare(data.operatorShare || '')
        setDriverShare(data.driverShare || '')
        setOriginalData(data)
      } catch (error) {
        console.error('Failed to fetch shares:', error)
        toast.error('Failed to fetch shares')
      }
    }

    fetchData()
  }, [])

  const handleSave = async (type: 'main' | 'operatorDriver') => {
    try {
      if (type === 'main') {
        await updateMainShares({ dotrShare, coopShare })
      } else {
        await updateOperatorShares({ operatorShare, driverShare })
      }
      toast.success('Shares updated successfully!')
      setEditing(null)
    } catch (error) {
      console.error('Failed to update shares:', error)
      toast.error('Failed to update shares')
    }
  }

  const handleCancel = (type: 'main' | 'operatorDriver') => {
    if (type === 'main') {
      setDotrShare(originalData.dotrShare)
      setCoopShare(originalData.coopShare)
    } else {
      setOperatorShare(originalData.operatorShare || '')
      setDriverShare(originalData.driverShare || '')
    }
    setEditing(null)
  }

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-3xl font-bold text-[#0A2A54] relative inline-block pb-2 mb-6">
        Shares
        <span className="absolute left-0 bottom-0 w-full h-1 bg-yellow-400 rounded"></span>
      </h1>

      <div className="mt-6 border-b border-gray-300"></div>

      <div className="mt-6 flex flex-col md:flex-row gap-6">
        {/* Government & Coop Shares */}
        <div className="w-full md:w-1/2 p-4 rounded-lg bg-gray-100 shadow-lg shadow-gray-400 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xl font-semibold text-[#0A2A54]">
              <Building2 size={20} /> Government & Coop Shares
            </div>
            {!isTransportCoop && !isFullyRestricted && (
              editing === 'main' ? (
                <button
                  onClick={() => handleCancel('main')}
                  className="text-gray-500 hover:text-red-600"
                >
                  <X size={20} />
                </button>
              ) : (
                <button
                  onClick={() => setEditing('main')}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <Pencil size={18} />
                </button>
              )
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                DOTr Share (%)
              </label>
              <input
                type="number"
                value={dotrShare}
                onChange={(e) => setDotrShare(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                disabled={isTransportCoop || isFullyRestricted || editing !== 'main'}
                min="0"
                max="100"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Transport Coop Share (%)
              </label>
              <input
                type="number"
                value={coopShare}
                onChange={(e) => setCoopShare(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                disabled={isTransportCoop || isFullyRestricted || editing !== 'main'}
                min="0"
                max="100"
              />
            </div>

            {editing === 'main' && !isTransportCoop && !isFullyRestricted && (
              <button
                onClick={() => handleSave('main')}
                className="bg-yellow-500 text-white px-6 py-2 rounded-lg shadow hover:bg-yellow-400 transition"
              >
                Save Changes
              </button>
            )}
          </div>
        </div>

        {/* Operator & Driver Shares */}
        <div className="w-full md:w-1/2 p-4 rounded-lg bg-gray-100 shadow-lg shadow-gray-400 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xl font-semibold text-[#0A2A54]">
              <Users size={20} /> Operator & Driver Shares
            </div>
            {!isFullyRestricted && (
              editing === 'operatorDriver' ? (
                <button
                  onClick={() => handleCancel('operatorDriver')}
                  className="text-gray-500 hover:text-red-600"
                >
                  <X size={20} />
                </button>
              ) : (
                <button
                  onClick={() => setEditing('operatorDriver')}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <Pencil size={18} />
                </button>
              )
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Transport Operator Share (%)
              </label>
              <input
                type="number"
                value={operatorShare}
                onChange={(e) => setOperatorShare(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                disabled={isFullyRestricted || editing !== 'operatorDriver'}
                min="0"
                max="100"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Driver Share (%)
              </label>
              <input
                type="number"
                value={driverShare}
                onChange={(e) => setDriverShare(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                disabled={isFullyRestricted || editing !== 'operatorDriver'}
                min="0"
                max="100"
              />
            </div>

            {editing === 'operatorDriver' && !isFullyRestricted && (
              <button
                onClick={() => handleSave('operatorDriver')}
                className="bg-yellow-500 text-white px-6 py-2 rounded-lg shadow hover:bg-yellow-400 transition"
              >
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
