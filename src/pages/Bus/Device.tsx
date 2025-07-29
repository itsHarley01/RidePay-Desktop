import { useEffect, useState } from 'react'
import AddNewDevice from '../../components/Bus/AddNewDevice'
import { getAllDevices } from '../../api/deviceApi'
import DeviceDetails from '../../components/Bus/DeviceDetails'

interface Device {
  deviceUID: string
  deviceName: string
  macAddress: string
  status: string
  assignedBus?: string
  organization?: string
}


export default function Device() {
  const [devices, setDevices] = useState<Device[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedDeviceUID, setSelectedDeviceUID] = useState<string | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)


  const handleOpenDeviceDetails = (uid: string) => {
    setSelectedDeviceUID(uid)
  }


  const loadDevices = async () => {
    try {
      const data = await getAllDevices()
      const deviceArray = Object.values(data) as Device[]
      setDevices(deviceArray)
    } catch (error) {
      console.error('Error loading devices:', error)
    }
  }

  useEffect(() => {
    loadDevices()
  }, [])

  const filteredDevices = devices.filter(
    (device) =>
      device.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.model.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="bg-white shadow-md p-6 rounded-lg relative">
      {isAddModalOpen && (
        <AddNewDevice
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={() => {
            loadDevices()
            setIsAddModalOpen(false)
          }}
        />
      )}

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search device..."
          className="border border-gray-300 px-4 py-2 rounded-md w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-yellow-400 text-[#0A2A54] font-semibold px-4 py-2 rounded-md shadow hover:brightness-110 transition"
        >
          + Add New Device
        </button>
      </div>

      {filteredDevices.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No devices found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left bg-gray-100 text-[#0A2A54]">
              <tr>
                <th className="p-3">Device UID</th>
                <th className="p-3">Device Name</th>
                <th className="p-3">MAC Address</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDevices.map((device, i) => (
                <tr key={device.deviceUID} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                  <td className="p-3">{device.deviceUID}</td>
                  <td className="p-3">{device.deviceName}</td>
                  <td className="p-3">{device.macAddress}</td>
                  <td className="p-3">{device.status}</td>
                  <td className="p-3">
                    <button
                      onClick={() => {
                        setSelectedDevice(device)
                        setIsDetailsOpen(true)
                      }}
                      className="text-sm bg-[#0A2A54] text-white px-3 py-1 rounded-md shadow hover:bg-opacity-90 transition"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

{isDetailsOpen && selectedDevice && (
  <DeviceDetails
    device={selectedDevice}
    onClose={() => setIsDetailsOpen(false)}
    onSave={() => {
      loadDevices()
      setIsDetailsOpen(false)
    }}
  />
)}
    </div>
  )
}
