import { useEffect, useState } from 'react';
import AddNewAdmin from '../../components/Admins/AddNewAdmin';
import AdminDetails from '../../components/Admins/AdminDetails';
import { getAllAdminUsers } from '../../api/getAllAdmins';
import { maskEmail, maskPhone } from '../../utils/stringMasking';

interface Admin {
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
}

const AllAdmins = () => {
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const allowedRoles = [
  'admin',
  'super-admin',
  'admin-transport-cooperative',
  'admin-operator',
  'admin-hr',
  'admin-driver',
  'admin-accountant',
];


  // ✅ Move this outside useEffect so you can reuse it
const loadAdmins = async () => {
  try {
    const users = await getAllAdminUsers();
    console.log('Fetched users from API:', users); // DEBUG

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
        dateOfAccountActivation: user.status?.dateOfAccountActivation,
        dateOfAccountDeactivation: user.status?.dateOfAccountDeactivation,
      },
    }));

    const filtered = normalized.filter(user =>
      allowedRoles.includes(user.role?.toLowerCase())
    );


    setAdmins(filtered);
  } catch (error) {
    console.error('Failed to load admins:', error);
  }
};



  // ✅ Now use it here properly
  useEffect(() => {
    loadAdmins();
  }, []);


  const totalPages = Math.ceil(admins.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAdmins = admins.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white shadow-md p-6 rounded-lg relative">
      <AddNewAdmin
        isOpen={showAddAdmin}
        onClose={() => setShowAddAdmin(false)}
        onSubmit={() => {
          setShowAddAdmin(false);
          loadAdmins();
        }}
      />

      {selectedAdmin && (
        <AdminDetails
          admin={{
            ...selectedAdmin,
            status: selectedAdmin.status.status,
            dateOfAccountCreation: selectedAdmin.status.dateOfAccountCreation,
            dateOfAccountApproval: selectedAdmin.status.dateOfAccountApproval,
            dateOfAccountActivation: selectedAdmin.status.dateOfAccountActivation,
            dateOfAccountDeactivation: selectedAdmin.status.dateOfAccountDeactivation,
          }}
          onClose={() => setSelectedAdmin(null)}
          onApprove={() => {
            setSelectedAdmin(null);
            loadAdmins();
          }}
          onApproveSuccess={loadAdmins}
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
                    <td className="p-3">{admin.sysid}</td>
                    <td className="p-3">{admin.name}</td>
                    <td className="p-3">{admin.organization}</td>
                    <td className="p-3">{admin.role}</td>
                    <td className="p-3">{maskPhone(admin.phone)}</td>
                    <td className="p-3">{maskEmail(admin.email)}</td>
                    <td className="p-3">
                        <div className="relative inline-block">
                          {/* Red dot if pending */}
                          {admin.status.status === 'pending' && (
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
