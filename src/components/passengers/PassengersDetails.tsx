import { X, User, Mail, Phone, Calendar, VenusAndMars, BadgeCheck, Eye, EyeOff, Wallet, CreditCard } from 'lucide-react';
import { useState } from 'react';
import { maskEmail, maskPhone } from '../../utils/stringMasking';


interface PassengerDetailsProps {
  passenger: {
    id: string;
    systemUID: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    birthdate: string;
    gender: string;
    email: string;
    phone: string;
    status: string;
    balance: number;
    cardId: string;

    dateOfAccountCreation?: string;
    dateOfAccountDeactivation?: string;

  };
  onClose: () => void;
}

const formatDateTime = (isoString: string): string => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const yyyy = date.toISOString().split('T')[0]; // YYYY-MM-DD
  const hhmm = date.toTimeString().slice(0, 5);  // HH:MM
  return `${yyyy} ${hhmm}`;
};

export default function PassengerDetails({ passenger, onClose }: PassengerDetailsProps) {
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showBalance, setShowBalance] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-xl p-8 relative flex flex-col">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4">
          <X className="text-gray-500 hover:text-gray-700 w-6 h-6" />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-[#0A2A54] text-center mb-6">Passenger Details</h2>

        <div className="flex flex-col gap-8 mb-4">
          {/* Top Profile & Balance Section */}
          <div className="w-full flex flex-row items-center mb-2">
            <div className="flex flex-col items-center ml-6">
              <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center shadow-inner mb-4">
                <User className="text-gray-400 w-14 h-14" />
              </div>
              <h3 className="text-xl font-semibold text-[#0A2A54]">
                {passenger.firstName} {passenger.middleName || ''} {passenger.lastName}
              </h3>
              <p className="text-sm font-semibold text-[#0A2A54]">{passenger.systemUID}</p>
            </div>

            <div className="flex-1 h-full flex flex-col items-center justify-center">
              <div className="text-3xl font-semibold text-green-600 flex items-center gap-2">
                <Wallet className="w-10 h-10" />
                {showBalance ? `₱${passenger.balance.toFixed(2)}` : '₱••••'}
                <button onClick={() => setShowBalance(!showBalance)} className="ml-2 text-gray-500 hover:text-gray-700">
                  {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
              <div className="text-sm text-gray-600 text-center mt-2">
                Passenger's wallet balance
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="bg-gray-50 py-10 px-4 grid border border-gray-200 grid-cols-2 gap-4 rounded-md text-gray-800 text-sm">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <Mail className="text-gray-600 w-4 h-4" />
                <span className="font-semibold">Email:</span>
              </span>
              <span className="flex items-center gap-1">
                {showEmail ? passenger.email || "N/A" : maskEmail(passenger.email) || "N/A"}
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
                {showPhone ? passenger.phone || "N/A": maskPhone(passenger.phone) || "N/A"}
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
              <span>{passenger.birthdate || "N/A"}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <VenusAndMars className="text-gray-600 w-4 h-4" />
                <span className="font-semibold">Gender:</span>
              </span>
              <span>{passenger.gender || "N/A"}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <BadgeCheck className="text-gray-600 w-4 h-4" />
                <span className="font-semibold">Status:</span>
              </span>
              <span>{passenger.status}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <CreditCard className="text-gray-600 w-4 h-4" />
                <span className="font-semibold">Card Id:</span>
              </span>
              <span>{passenger.cardId || "N/A"}</span>
            </div>


          </div>

        </div>

    {/* Date of Info */}
          {(passenger.dateOfAccountCreation ||
            passenger.dateOfAccountDeactivation) && (
            <div className="text-xs text-gray-600 self-start">
              <p className="font-bold text-gray-700 mb-1">Date & time of:</p>
              <ul className="space-y-1">
                {passenger.dateOfAccountCreation && (
                  <li>
                    <span className="font-semibold">Creation:</span>{' '}
                    {formatDateTime(passenger.dateOfAccountCreation)}
                  </li>
                )}
                {passenger.dateOfAccountDeactivation && (
                  <li>
                    <span className="font-semibold">Deactivated:</span>{' '}
                    {formatDateTime(passenger.dateOfAccountDeactivation)}
                  </li>
                )}
              </ul>
            </div>
          )}
      </div>
    </div>
  );
}
