import { FaTimes, FaIdCard, FaMicrochip, FaUser, FaCalendarAlt, FaClock, FaInfoCircle } from 'react-icons/fa'
import React from 'react'

interface CardDetailsProps {
  card: {
    cardUID: string
    tagUID: string
    status: string
    issuedUser: string
    issuanceDate: string
  }
  onClose: () => void
}

export default function CardDetails({ card, onClose }: CardDetailsProps) {
  const date = new Date(card.issuanceDate)

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 bg-opacity-40">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition"
        >
          <FaTimes size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center mb-6">
          <FaIdCard size={28} className="text-[#0A2A54] mr-3" />
          <h2 className="text-xl font-semibold text-[#0A2A54]">Card Details</h2>
        </div>

        {/* Detail Items */}
        <div className="space-y-4 text-sm text-gray-800">

          <div className="flex items-center">
            <FaIdCard className="mr-3 text-gray-500" />
            <span className="font-semibold w-32">Card UID:</span>
            <span className="truncate">{card.cardUID}</span>
          </div>

          <div className="flex items-center">
            <FaMicrochip className="mr-3 text-gray-500" />
            <span className="font-semibold w-32">Tag UID:</span>
            <span>{card.tagUID}</span>
          </div>

          <div className="flex items-center">
            <FaInfoCircle className="mr-3 text-gray-500" />
            <span className="font-semibold w-32">Status:</span>
            <span className="capitalize">{card.status}</span>
          </div>

          <div className="flex items-center">
            <FaUser className="mr-3 text-gray-500" />
            <span className="font-semibold w-32">Issued User:</span>
            <span>{card.issuedUser}</span>
          </div>

          <div className="flex items-center">
            <FaCalendarAlt className="mr-3 text-gray-500" />
            <span className="font-semibold w-32">Date Issued:</span>
            <span>
              {date.toLocaleDateString('en-PH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          <div className="flex items-center">
            <FaClock className="mr-3 text-gray-500" />
            <span className="font-semibold w-32">Time Issued:</span>
            <span>
              {date.toLocaleTimeString('en-PH', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}
            </span>
          </div>

        </div>
      </div>
    </div>
  )
}
