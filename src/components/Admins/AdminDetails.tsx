import { X, User, Mail, Phone, Calendar, VenusAndMars, Building2, BadgeCheck, Eye, EyeOff } from 'lucide-react';
import ApprovalConfirmation from './ApprovalConfirmation';
import { useState, useEffect } from 'react';
import approveAccount from '../../api/accountApprovalApi';
import EditAdminDetails from './EditAdminDetails';
import { maskEmail, maskPhone } from '../../utils/stringMasking';
import { getRequirements } from '../../api/requirementsApi';

interface AdminDetailsProps {
  admin: {
    id: string;
    sysid: string;
    name: string;
    birthdate: string;
    gender: string;
    email: string;
    phone: string;
    organization: string;
    operatorUnit: string;
    role: string;
    status: 'pending' | 'approved' | 'activated' | 'deactivated';
    otpCode?: string;

    dateOfAccountCreation?: string;
    dateOfAccountApproval?: string;
    dateOfAccountActivation?: string;
    dateOfAccountDeactivation?: string;
  };
  onClose: () => void;
  onApprove?: (id: string) => void;
  onApproveSuccess: () => void;
}

const formatDateTime = (isoString: string): string => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const yyyy = date.toISOString().split('T')[0]; // YYYY-MM-DD
  const hhmm = date.toTimeString().slice(0, 5);  // HH:MM
  return `${yyyy} ${hhmm}`;
};


const AdminDetails = ({ admin, onClose, onApprove, onApproveSuccess }: AdminDetailsProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showOTPOnly, setShowOTPOnly] = useState(false);
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [requirements, setRequirements] = useState([]);
  const [filePreviews, setFilePreviews] = useState({});



  const loggedInUID = localStorage.getItem('uid');
  const loggedInSYSID = localStorage.getItem('sysid');
  const isViewingOwnAccount = admin.id === loggedInUID && admin.sysid === loggedInSYSID;
  const loggedInRole = localStorage.getItem('role');
  const isSuperAdmin = loggedInRole === 'super-admin';
  const isTransportCoopAdmin = loggedInRole === 'admin-transport-cooperative';

// Determine if current user is allowed to edit the viewed admin
  const canEditAdmin = () => {
    if (isViewingOwnAccount) return false;
    if (isSuperAdmin) return true;
    if (
      isTransportCoopAdmin &&
      (admin.role === 'super-admin' || admin.role === 'admin-transport-cooperative')
    ) {
      return false;
    }
    return true;
  };

  useEffect(() => {
  let category = null;
  if (admin.role === "admin-transport-cooperative") {
    category = "coop";
  } else if (admin.role === "admin-operator") {
    category = "operator";
  }

  if (category) {
    getRequirements(category).then(setRequirements);
  }
}, [admin.role]);

