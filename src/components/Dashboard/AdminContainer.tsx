import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllAdminUsers } from '../../api/getAllAdmins';
import { UserCircle } from 'lucide-react';

const allowedRoles = ['super-admin', 'admin-transport-cooperative', 'admin-operator'];

const AdminContainer = () => {
  const [admins, setAdmins] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const allUsers = await getAllAdminUsers();
        const filteredAdmins = allUsers.filter(
          (admin: any) =>
            allowedRoles.includes(admin.role) && admin.status?.status === 'activated'
        );
        setAdmins(filteredAdmins);
      } catch (error) {
        console.error('Failed to fetch admins:', error);
      }
    };

    fetchAdmins();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full h-full md:max-w-xs">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md font-semibold">Admins</h3>
        <button
          onClick={() => navigate('/dashboard/admins')}
          className="text-xs bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 transition"
        >
          View all
        </button>
      </div>

      <div className="space-y-4">
        {admins.map((admin: any, index: number) => (
          <div key={index} className="flex items-center gap-3">
            <div className="text-gray-600">
              <UserCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium">
                {admin.firstName} {admin.lastName}
              </p>
              <p className="text-xs text-gray-500">{admin.role}</p>
            </div>
          </div>
        ))}

        {admins.length === 0 && (
          <p className="text-sm text-gray-500">No active admins available.</p>
        )}
      </div>
    </div>
  );
};

export default AdminContainer;
