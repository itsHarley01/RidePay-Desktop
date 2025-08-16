import React, { useEffect, useState } from 'react';
import { FaTimes, FaEnvelope, FaPhone } from 'react-icons/fa';
import { registerAdmin } from '../../api/registerAdminApi';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

interface Admin {
  id: string;
  name: string;
  birthdate: string;
  gender: string;
  email: string;
  phone: string;
  organization: string;
  operatorUnit: string;
  role: string;
  status: 'pending' | 'approved' | 'activated' | 'deactivated';
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (admin: Admin) => void;
}

const AddNewAdmin: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [operatorUnit, setOperatorUnit] = useState('');
  const [role, setRole] = useState('');

  const loggedInRole = localStorage.getItem('role');

  // Define allowed roles for creation based on logged in role
  const roleOptions =
    loggedInRole === 'super-admin'
      ? [
          { label: 'Super Admin', value: 'super-admin' },
          { label: 'Admin Transport Cooperative', value: 'admin-transport-cooperative' },
          { label: 'Admin Operator', value: 'admin-operator' },
        ]
      : [
          // admin-transport-cooperative can only create operator
          { label: 'Admin Operator', value: 'admin-operator' },
        ];

  useEffect(() => {
    if (isOpen) {
      setFirstName('');
      setMiddleName('');
      setLastName('');
      setBirthdate('');
      setGender('');
      setEmail('');
      setPhone('');
      setOrganization('');
      setOperatorUnit('');
      setRole('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalOrganization = organization;
    let finalOperatorUnit = operatorUnit;

    if (loggedInRole === 'super-admin' && role === 'super-admin') {
      finalOrganization = 'DOTR';
      finalOperatorUnit = '';
    }

    if (loggedInRole === 'admin-transport-cooperative' && role === 'admin-operator') {
      finalOrganization = localStorage.getItem('organization') || '';
    }

    const adminData = {
      firstName,
      middleName,
      lastName,
      birthdate,
      gender,
      email,
      contactNumber: phone,
      role,
      organization: finalOrganization,
      operatorUnit: finalOperatorUnit,
    };

    try {
      await registerAdmin(adminData);
      console.log('✅ Admin registered successfully');

      onSubmit({
        id: `ADM-${Date.now()}`,
        name: `${lastName}, ${firstName}${middleName ? ' ' + middleName : ''}`,
        birthdate,
        gender,
        email,
        phone,
        organization: finalOrganization,
        operatorUnit,
        role,
        status: 'pending',
      });

      setFirstName('');
      setMiddleName('');
      setLastName('');
      setBirthdate('');
      setGender('');
      setEmail('');
      setPhone('');
      setOrganization('');
      setOperatorUnit('');
      setRole('');

      onClose();
    } catch (error: any) {
      console.error('❌ Failed to register admin:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Something went wrong while adding admin.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className="bg-white w-full max-w-[80%] max-h-[90vh] shadow-lg overflow-y-auto relative p-6 space-y-4 rounded-lg">
        <button onClick={onClose} className="absolute top-4 left-4 text-gray-600 hover:text-red-500 text-xl">
          <FaTimes />
        </button>

        <h2 className="text-2xl font-bold text-[#0A2A54] text-center mb-4">Add New Admin</h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Info */}
          <section className="bg-gray-100 p-4 rounded-lg mb-6">
            <h3 className="text-xl font-semibold text-[#0A2A54] mb-4">Admin Information</h3>

            <div className="flex flex-row gap-2 mb-6">
              <div className="w-1/3">
                <label className="block font-medium">Last Name</label>
                <input type="text" className="w-full border px-4 py-2 rounded" value={lastName} onChange={e => setLastName(e.target.value)} required />
              </div>
              <div className="w-1/3">
                <label className="block font-medium">First Name</label>
                <input type="text" className="w-full border px-4 py-2 rounded" value={firstName} onChange={e => setFirstName(e.target.value)} required />
              </div>
              <div className="w-1/3">
                <label className="block font-medium">Middle Name (Optional)</label>
                <input type="text" className="w-full border px-4 py-2 rounded" value={middleName} onChange={e => setMiddleName(e.target.value)} />
              </div>
            </div>

            <div className="flex gap-6 items-end">
              <div className="w-40">
                <label className="block font-medium">Birthdate</label>
                <input type="date" className="border px-4 py-2 rounded w-full" value={birthdate} onChange={e => setBirthdate(e.target.value)} required />
              </div>
              <div>
                <label className="block font-medium mb-2">Gender</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="gender" value="male" checked={gender === 'male'} onChange={e => setGender(e.target.value)} required /> Male
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="gender" value="female" checked={gender === 'female'} onChange={e => setGender(e.target.value)} required /> Female
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Info */}
          <section className="bg-gray-100 p-4 rounded-lg mb-6">
            <h3 className="text-xl font-semibold text-[#0A2A54] mb-4">Contact Information</h3>
            <div className="flex gap-4">
              <div className="w-1/2 relative">
                <label className="block font-medium mb-1">Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" className="w-full border px-10 py-2 rounded" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@mail.com" required />
                </div>
              </div>
              <div className="w-1/2 relative">
                <label className="block font-medium mb-1">Contact Number</label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" className="w-full border px-10 py-2 rounded" value={phone} onChange={e => setPhone(e.target.value)} placeholder="09XX-XXX-XXXX" required />
                </div>
              </div>
            </div>
          </section>

          {/* Role & Organization */}
          <section className="bg-gray-100 p-4 rounded-lg mb-6">
            <h3 className="text-xl font-semibold text-[#0A2A54] mb-4">Role & Organization</h3>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block font-medium">Role</label>
                <select className="w-full border px-4 py-2 rounded" value={role} onChange={e => setRole(e.target.value)} required>
                  <option value="">Select Role</option>
                  {roleOptions.map((r, index) => (
                    <option key={index} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Conditional Fields */}
              {loggedInRole === 'super-admin' && role !== 'super-admin' && role !== '' && (
                <div className="w-1/2">
                  <label className="block font-medium">Transport Cooperative Name</label>
                  <input type="text" className="w-full border px-4 py-2 rounded" value={organization} onChange={e => setOrganization(e.target.value)} />
                </div>
              )}

              {role === 'admin-operator' && (
                <div className="w-1/2">
                  <label className="block font-medium">Operator Name</label>
                  <input type="text" className="w-full border px-4 py-2 rounded" value={operatorUnit} onChange={e => setOperatorUnit(e.target.value)} required />
                </div>
              )}
            </div>
          </section>

          <div className="pt-4">
            <button type="submit" className="w-full bg-yellow-400 text-[#0A2A54] font-semibold px-4 py-2 rounded-md shadow hover:brightness-110 transition">
              Add New Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewAdmin;