const handleFileChange = (reqId, file) => {
  if (!file) return;

  if (file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (e) => {
      setFilePreviews((prev) => ({
        ...prev,
        [reqId]: { type: "image", url: e.target.result, name: file.name }
      }));
    };
    reader.readAsDataURL(file);
  } else if (file.type === "application/pdf") {
    setFilePreviews((prev) => ({
      ...prev,
      [reqId]: { type: "pdf", name: file.name }
    }));
  }
};


  const canApproveAdmin = () => {
    if (!onApprove) return false; // No handler passed
    if (admin.status !== 'pending' && admin.status !== 'approved') return false;
    if (isSuperAdmin) return true;
    if (isTransportCoopAdmin && admin.role === 'admin-operator') return true;
    return false;
  };

  const handleApproveClick = () => {
    if (admin.status === 'approved') {
      setShowOTPOnly(true);
    } else {
      setShowConfirm(true);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-orange-500';
      case 'approved':
        return 'text-blue-500';
      case 'activated':
        return 'text-green-600';
      case 'deactivated':
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-lg shadow-xl p-8 relative flex flex-col">

        <div className="overflow-y-auto p-8">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4">
          <X className="text-gray-500 hover:text-gray-700 w-6 h-6" />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-[#0A2A54] text-center mb-6">Account Details</h2>

        {/* Main Layout */}
        <div className="flex flex-col gap-8">

        <div className='w-full flex flex-row items-center mb-2'>
          {/* Left Profile Section */}
          <div className="flex flex-col items-center ml-6">
            <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center shadow-inner mb-4">
              <User className="text-gray-400 w-14 h-14" />
            </div>
            <h3 className="text-xl font-semibold text-[#0A2A54]">{admin.name}</h3>
            <p className="text-sm font-semibold text-[#0A2A54]">{admin.sysid}</p>
          </div>

          {/* Right Info Section */}
          <div className="flex-1 h-full flex flex-col items-center justify-center ">
            <div className={`text-lg font-semibold ${getStatusColor(admin.status)}`}>
              {admin.status.charAt(0).toUpperCase() + admin.status.slice(1)}
            </div>

            <div className="text-sm text-gray-600 text-center mt-2 max-w-md">
              {admin.status === 'pending' && (
                <p>
                  This account is <span className="font-medium">pending for approval</span>. An administrator must approve it before the user can continue with registration.
                </p>
              )}
              {admin.status === 'approved' && (
                <p>
                  This account has been <span className="font-medium">approved</span>. The user can now proceed with registration. An OTP has been sent to their email and is valid for 24 hours.
                </p>
              )}
              {admin.status === 'activated' && (
                <p>
                  This account is <span className="font-medium">activated</span>. The user can log in and access the system according to their assigned role.
                </p>
              )}
              {admin.status === 'deactivated' && (
                <p>
                  This account is <span className="font-medium text-red-500">deactivated</span> and cannot be used to access the system.
                </p>
              )}
            </div>
          </div>
        </div>
        
          {/* Admin Info with Icons */}
          <div className="bg-gray-50 py-10 px-4 grid border border-gray-200 grid-cols-2 gap-4 rounded-md text-gray-800 text-sm ">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <Mail className="text-gray-600 w-4 h-4" />
                <span className="font-semibold">Email:</span>
              </span>
              <span className="flex items-center gap-1">
                {showEmail ? admin.email : maskEmail(admin.email)}
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
                  {showPhone ? admin.phone : maskPhone(admin.phone)}
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
              <span>{admin.birthdate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <VenusAndMars className="text-gray-600 w-4 h-4" />
                <span className="font-semibold">Gender:</span>
              </span>
              <span>{admin.gender}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <Building2 className="text-gray-600 w-4 h-4" />
                <span className="font-semibold">Transport Cooperative:</span>
              </span>
              <span>{admin.organization}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <BadgeCheck className="text-gray-600 w-4 h-4" />
                <span className="font-semibold">Role:</span>
              </span>
              <span>{admin.role}</span>
            </div>
            {admin.role == 'admin-operator' && (
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <Building2 className="text-gray-600 w-4 h-4" />
                <span className="font-semibold">Operator Name:</span>
              </span>
              <span>{admin.operatorUnit}</span>
            </div>
            )}
          </div>

          {/* Date of Info */}
          {(admin.dateOfAccountCreation ||
            admin.dateOfAccountApproval ||
            admin.dateOfAccountActivation ||
            admin.dateOfAccountDeactivation) && (
            <div className="text-xs text-gray-600 self-start">
              <p className="font-bold text-gray-700 mb-1">Date & time of:</p>
              <ul className="space-y-1">
                {admin.dateOfAccountCreation && (
                  <li>
                    <span className="font-semibold">Creation:</span>{' '}
                    {formatDateTime(admin.dateOfAccountCreation)}
                  </li>
                )}
                {admin.dateOfAccountApproval && (
                  <li>
                    <span className="font-semibold">Approved:</span>{' '}
                    {formatDateTime(admin.dateOfAccountApproval)}
                  </li>
                )}
                {admin.dateOfAccountActivation && (
                  <li>
                    <span className="font-semibold">Registered:</span>{' '}
                    {formatDateTime(admin.dateOfAccountActivation)}
                  </li>
                )}
                {admin.dateOfAccountDeactivation && (
                  <li>
                    <span className="font-semibold">Deactivated:</span>{' '}
                    {formatDateTime(admin.dateOfAccountDeactivation)}
                  </li>
                )}
              </ul>
            </div>
          )}

        {requirements.map((req) => (
          <div key={req.id} className="flex flex-col border border-gray-200 rounded-md p-4 mb-4">
            <label className="font-semibold text-gray-700 mb-2">{req.name}</label>
            <input
              type="file"
              accept={
                req.inputType === "image"
                  ? "image/*"
                  : req.inputType === "image/pdf"
                  ? "image/*,application/pdf"
                  : "*/*"
              }
              onChange={(e) => handleFileChange(req.id, e.target.files[0])}
              className="border border-gray-300 rounded-md p-2"
            />

            {/* Preview */}
            {filePreviews[req.id] && filePreviews[req.id].type === "image" && (
              <img
                src={filePreviews[req.id].url}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover rounded-md border"
              />
            )}
            {filePreviews[req.id] && filePreviews[req.id].type === "pdf" && (
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                📄 {filePreviews[req.id].name}
              </div>
            )}
          </div>
        ))}

          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            {canEditAdmin() && (
              <button
                onClick={() => setShowEditPanel(true)}
                className="bg-yellow-400 text-[#0A2A54] px-4 py-2 rounded-md font-semibold hover:brightness-110 transition"
              >
                Edit
              </button>
            )}
            {canApproveAdmin() && (
              <button
                onClick={handleApproveClick}
                className="bg-green-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-600 transition"
              >
                {admin.status === 'pending' ? 'Approve' : 'View OTP'}
              </button>
            )}
          </div>
          {isViewingOwnAccount && (
            <div className="text-center">
              <span className="text-sm font-bold text-blue-700 tracking-wide">YOUR ACCOUNT</span>
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Confirm or OTP */}
      {(showConfirm || showOTPOnly) && (
        <ApprovalConfirmation
          adminId={admin.id}
          adminName={admin.name}
          skipConfirmation={showOTPOnly}
          onConfirm={async () => {
            try {
              await approveAccount(admin.id);
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
      {showEditPanel && <EditAdminDetails uid={admin.id} onClose={() => setShowEditPanel(false)} />}
    </div>
  );
};

export default AdminDetails;
