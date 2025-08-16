import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { addNewBus } from '../../api/busApi';
import { getAllDevices } from '../../api/deviceApi';


interface AddNewBusProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export const AddNewBus = ({ isOpen, onClose, onSubmit }: AddNewBusProps) => {
  const [formData, setFormData] = useState({
    busName: '',
    model: '',
    numberOfSeats: '',
    licensePlate: '',
    assignedDevice: '',
    // remove organization and driver from formData
  });

  const [devices, setDevices] = useState<{ deviceUID: string; deviceName: string }[]>([]);


  useEffect(() => {
  if (isOpen) {
    fetchAllDevices();
  }
}, [isOpen]);


  const fetchAllDevices = async () => {
    try {
      const deviceData = await getAllDevices();
      const devicesArray = Object.values(deviceData || {}) as any[];
      setDevices(devicesArray);
    } catch (err) {
      console.error('Error loading devices', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.busName || !formData.model || !formData.numberOfSeats || !formData.licensePlate) {
      alert('Please fill in all required fields.');
      return;
    }

    const finalData = {
      ...formData,
      numberOfSeats: parseInt(formData.numberOfSeats, 10),
      organization: localStorage.getItem('organization') || '', // fetch from localStorage
      operatorUnit: localStorage.getItem('operatorUnit') || '', // fetch from localStorage
      driver: '', // send blank for now
    };

    try {
      await addNewBus(finalData);
      onSubmit();
    } catch (error) {
      alert('Failed to add bus.');
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X />
        </button>

        <h2 className="text-xl font-bold text-[#0A2A54] mb-4 text-center">Add New Bus</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Bus Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Bus Name *</label>
            <input
              type="text"
              name="busName"
              value={formData.busName}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Model *</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          {/* Number of Seats */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Seats *</label>
            <input
              type="number"
              name="numberOfSeats"
              value={formData.numberOfSeats}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
              min={1}
            />
          </div>

          {/* License Plate */}
          <div>
            <label className="block text-sm font-medium text-gray-700">License Plate *</label>
            <input
              type="text"
              name="licensePlate"
              value={formData.licensePlate}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          {/* Assigned Device Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Assigned Device</label>
            <select
              name="assignedDevice"
              value={formData.assignedDevice}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Assign Later</option>
              {devices.map((device) => (
                <option key={device.deviceUID} value={device.deviceUID}>
                  {device.deviceName}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="bg-yellow-400 text-[#0A2A54] font-semibold px-4 py-2 rounded-md hover:brightness-110 transition"
            >
              Add Bus
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewBus;