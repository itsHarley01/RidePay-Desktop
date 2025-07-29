import React, { useState } from 'react'
import { addDevice } from '../../api/deviceApi'

interface AddNewDeviceProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
}

export default function AddNewDevice({ isOpen, onClose, onSubmit }: AddNewDeviceProps) {
  const [deviceName, setDeviceName] = useState('')
  const [macAddress, setMacAddress] = useState('')
  const [status, setStatus] = useState('active')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!deviceName || !macAddress || !status) {
      alert('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      await addDevice({ deviceName, macAddress, status })
      onSubmit()
    } catch (error) {
      console.error('Error adding device:', error)
      alert('Failed to add device')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-lg font-bold mb-4">Add New Device</h2>

        <div className="space-y-4">
          <div>
            <label className="block font-medium">Device Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 px-3 py-2 rounded"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium">MAC Address</label>
            <input
              type="text"
              className="w-full border border-gray-300 px-3 py-2 rounded"
              value={macAddress}
              onChange={(e) => setMacAddress(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium">Status</label>
            <select
              className="w-full border border-gray-300 px-3 py-2 rounded"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-yellow-400 text-[#0A2A54] font-semibold hover:brightness-110"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Device'}
          </button>
        </div>
      </div>
    </div>
  )
}
