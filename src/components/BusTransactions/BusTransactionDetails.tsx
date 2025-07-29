import React from 'react';
import { Receipt } from "lucide-react";

interface BusTransaction {
  transactionUID: string;
  type: 'bus';
  date: string;
  timestamp: number;
  amount: number;
  fromUser: string;
  busId: string;
  driverId: string;
  deviceId: string;
  busPaymentType: 'fixed' | 'distanceBased';
  busPaymentAmount: number;
  [key: string]: any; // to allow extra fields
}

interface BusTransactionDetailsProps {
  transaction: BusTransaction;
  onClose: () => void;
}

const BusTransactionDetails: React.FC<BusTransactionDetailsProps> = ({ transaction, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold text-[#0A2A54] text-center mb-4">
          Bus Transaction Details
        </h2>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-[#E5F0FF] text-[#0A2A54] p-4 rounded-full">
            <Receipt size={100} />
          </div>
        </div>



        {/* Details */}
        <div className="space-y-4 text-[17px] p-5 bg-gray-100 rounded-md">
          {/* Group 1 */}
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Transaction ID:</span>
            <span>{transaction.transactionUID}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Date & Time:</span>
            <span>{new Date(transaction.date).toLocaleString()}</span>
          </div>

          <hr className="my-2 text-gray-300" />

          {/* Group 2 */}
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">From User (UID):</span>
            <span>{transaction.fromUser}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Bus ID:</span>
            <span>{transaction.busId}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Driver ID:</span>
            <span>{transaction.driverId}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Device ID:</span>
            <span>{transaction.deviceId}</span>
          </div>

          <hr className="my-2 text-gray-300" />

          {/* Group 3 */}
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Payment Type:</span>
            <span>{transaction.busPaymentType}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Payment Amount:</span>
            <span>₱{transaction.busPaymentAmount.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex justify-between mt-5 mb-6 mx-4 pt-4 font-semibold text-lg text-[#0A2A54]">
          <span className='text-2xl'>Total Amount:</span>
          <span>₱{transaction.amount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default BusTransactionDetails;
