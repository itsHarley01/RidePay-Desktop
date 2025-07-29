import React, { useState } from 'react'
import { updateDeviceByUID } from '../../api/deviceApi'

interface Device {
  deviceUID: string
  deviceName: string
  macAddress: string
  status: string
  model?: string
  assignedBus?: string
  organization?: string
}

interface DeviceDetailsProps {
  device: Device
  onClose: () => void
  onSave?: () => void
}

export default function DeviceDetails({ device, onClose, onSave }: DeviceDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({
    deviceName: device.deviceName,
    macAddress: device.macAddress,
    status: device.status
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      await updateDeviceByUID(device.deviceUID, form)
      setIsEditing(false)
      if (onSave) onSave()
    } catch (error) {
      console.error('Failed to update device:', error)
      alert('Failed to save changes')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Device Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block font-medium">Device UID</label>
            <input
              type="text"
              className="w-full border border-gray-300 px-3 py-2 rounded bg-gray-100"
              value={device.deviceUID}
              disabled
            />
          </div>

          <div>
            <label className="block font-medium">Device Name</label>
            <input
              name="deviceName"
              type="text"
              className="w-full border border-gray-300 px-3 py-2 rounded"
              value={form.deviceName}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="block font-medium">MAC Address</label>
            <input
              name="macAddress"
              type="text"
              className="w-full border border-gray-300 px-3 py-2 rounded"
              value={form.macAddress}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="block font-medium">Status</label>
            <select
              name="status"
              className="w-full border border-gray-300 px-3 py-2 rounded"
              value={form.status}
              onChange={handleChange}
              disabled={!isEditing}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setForm({
                    deviceName: device.deviceName,
                    macAddress: device.macAddress,
                    status: device.status
                  })
                  setIsEditing(false)
                }}
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded bg-yellow-400 text-[#0A2A54] font-semibold hover:brightness-110"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded bg-yellow-400 text-[#0A2A54] font-semibold hover:brightness-110"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
