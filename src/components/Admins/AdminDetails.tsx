import { X, User } from 'lucide-react';
import ApprovalConfirmation from './ApprovalConfirmation';
import { useState } from 'react';

interface AdminDetailsProps {
  admin: {
    id: string;
    name: string;
    birthdate: string;
    gender: string;
    email: string;
    phone: string;
    organization: string;
    role: string;
    status: 'pending' | 'approved' | 'running' | 'deactivated';
    otpCode?: string;
  };
  onClose: () => void;
  onApprove?: (id: string) => void;
}

const AdminDetails = ({ admin, onClose, onApprove }: AdminDetailsProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showOTPOnly, setShowOTPOnly] = useState(false);

  const handleApproveClick = () => {
    if (admin.status === 'approved') {
      setShowOTPOnly(true);
    } else {
      setShowConfirm(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4">
          <X className="text-gray-500 hover:text-gray-700" />
        </button>

        {/* Status Label */}
        <div
          className={`text-center mb-2 font-bold text-lg ${
            admin.status === 'pending'
              ? 'text-orange-500'
              : admin.status === 'approved'
              ? 'text-blue-500'
              : admin.status === 'running'
              ? 'text-green-600'
              : 'text-gray-500'
          }`}
        >
          {admin.status.charAt(0).toUpperCase() + admin.status.slice(1)}
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-[#0A2A54] text-center mb-4">Account Details</h2>

        {/* Profile */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-3 shadow-inner">
            <User className="text-gray-400 w-12 h-12" />
          </div>
          <h3 className="text-xl font-semibold text-[#0A2A54]">{admin.name}</h3>
        </div>

        {/* Admin Info */}
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="font-medium text-gray-600">Email</span>
            <span className="text-right text-gray-800">{admin.email}</span>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <span className="font-medium text-gray-600">Contact Number</span>
            <span className="text-right text-gray-800">{admin.phone}</span>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <span className="font-medium text-gray-600">Birthdate</span>
            <span className="text-right text-gray-800">{admin.birthdate}</span>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <span className="font-medium text-gray-600">Gender</span>
            <span className="text-right text-gray-800">{admin.gender}</span>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <span className="font-medium text-gray-600">Organization</span>
            <span className="text-right text-gray-800">{admin.organization}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-600">Role</span>
            <span className="text-right text-gray-800">{admin.role}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-2">
          <button className="bg-yellow-400 text-[#0A2A54] px-4 py-2 rounded-md font-semibold hover:brightness-110 transition">
            Edit
          </button>
          {(admin.status === 'pending' || admin.status === 'approved') && onApprove && (
            <button
              onClick={handleApproveClick}
              className="bg-green-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-600 transition"
            >
              {admin.status === 'pending' ? 'Approve' : 'View OTP'}
            </button>
          )}
        </div>
      </div>

      {(showConfirm || showOTPOnly) && (
        <ApprovalConfirmation
          adminName={admin.name}
          otpCode={admin.otpCode || '-----'}
          skipConfirmation={showOTPOnly} 
          onConfirm={() => {
            onApprove?.(admin.id);
          }}
          onClose={() => {
            setShowConfirm(false);
            setShowOTPOnly(false);
          }}
        />
      )}
    </div>
  );
};

export default AdminDetails;