import { useEffect, useState } from 'react';
import { X, CheckCircle, HelpCircle } from 'lucide-react';
import { fetchUserById } from '../../api/fetchUserApi'; // Make sure this import works

interface ApprovalConfirmationProps {
  adminId: string; // 🔄 Use this to fetch OTP
  adminName: string;
  onConfirm: () => void;
  onClose: () => void;
  skipConfirmation?: boolean;
}

const ApprovalConfirmation = ({
  adminId,
  adminName,
  onConfirm,
  onClose,
  skipConfirmation,
}: ApprovalConfirmationProps) => {
  const [confirmed, setConfirmed] = useState(skipConfirmation ?? false);
  const [otpCode, setOtpCode] = useState<string>('-----');

  useEffect(() => {
    const fetchOtp = async () => {
      try {
        const user = await fetchUserById(adminId);
        const code = user?.OTP?.code || '-----';
        console.log('Fetched OTP Code:', code);
        console.log('Fetched:', user);
        setOtpCode(code);
      } catch (err) {
        console.error('Failed to fetch OTP code:', err);
        setOtpCode('-----');
      }
    };

    // Only fetch OTP after confirmation OR if skipConfirmation is true
    if (confirmed || skipConfirmation) {
      fetchOtp();
    }
  }, [adminId, confirmed, skipConfirmation]);

  const handleConfirm = () => {
    setConfirmed(true);
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-8 relative text-center animate-fade-in">
        <button onClick={onClose} className="absolute top-4 right-4">
          <X className="text-gray-400 hover:text-gray-600 w-5 h-5" />
        </button>

        {!confirmed ? (
          <>
            <div className="flex justify-center mb-4">
              <div className="bg-yellow-100 text-yellow-600 rounded-full p-4">
                <HelpCircle className="w-10 h-10" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-[#0A2A54] mb-3">Approve Account</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to approve the creation of <strong>{adminName}</strong>'s account?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={onClose}
                className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
              >
                No
              </button>
              <button
                onClick={handleConfirm}
                className="bg-green-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-green-600 transition"
              >
                Yes
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 text-green-600 rounded-full p-4">
                <CheckCircle className="w-10 h-10" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-green-600 mb-3">Account Approved</h2>
            <p className="text-gray-700 mb-2">
              <strong>{adminName}</strong>'s account is approved. Waiting for the account owner to sign up.
            </p>
            <p className="text-sm text-gray-600 mb-4">
              This code is sent to the new account owner's email:
            </p>
            <div className="bg-gray-100 border rounded-lg text-2xl font-mono font-semibold py-3 px-6 inline-block mb-2">
              {otpCode}
            </div>
            <p className="text-sm text-gray-500">This code will expire in 24 hours.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ApprovalConfirmation;
