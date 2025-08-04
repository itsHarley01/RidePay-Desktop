import React, { useEffect, useState } from 'react';
import { getAllPassengers } from '../../api/passengerApi';
import { FaUser, FaMoneyBillWave } from 'react-icons/fa';
import { topUpUserBalance } from '../../api/topUpApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface User {
  uid: string;
  systemUid: string;
  firstName: string;
  lastName: string;
  balance: number;
}

export default function TopUp() {
  const [passengers, setPassengers] = useState<User[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [selectedPassenger, setSelectedPassenger] = useState<User | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    getAllPassengers().then(setPassengers).catch(console.error);
  }, []);

  const filteredPassengers = passengers.filter(user =>
    `${user.firstName} ${user.lastName} ${user.uid}`.toLowerCase().includes(searchInput.toLowerCase())
  );

  const handleSelectPassenger = (user: User) => {
    setSelectedPassenger(user);
    setSearchInput(`${user.firstName} ${user.lastName}`);
  };

  const handleAmountClick = (amount: number) => {
    setIsCustom(false);
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCustom(true);
    setSelectedAmount(null);
    setCustomAmount(e.target.value);
  };

  const isFormValid = selectedPassenger && (selectedAmount || (isCustom && customAmount));

  const handleTopUp = async () => {
    if (!isFormValid) return;
    const amount = isCustom ? Number(customAmount) : selectedAmount;

    try {
      await topUpUserBalance({
        userId: selectedPassenger!.uid,
        topUpAmount: amount!,
        topUpFee: 0,
        topupMethod: 'onsite',
      });

      toast.success('Top-up successful!');

      // Reset form
      setSelectedPassenger(null);
      setSearchInput('');
      setSelectedAmount(null);
      setIsCustom(false);
      setCustomAmount('');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Top-up failed');
    }
  };


  return (
    <div className="p-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0A2A54] relative inline-block pb-2">
          TopUp
          <span className="absolute left-0 bottom-0 w-full h-1 bg-yellow-400 rounded"></span>
        </h1>
      </div>

      <div className="mt-6 bg-white rounded-md shadow-md p-6">
        {/* Smart Search Input */}
        <div className="mb-6 relative">
          <label className="block mb-2 text-sm font-medium text-gray-700">Search Passenger</label>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setSelectedPassenger(null);
            }}
            placeholder="Type name or UID..."
            className="w-1/2 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          {searchInput && !selectedPassenger && (
            <ul className="absolute z-10 bg-white border w-1/2 mt-1 max-h-48 overflow-y-auto rounded-md shadow">
              {filteredPassengers.length === 0 ? (
                <li className="px-4 py-2 text-gray-500 text-sm">No matches found</li>
              ) : (
                filteredPassengers.map(user => (
                  <li
                    key={user.uid}
                    onClick={() => handleSelectPassenger(user)}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                  >
                    {user.firstName} {user.lastName} ({user.systemUid})
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        {/* Summary */}
        {selectedPassenger && (
          <div className="p-4 bg-gray-50 w-1/2 rounded-lg border flex flex-col gap-2">
            <div className="text-lg font-semibold text-[#0A2A54] flex items-center gap-2">
              <FaUser className="text-gray-600" />
              {selectedPassenger.firstName} {selectedPassenger.lastName}
            </div>
            <div className="text-sm text-gray-600">UID: {selectedPassenger.systemUid}</div>
            <div className="text-sm text-gray-600">Balance: ₱{selectedPassenger.balance || 0}</div>
          </div>
        )}

        {/* Amount Options */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3 text-[#0A2A54]">Select Top-Up Amount</h2>
          <div className="flex flex-wrap gap-4">
            {[50, 100, 200, 500, 1000].map(amount => (
              <button
                key={amount}
                onClick={() => handleAmountClick(amount)}
                className={`px-4 py-2 rounded-lg border transition ${
                  selectedAmount === amount
                    ? 'bg-yellow-400 border-yellow-600 text-white'
                    : 'bg-white hover:bg-yellow-100 border-gray-300'
                }`}
              >
                ₱{amount}
              </button>
            ))}
            <input
              type="number"
              placeholder="Custom Amount"
              value={customAmount}
              onChange={handleCustomAmountChange}
              className="p-2 border rounded-md w-40"
            />
          </div>
        </div>

        {/* Confirm Button */}
        <div className="mt-8">
          <button
            disabled={!isFormValid}
            onClick={handleTopUp}
            className={`flex items-center gap-2 px-6 py-3 rounded-md text-white transition ${
              isFormValid ? 'bg-[#0A2A54] hover:bg-opacity-90' : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            <FaMoneyBillWave />
            Confirm Top-Up
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}