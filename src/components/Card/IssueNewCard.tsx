import { useEffect, useState } from 'react'
import { FaTimes, FaUser, FaIdCard, FaCheckCircle } from 'react-icons/fa'
import { getAllPassengers } from '../../api/passengerApi' 
import { issueCard } from '../../api/issueCardApi'
import { getCardPrice } from '../../api/cardApi'

interface User {
  uid: string
  firstName: string
  lastName: string
  systemUid: string
}

interface IssueNewCardProps {
  onClose: () => void
}

export default function IssueNewCard({ onClose }: IssueNewCardProps) {
  const [tagUID, setTagUID] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cardPrice, setCardPrice] = useState<number>(0)
  const [cardPriceLoading, setCardPriceLoading] = useState(true)
  const [cardIssuanceFee, setCardIssuanceFee] = useState<number>(0)
  const [cardIssuanceLocation, setCardIssuanceLocation] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllPassengers()
        setUsers(data)
      } catch (err) {
        setError('Failed to load users')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  useEffect(() => {
    const fetchCardPrice = async () => {
      try {
        const data = await getCardPrice()
        setCardPrice(Number(data.price))
      } catch (err) {
        console.error('Failed to fetch card price:', err)
        setError('Failed to fetch card price')
      } finally {
        setCardPriceLoading(false)
      }
    }

    fetchCardPrice()
  }, [])


  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName} ${user.uid}`
      .toLowerCase()
      .includes(searchInput.toLowerCase())
  )

  const handleSelectUser = (user: User) => {
    setSelectedUser(user)
    setSearchInput(`${user.firstName} ${user.lastName}`)
  }

  const isReadyToIssue =
    tagUID.trim() !== '' &&
    selectedUser &&
    cardPrice > 0 &&
    cardIssuanceFee >= 0 &&
    cardIssuanceLocation.trim() !== ''

  const handleIssueCard = async () => {
    if (!selectedUser || !tagUID.trim()) return

    try {
      const amount = cardPrice + cardIssuanceFee

      await issueCard({
        tagUid: tagUID,
        userUid: selectedUser.uid,
        cardPrice,
        cardIssuanceFee,
        cardIssuanceLocation,
        amount,
      })

      onClose() // Close modal after success
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to issue card')
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 bg-opacity-40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-xl font-semibold text-[#0A2A54] mb-6 flex items-center">
          <FaIdCard className="mr-3" /> Issue New Card
        </h2>

        {/* 🔷 Tag UID Input */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">RFID Tag UID</label>
          <input
            type="text"
            value={tagUID}
            onChange={(e) => setTagUID(e.target.value)}
            placeholder="Enter Tag UID..."
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

                {/* 🔍 User Search */}
        <div className="mb-2 relative">
          <label className="block mb-1 text-sm font-medium text-gray-700">Select User</label>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value)
              setSelectedUser(null)
            }}
            placeholder="Search user by name or UID..."
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          {searchInput && !selectedUser && (
            <ul className="absolute z-10 bg-white border w-full mt-1 max-h-48 overflow-y-auto rounded-md shadow">
              {filteredUsers.length === 0 ? (
                <li className="px-4 py-2 text-gray-500 text-sm">No matches found</li>
              ) : (
                filteredUsers.map(user => (
                  <li
                    key={user.uid}
                    onClick={() => handleSelectUser(user)}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                  >
                    {user.firstName} {user.lastName} ({user.systemUid})
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        {/* 💳 Card Price (auto-fetched, disabled) */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">Card Price (₱)</label>
          <input
            type="number"
            value={cardPriceLoading ? '' : cardPrice}
            disabled
            className="w-full px-4 py-2 border rounded-lg shadow-sm bg-gray-100 text-gray-600 cursor-not-allowed"
            placeholder={cardPriceLoading ? 'Loading price...' : ''}
          />
        </div>

        {/* 💸 Card Issuance Fee */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">Issuance Fee (₱)</label>
          <input
            type="number"
            min="0"
            value={cardIssuanceFee}
            onChange={(e) => setCardIssuanceFee(parseFloat(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* 📍 Issuance Location */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">Issuance Location</label>
          <input
            type="text"
            value={cardIssuanceLocation}
            onChange={(e) => setCardIssuanceLocation(e.target.value)}
            placeholder="e.g., Terminal 1"
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* ✅ Summary Preview */}
        {isReadyToIssue && selectedUser && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4 flex items-start space-x-3">
            <FaCheckCircle className="text-blue-500 mt-1" />
            <div className="text-sm text-gray-700">
              <p><strong>Issue card to:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
              <p><strong>User UID:</strong> {selectedUser.systemUid}</p>
              <p><strong>Tag UID:</strong> {tagUID}</p>
              <p><strong>Price:</strong> ₱{cardPrice}</p>
              <p><strong>Fee:</strong> ₱{cardIssuanceFee}</p>
              <p><strong>Total:</strong> ₱{(cardPrice + cardIssuanceFee).toFixed(2)}</p>
              <p><strong>Location:</strong> {cardIssuanceLocation}</p>
            </div>
          </div>
        )}

        {/* 🔘 Submit Button */}
        <button
          onClick={handleIssueCard}
          disabled={!isReadyToIssue}
          className={`w-full mt-4 py-2 rounded-md font-medium transition ${
            isReadyToIssue
              ? 'bg-[#0A2A54] text-white hover:bg-opacity-90'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          Issue Card
        </button>

        {/* ❗ Error Message */}
        {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  )
}
