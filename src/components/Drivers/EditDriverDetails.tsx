import { FaTimes, FaEnvelope, FaPhone } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { getDriverDetails, updateDriverDetails } from '../../api/EditDriverApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Organizations from '../../pages/Admins/Organizations';

export default function EditDriverDetails({
  onClose,
  uid,
}: {
  onClose: () => void;
  uid: string;
}) {
  const [driverData, setDriverData] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload: any = {};
      
      for (const key in formData) {
        if (formData[key] !== driverData[key]) {
          payload[key] = formData[key];
        }
      }

      if (Object.keys(payload).length === 0) {
        toast.info('No changes made.');
        return;
      }

      await updateDriverDetails(uid, payload);
      toast.success('Successfully updated!');
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update.');
    }
  };

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const data = await getDriverDetails(uid);
        setDriverData(data);
        setFormData(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch driver:', err);
      }
    };

    fetchDriver();
  }, [uid]);

  if (loading) return null;
  const isEmailEditable = (driverData?.status?.status ?? '') === 'pending';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white w-full max-w-[80%] max-h-[90vh] shadow-lg overflow-y-auto relative p-6 space-y-4 rounded-lg">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-gray-600 hover:text-red-500 text-xl"
        >
          <FaTimes />
        </button>

        <h2 className="text-2xl font-bold text-[#0A2A54] text-center mb-4">
          Edit Driver Details
        </h2>

        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Personal Info */}
          <section className="bg-gray-100 p-4 rounded-lg mb-6">
            <h3 className="text-xl font-semibold text-[#0A2A54] mb-4">
              Driver Information
            </h3>

            <div className="flex flex-row gap-2 mb-6">
              <div className="w-1/3">
                <label className="block font-medium">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-full border px-4 py-2 rounded"
                />
              </div>

              <div className="w-1/3">
                <label className="block font-medium">First Name</label>
                <input
                  type="text"
                  value={formData.firstName || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full border px-4 py-2 rounded"
                />
              </div>

              <div className="w-1/3">
                <label className="block font-medium">Middle Name (Optional)</label>
                <input
                  type="text"
                  value={formData.middleName || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, middleName: e.target.value })
                  }
                  className="w-full border px-4 py-2 rounded"
                />
              </div>
            </div>

            <div className="flex gap-6 items-end">
              <div className="w-40">
                <label className="block font-medium">Birthdate</label>
                <input
                  type="date"
                  value={formData.birthdate || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, birthdate: e.target.value })
                  }
                  className="border px-4 py-2 rounded w-full"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">Gender</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === 'male'}
                      onChange={() =>
                        setFormData({ ...formData, gender: 'male' })
                      }
                    />
                    Male
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === 'female'}
                      onChange={() =>
                        setFormData({ ...formData, gender: 'female' })
                      }
                    />
                    Female
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Info */}
          <section className="bg-gray-100 p-4 rounded-lg mb-6">
            <h3 className="text-xl font-semibold text-[#0A2A54] mb-4">
              Contact Information
            </h3>

            <div className="flex gap-4">
              <div className="w-1/2 relative">
                <label className="block font-medium mb-1">Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    className="w-full border px-10 py-2 rounded bg-white"
                    placeholder="example@mail.com"
                    value={formData.email || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled={!isEmailEditable}
                  />
                </div>
              </div>

              <div className="w-1/2 relative">
                <label className="block font-medium mb-1">Contact Number</label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    className="w-full border px-10 py-2 rounded"
                    placeholder="09XX-XXX-XXXX"
                    value={formData.contactNumber || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, contactNumber: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Organization and operator unit */}
            <section className="bg-gray-100 p-4 rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-[#0A2A54] mb-4">Assignment</h3>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block font-medium">Transport Cooperative Name</label>
                  <input
                    type="text"
                    className="w-full border px-4 py-2 rounded"
                    value={formData.organization || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, organization: e.target.value })
                    }
                  />
                </div>
                <div className="w-1/2">
                  <label className="block font-medium">Operator Name</label>
                  <input
                    type="text"
                    className="w-full border px-4 py-2 rounded"
                    value={formData.operatorUnit || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, operatorUnit: e.target.value })
                    }
                  />
                </div>
              </div>
            </section>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-yellow-400 text-[#0A2A54] font-semibold px-4 py-2 rounded-md shadow hover:brightness-110 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
