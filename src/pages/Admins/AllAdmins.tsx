import { useEffect, useState } from 'react';
import AddNewAdmin from '../../components/Admins/AddNewAdmin';
import AdminDetails from '../../components/Admins/AdminDetails';

interface Admin {
  id: string;
  name: string;
  birthdate: string;
  gender: string;
  email: string;
  phone: string;
  organization: string;
  role: string;
  status: 'pending' | 'approved' | 'running' | 'deactivated';
}

const AllAdmins = () => {
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // ✅ Load temporary admins on first mount
  useEffect(() => {
    const sampleAdmins: Admin[] = [
      {
        id: 'A001',
        name: 'Juan Dela Cruz',
        birthdate: '1990-01-01',
        gender: 'Male',
        email: 'juan@example.com',
        phone: '09171234567',
        organization: 'IT Department',
        role: 'System Administrator',
        status: 'pending',
      },
      {
        id: 'A002',
        name: 'Maria Clara',
        birthdate: '1992-05-15',
        gender: 'Female',
        email: 'maria@example.com',
        phone: '09181234567',
        organization: 'HR Department',
        role: 'HR Admin',
        status: 'approved',
      },
      {
        id: 'A003',
        name: 'Jose Rizal',
        birthdate: '1989-12-30',
        gender: 'Male',
        email: 'jose@example.com',
        phone: '09192223333',
        organization: 'Research Dept.',
        role: 'Lead Researcher',
        status: 'running',
      },
    ];

    setAdmins(sampleAdmins);
  }, []);

  const handleAddAdmin = (admin: Admin) => {
    setAdmins((prev) => [...prev, admin]);
    setShowAddAdmin(false);
  };

  const totalPages = Math.ceil(admins.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAdmins = admins.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white shadow-md p-6 rounded-lg relative">
      <AddNewAdmin
        isOpen={showAddAdmin}
        onClose={() => setShowAddAdmin(false)}
        onSubmit={handleAddAdmin}
      />

      {selectedAdmin && (
        <AdminDetails
          admin={selectedAdmin}
          onClose={() => setSelectedAdmin(null)}
          onApprove={(id) => {
    // your approve logic here
    console.log("Approving admin with ID:", id);
  }}
        />
      )}

      {/* Search + Add Admin Button */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search admin..."
          className="border border-gray-300 px-4 py-2 rounded-md w-1/2"
        />
        <button
          onClick={() => setShowAddAdmin(true)}
          className="bg-yellow-400 text-[#0A2A54] font-semibold px-4 py-2 rounded-md shadow hover:brightness-110 transition"
        >
          Add New Admin
        </button>
      </div>

      {/* Table or Empty State */}
      {admins.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No admins found.</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left bg-gray-100 text-[#0A2A54]">
                <tr>
                  <th className="p-3">Admin ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Organization</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentAdmins.map((admin, i) => (
                  <tr key={admin.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                    <td className="p-3">{admin.id}</td>
                    <td className="p-3">{admin.name}</td>
                    <td className="p-3">{admin.organization}</td>
                    <td className="p-3">{admin.role}</td>
                    <td className="p-3">{admin.phone}</td>
                    <td className="p-3">{admin.email}</td>
                    <td className="p-3">
                        <div className="relative inline-block">
                          {/* Red dot if pending */}
                          {admin.status === 'pending' && (
                            <span className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white z-10" />
                          )}
                          <button
                            onClick={() => setSelectedAdmin(admin)}
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

export default AllAdmins;
