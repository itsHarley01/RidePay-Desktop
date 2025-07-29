import { useEffect, useState } from 'react';
import { getAllAdminUsers } from '../../api/getAllAdmins'; // Adjust path if needed
import DriverDetails from '../../components/Drivers/DriverDetails';
import AddNewDriver from '../../components/Drivers/AddNewDriver';
import { maskEmail, maskPhone } from '../../utils/stringMasking';

interface Driver {
  id: string;
  sysid: string;
  name: string;
  birthdate: string;
  gender: string;
  email: string;
  phone: string;
  organization: string;
  role: string;
  status: {
      status: 'pending' | 'approved' | 'activated' | 'deactivated';
      dateOfAccountCreation?: string;
      dateOfAccountApproval?: string;
      dateOfAccountActivation?: string;
      dateOfAccountDeactivation?: string;
    };
  bus: string;
}

const AllDrivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 8;

  const loadDrivers = async () => {
    try {
      const users = await getAllAdminUsers();
      const normalized = users.map((user: any) => ({
        id: user.uid,
        sysid: user.systemUid,
        name: `${user.firstName} ${user.middleName ? user.middleName + ' ' : ''}${user.lastName}`,
        birthdate: user.birthdate,
        gender: user.gender,
        email: user.email,
        phone: user.contactNumber,
        organization: user.organization,
        role: user.role,
        status: {
          status: user.status?.status ?? 'pending',
          dateOfAccountCreation: user.status?.dateOfAccountCreation,
          dateOfAccountApproval: user.status?.dateOfAccountApproval,
          dateOfAccountActivationn: user.status?.dateOfAccountActivation,
          dateOfAccountDeactivation: user.status?.dateOfAccountDeactivation,
        },
        bus: user.bus ?? 'Not yet assigned',
      }));

      const filtered = normalized.filter(
        (user) => user.role?.toLowerCase() === 'driver'
      );

      setDrivers(filtered);
    } catch (error) {
      console.error('Failed to load drivers:', error);
    }
  };

  useEffect(() => {
    loadDrivers();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchTerm) ||
      driver.sysid.toLowerCase().includes(searchTerm) ||
      driver.email.toLowerCase().includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDrivers = filteredDrivers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="bg-white shadow-md p-6 rounded-lg relative">
      {/* Driver Details Modal */}
      {selectedDriver && (
        <DriverDetails
          driver={{
            ...selectedDriver,
            status: selectedDriver.status.status,
            dateOfAccountCreation: selectedDriver.status.dateOfAccountCreation, 
            dateOfAccountApproval: selectedDriver.status.dateOfAccountApproval,
            dateOfAccountActivation: selectedDriver.status.dateOfAccountActivation,
          }}
          onClose={() => setSelectedDriver(null)}
          onUpdateSuccess={loadDrivers}
        />
      )}

      {/* Add Driver Modal */}
      {isAddModalOpen && (
        <AddNewDriver
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={() => {
            loadDrivers();
            setIsAddModalOpen(false);
          }}
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search driver..."
          className="border border-gray-300 px-4 py-2 rounded-md w-1/2"
          value={searchTerm}
          onChange={handleSearch}
        />
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-yellow-400 text-[#0A2A54] font-semibold px-4 py-2 rounded-md shadow hover:brightness-110 transition"
        >
          + Add New Driver
        </button>
      </div>

      {/* Table */}
      {filteredDrivers.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No drivers found.</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left bg-gray-100 text-[#0A2A54]">
                <tr>
                  <th className="p-3">Driver ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Organization</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentDrivers.map((driver, i) => (
                  <tr
                    key={driver.id}
                    className={i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}
                  >
                    <td className="p-3">{driver.sysid}</td>
                    <td className="p-3">{driver.name}</td>
                    <td className="p-3">{driver.organization}</td>
                    <td className="p-3">{maskPhone(driver.phone)}</td>
                    <td className="p-3">{maskEmail(driver.email)}</td>
                    <td className="p-3">
                      <div className="relative inline-block">
                        {driver.status.status === 'pending' && (
                          <span className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white z-10" />
                        )}
                        <button
                          onClick={() => setSelectedDriver(driver)}
                          className="text-sm bg-[#0A2A54] text-white px-3 py-1 rounded-md shadow hover:bg-opacity-90 transition"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
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

export default AllDrivers;
