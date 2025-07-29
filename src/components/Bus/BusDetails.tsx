import React, { useEffect, useState } from 'react';
import { X, Pencil } from 'lucide-react';
import { getBusById, updateBusById } from '../../api/busApi';
import { getAllDrivers } from '../../api/driverApi';
import { getAllDevices } from '../../api/deviceApi';


interface BusDetailsProps {
  bus: {
    busUID: string;
  };
  onClose: () => void;
  onUpdateSuccess: () => void;
}

const BusDetails: React.FC<BusDetailsProps> = ({ bus, onClose, onUpdateSuccess }) => {
  const [busData, setBusData] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [editMode, setEditMode] = useState(false);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);

  useEffect(() => {
    const fetchBus = async () => {
      try {
        const data = await getBusById(bus.busUID);
        setBusData(data);
        setFormData({
          ...data,
          driver: data.driver || '',
        });
      } catch (error) {
        console.error('Failed to fetch bus data:', error);
      }
    };
    
    const fetchDrivers = async () => {
      try {
        const data = await getAllDrivers(); // returns an array

        const driverArray = data.map((driver: any) => ({
          uid: driver.uid, // ✅ this is the actual UID
          name: `${driver.firstName} ${driver.lastName}`, // ✅ this is what shows in the dropdown
        }));

        setDrivers(driverArray);
      } catch (error) {
        console.error('Failed to fetch drivers:', error);
      }
    };
    const fetchDevices = async () => {
  try {
    const deviceData = await getAllDevices(); // assuming array
    const deviceArray = deviceData.map((device: any) => ({
      uid: device.deviceUID,
      name: device.deviceName,
    }));
    setDevices(deviceArray);
  } catch (error) {
    console.error('Failed to fetch devices:', error);
  }
};

fetchDevices(); // inside useEffect


    fetchBus();
    fetchDrivers();
  }, [bus.busUID]);

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;

  console.log('Changed:', name, value); // 👈 should print the UID like 'DRV-0010'

  setFormData((prev: any) => ({
    ...prev,
    [name]: name === 'numberOfSeats' ? parseInt(value) || 0 : value,
  }));
};

  const handleSave = async () => {
    try {
      await updateBusById(bus.busUID, {
        ...formData,
        driver: formData.driver || '', // Ensure it's the UID
      });
      setEditMode(false);
      onUpdateSuccess();
    } catch (error) {
      console.error('Failed to update bus:', error);
    }
  };

  if (!busData) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-red-500">
          <X />
        </button>

        {/* Header */}
        <h2 className="text-xl font-bold text-[#0A2A54] text-center mb-4">Bus Details</h2>

        {/* Fields */}
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Bus Name" name="busName" value={formData.busName} onChange={handleChange} disabled={!editMode} />
          <InputField label="Model" name="model" value={formData.model} onChange={handleChange} disabled={!editMode} />
          <InputField label="Number of Seats" name="numberOfSeats" value={formData.numberOfSeats} onChange={handleChange} disabled={!editMode} />
          <InputField label="License Plate" name="licensePlate" value={formData.licensePlate} onChange={handleChange} disabled={!editMode} />
          {/* Assigned Device Dropdown */}
<div className="flex flex-col">
  <label className="text-sm text-gray-600 font-medium mb-1">Assigned Device</label>
  {editMode ? (
    <select
      name="assignedDevice"
      value={formData.assignedDevice}
      onChange={handleChange}
      className="border rounded-md px-3 py-2 text-sm bg-white"
    >
      <option value="">Not yet assigned</option>
      {devices.map((device) => (
        <option key={device.uid} value={device.uid}>
          {device.name}
        </option>
      ))}
    </select>
  ) : (
    <div className="text-sm px-3 py-2 bg-gray-100 text-gray-700 rounded-md">
      {(() => {
        const match = devices.find((d) => d.uid === formData.assignedDevice);
        return match ? match.name : formData.assignedDevice || 'Not yet assigned';
      })()}
    </div>
  )}
</div>

          <InputField label="Organization" name="organization" value={formData.organization} onChange={handleChange} disabled={!editMode} />
          <InputField label="Status" name="status" value={formData.status} onChange={handleChange} disabled={!editMode} />

          {/* Assigned Driver Dropdown */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 font-medium mb-1">Assigned Driver</label>
            {editMode ? (
<select
  name="driver"
  value={formData.driver}
  onChange={handleChange}
  className="border rounded-md px-3 py-2 text-sm bg-white"
>
  <option value="">Not yet assigned</option>
  {drivers.map((driver) => (
    <option key={driver.uid} value={driver.uid}>
      {driver.name}
    </option>
  ))}
</select>

            ) : (
              <div className="text-sm px-3 py-2 bg-gray-100 text-gray-700 rounded-md">
                {(() => {
                  const match = drivers.find((d) => d.uid === formData.driver);
                  return match ? match.name : 'Not yet assigned';
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-6 space-x-3">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md flex items-center space-x-1"
            >
              <Pencil size={16} />
              <span>Edit</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setEditMode(false);
                  setFormData(busData);
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, disabled }: any) => (
  <div className="flex flex-col">
    <label className="text-sm text-gray-600 font-medium mb-1">{label}</label>
    <input
      type={name === 'numberOfSeats' ? 'number' : 'text'}
      name={name}
      value={value || ''}
      onChange={onChange}
      disabled={disabled}
      className={`border rounded-md px-3 py-2 text-sm ${
        disabled ? 'bg-gray-100 text-gray-500' : 'bg-white'
      }`}
    />
  </div>
);

export default BusDetails;
