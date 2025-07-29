import { X, User, Mail, Phone, Calendar, VenusAndMars, Building2, BadgeCheck, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import EditDriverDetails from './EditDriverDetails';
import ApprovalConfirmation from '../Admins/ApprovalConfirmation'; // ✅ Same component reused
import approveAccount from '../../api/accountApprovalApi'; // ✅ Make sure this path works
import { maskEmail, maskPhone } from '../../utils/stringMasking';

interface DriverDetailsProps {
  driver: {
    id: string;
    sysid: string;
    name: string;
    birthdate: string;
    gender: string;
    email: string;
    phone: string;
    organization: string;
    role: string;
    status: 'pending' | 'approved' | 'activated' | 'deactivated';
    otpCode?: string; // If applicable
    
    dateOfAccountCreation?: string;
    dateOfAccountApproval?: string;
    dateOfAccountActivation?: string;
    dateOfAccountDeactivation?: string;
  };
  onClose: () => void;
  onApproveSuccess: () => void;
}

const formatDateTime = (isoString: string): string => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const yyyy = date.toISOString().split('T')[0]; // YYYY-MM-DD
  const hhmm = date.toTimeString().slice(0, 5);  // HH:MM
  return `${yyyy} ${hhmm}`;
};

const DriverDetails = ({ driver, onClose, onApproveSuccess }: DriverDetailsProps) => {
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showOTPOnly, setShowOTPOnly] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  const handleApproveClick = () => {
    if (driver.status === 'approved') {
      setShowOTPOnly(true);
    } else {
      setShowConfirm(true);
    }
  };

  return (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <div className="bg-white w-full max-w-4xl rounded-lg shadow-xl p-8 relative flex flex-col">
      {/* Close Button */}
      <button onClick={onClose} className="absolute top-4 right-4">
        <X className="text-gray-500 hover:text-gray-700 w-6 h-6" />
      </button>

      {/* Title */}
      <h2 className="text-2xl font-bold text-[#0A2A54] text-center mb-6">Driver Details</h2>

      <div className="flex flex-col gap-8">
        {/* Top Profile & Status Section */}
        <div className="w-full flex flex-row items-center mb-2">
          <div className="flex flex-col items-center ml-6">
            <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center shadow-inner mb-4">
              <User className="text-gray-400 w-14 h-14" />
            </div>
            <h3 className="text-xl font-semibold text-[#0A2A54]">{driver.name}</h3>
            <p className="text-sm font-semibold text-[#0A2A54]">{driver.sysid}</p>
          </div>

          <div className="flex-1 h-full flex flex-col items-center justify-center">
            <div
              className={`text-lg font-semibold ${
                driver.status === 'pending'
                  ? 'text-orange-500'
                  : driver.status === 'approved'
                  ? 'text-blue-500'
                  : driver.status === 'activated'
                  ? 'text-green-600'
                  : 'text-gray-500'
              }`}
            >
              {driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
            </div>
            <div className="text-sm text-gray-600 text-center mt-2 max-w-md">
              {driver.status === 'pending' && (
                <p>
                  This account is <span className="font-medium">pending for approval</span>. An administrator must approve it before the user can continue with registration.
                </p>
              )}
              {driver.status === 'approved' && (
                <p>
                  This account has been <span className="font-medium">approved</span>. The user can now proceed with registration. An OTP has been sent to their email and is valid for 24 hours.
                </p>
              )}
              {driver.status === 'activated' && (
                <p>
                  This account is <span className="font-medium">activated</span>. The user can log in and access the system according to their assigned role.
                </p>
              )}
              {driver.status === 'deactivated' && (
                <p>
                  This account is <span className="font-medium text-red-500">deactivated</span> and cannot be used to access the system.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Info Grid with Icons */}
        <div className="bg-gray-50 py-10 px-4 grid border border-gray-200 grid-cols-2 gap-4 rounded-md text-gray-800 text-sm">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <Mail className="text-gray-600 w-4 h-4" />
              <span className="font-semibold">Email:</span>
            </span>
            <span className="flex items-center gap-1">
              {showEmail ? driver.email : maskEmail(driver.email)}
              <button onClick={() => setShowEmail(!showEmail)} className="ml-2 text-gray-500 hover:text-gray-700">
                {showEmail ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <Phone className="text-gray-600 w-4 h-4" />
              <span className="font-semibold">Phone:</span>
            </span>
            <span className="flex items-center gap-1">
              {showPhone ? driver.phone : maskPhone(driver.phone)}
              <button onClick={() => setShowPhone(!showPhone)} className="ml-2 text-gray-500 hover:text-gray-700">
                {showPhone ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <Calendar className="text-gray-600 w-4 h-4" />
              <span className="font-semibold">Birthdate:</span>
            </span>
            <span>{driver.birthdate}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <VenusAndMars className="text-gray-600 w-4 h-4" />
              <span className="font-semibold">Gender:</span>
            </span>
            <span>{driver.gender}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <Building2 className="text-gray-600 w-4 h-4" />
              <span className="font-semibold">Organization:</span>
            </span>
            <span>{driver.organization}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <BadgeCheck className="text-gray-600 w-4 h-4" />
              <span className="font-semibold">Role:</span>
            </span>
            <span>{driver.role}</span>
          </div>
        </div>
                  {/* Date of Info */}
          {(driver.dateOfAccountCreation ||
            driver.dateOfAccountApproval ||
            driver.dateOfAccountActivation ||
            driver.dateOfAccountDeactivation) && (
            <div className="text-xs text-gray-600 self-start">
              <p className="font-bold text-gray-700 mb-1">Date & time of:</p>
              <ul className="space-y-1">
                {driver.dateOfAccountCreation && (
                  <li>
                    <span className="font-semibold">Creation:</span>{' '}
                    {formatDateTime(driver.dateOfAccountCreation)}
                  </li>
                )}
                {driver.dateOfAccountApproval && (
                  <li>
                    <span className="font-semibold">Approved:</span>{' '}
                    {formatDateTime(driver.dateOfAccountApproval)}
                  </li>
                )}
                {driver.dateOfAccountActivation && (
                  <li>
                    <span className="font-semibold">Registered:</span>{' '}
                    {formatDateTime(driver.dateOfAccountActivation)}
                  </li>
                )}
                {driver.dateOfAccountDeactivation && (
                  <li>
                    <span className="font-semibold">Deactivated:</span>{' '}
                    {formatDateTime(driver.dateOfAccountDeactivation)}
                  </li>
                )}
              </ul>
            </div>
          )}

        {/* Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setShowEditPanel(true)}
            className="bg-yellow-400 text-[#0A2A54] px-4 py-2 rounded-md font-semibold hover:brightness-110 transition"
          >
            Edit
          </button>
          {(driver.status === 'pending' || driver.status === 'approved') && (
            <button
              onClick={handleApproveClick}
              className="bg-green-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-600 transition"
            >
              {driver.status === 'pending' ? 'Approve' : 'View OTP'}
            </button>
          )}
        </div>
      </div>
    </div>

    {/* OTP/Approval Modal */}
    {(showConfirm || showOTPOnly) && (
      <ApprovalConfirmation
        adminId={driver.id}
        adminName={driver.name}
        skipConfirmation={showOTPOnly}
        onConfirm={async () => {
          try {
            await approveAccount(driver.id);
            onApproveSuccess();
            setShowConfirm(false);
            onClose();
          } catch (error) {
            console.error('Approval failed:', error);
          }
        }}
        onClose={() => {
          setShowConfirm(false);
          setShowOTPOnly(false);
        }}
      />
    )}

    {/* Edit Panel */}
    {showEditPanel && (
      <EditDriverDetails uid={driver.id} onClose={() => setShowEditPanel(false)} />
    )}
  </div>
);
};


export default DriverDetails;
