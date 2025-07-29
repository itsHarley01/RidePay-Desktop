import { useEffect, useState } from 'react';
import AddNewBus from '../../components/Bus/AddNewBus';
import BusDetails from '../../components/Bus/BusDetails';
import { getAllBuses } from '../../api/busApi';
import { getDriverById } from '../../api/driverApi';

interface Bus {
  busUID: string;
  busName: string;
  model: string;
  numberOfSeats: number;
  licensePlate: string;
  assignedDevice?: string;
  organization: string;
  status: string;
  driver?: {
    value: string;
    name: string;
  };
}

const AllBus = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

const loadBuses = async () => {
  try {
    const data = await getAllBuses();
    const busArray = Object.values(data) as Bus[];

    // Map driver names using UID
    const busesWithDriverNames = await Promise.all(
      busArray.map(async (bus) => {
        const driverUID = bus.driver?.value || bus.driver;

        if (driverUID) {
          try {
            const driver = await getDriverById(driverUID);
            return {
              ...bus,
              driverName: `${driver.firstName} ${driver.lastName}`,
            };
          } catch {
            return {
              ...bus,
              driverName: 'Unknown Driver',
            };
          }
        }

        return {
          ...bus,
          driverName: 'Not Assigned',
        };
      })
    );

    setBuses(busesWithDriverNames);
  } catch (error) {
    console.error('Error loading buses:', error);
  }
};

  useEffect(() => {
    loadBuses();
  }, []);

  const filteredBuses = buses.filter(
    (bus) =>
      bus.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBuses.length / itemsPerPage);
  const currentBuses = filteredBuses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white shadow-md p-6 rounded-lg relative">
      {selectedBus && (
        <BusDetails
          bus={selectedBus}
          onClose={() => setSelectedBus(null)}
          onUpdateSuccess={loadBuses}
        />
      )}

      {isAddModalOpen && (
        <AddNewBus
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={() => {
            loadBuses();
            setIsAddModalOpen(false);
          }}
        />
      )}

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search bus..."
          className="border border-gray-300 px-4 py-2 rounded-md w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-yellow-400 text-[#0A2A54] font-semibold px-4 py-2 rounded-md shadow hover:brightness-110 transition"
        >
          + Add New Bus
        </button>
      </div>

      {filteredBuses.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No buses found.</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left bg-gray-100 text-[#0A2A54]">
                <tr>
                  <th className="p-3">Bus ID</th>
                  <th className="p-3">Bus Name</th>
                  <th className="p-3">Plate Number</th>
                  <th className="p-3">Capacity</th>
                  <th className="p-3">Organization</th>
                  <th className="p-3">Driver</th>
                  <th className="p-3">Device</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentBuses.map((bus, i) => (
                  <tr
                    key={bus.busUID}
                    className={i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}
                  >
                    <td className="p-3">{bus.busUID}</td>
                    <td className="p-3">{bus.busName}</td>
                    <td className="p-3">{bus.licensePlate}</td>
                    <td className="p-3">{bus.numberOfSeats}</td>
                    <td className="p-3">{bus.organization}</td>
                    <td className="p-3">{bus.driverName}</td>
                    <td className="p-3">{bus.assignedDevice || 'N/A'}</td>
                    <td className="p-3">{bus.status}</td>
                    <td className="p-3">
                      <button
                        onClick={() => setSelectedBus(bus)}
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

          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="px-3 py-1 bg-white border rounded shadow"
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded shadow ${
                    currentPage === i + 1
                      ? 'bg-yellow-400 text-[#0A2A54]'
                      : 'bg-white hover:bg-yellow-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="px-3 py-1 bg-white border rounded shadow"
              >
                &gt;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllBus;
