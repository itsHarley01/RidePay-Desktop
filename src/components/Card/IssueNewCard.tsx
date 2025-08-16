import { useEffect, useState } from 'react'
import { FaTimes, FaIdCard } from 'react-icons/fa'
import { getAllPassengers } from '../../api/passengerApi' 
import { issueCard } from '../../api/issueCardApi'
import { getCardPrice } from '../../api/cardApi'
import { toast } from 'react-toastify'
import { getAllDrivers } from '../../api/driverApi'
import { issueDriverCard } from '../../api/cardApi'

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
  const [cardType, setCardType] = useState<'passenger' | 'driver'>('passenger')
  const [searchInput, setSearchInput] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cardPrice, setCardPrice] = useState<number>(0)
  const [cardPriceLoading, setCardPriceLoading] = useState(true)
  const [cardIssuanceFee, setCardIssuanceFee] = useState<number>(0)
  const [cardIssuanceLocation, setCardIssuanceLocation] = useState('')
  const [drivers, setDrivers] = useState<{ uid: string; firstName: string; lastName: string }[]>([]);
  const [driverSearchInput, setDriverSearchInput] = useState('');
  const [selectedDriver, setSelectedDriver] = useState<{ uid: string; firstName: string; lastName: string } | null>(null);

  useEffect(() => {
  if (cardType === 'driver') {
    const fetchDrivers = async () => {
      try {
        const data = await getAllDrivers(); // your driverApi.ts function
        setDrivers(data);
      } catch (err) {
        console.error('Failed to fetch drivers', err);
      }
    };
    fetchDrivers();
  }
}, [cardType]);


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

  const resetForm = () => {
    setTagUID('')
    setCardType('passenger')
    setSearchInput('')
    setSelectedUser(null)
    setCardIssuanceFee(0)
    setCardIssuanceLocation('')
  }

const handleIssueCard = async () => {
  setError('');

  try {
    if (cardType === 'passenger') {
      if (!selectedUser) return setError('Please select a passenger.');

      await issueCard({
        tagUid: tagUID,
        userUid: selectedUser.uid,
        cardType,
        cardPrice,
        cardIssuanceFee,
        cardIssuanceLocation,
        amount: cardPrice + cardIssuanceFee,
        organization: localStorage.getItem('organization') || ''
      });
    } else if (cardType === 'driver') {
      if (!selectedDriver) return setError('Please select a driver.');
      await issueDriverCard(tagUID, selectedDriver.uid);
    }

    toast.success(`${cardType === 'passenger' ? 'Passenger' : 'Driver'} card issued successfully!`);
    onClose(); // close modal
  } catch (err: any) {
    console.error(err);
    setError(err?.response?.data?.message || 'Failed to issue card.');
  }
};

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl h-[80vh] p-6 relative flex flex-col">
        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-xl font-semibold text-[#0A2A54] mb-4 flex items-center">
          <FaIdCard className="mr-3" /> Issue New Card
        </h2>

        {/* TOP HALF: Card Scan/Write Area */}
        <div className="flex-1 border border-dashed border-gray-300 rounded-lg mb-4 flex items-center justify-center">
          <p className="text-gray-400">[Card scan & write section - coming soon]</p>
        </div>

        {/* BOTTOM HALF: Form */}
        <div className="flex-1 overflow-y-auto">
          {/* Card Type Dropdown */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">Card Type</label>
            <select
              value={cardType}
              onChange={(e) => setCardType(e.target.value as 'passenger' | 'driver')}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
            >
              <option value="passenger">Passenger</option>
              <option value="driver">Driver</option>
            </select>
          </div>

          {/* Tag UID */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">RFID Tag UID</label>
            <input
              type="text"
              value={tagUID}
              onChange={(e) => setTagUID(e.target.value)}
              placeholder="Enter Tag UID..."
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Passenger-specific fields */}
          {cardType === 'passenger' && (
            <>
              {/* User Search */}
              <div className="mb-2 relative">
                <label className="block mb-1 text-sm font-medium text-gray-700">Select Passenger</label>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value)
                    setSelectedUser(null)
                  }}
                  placeholder="Search user by name or UID..."
                  className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
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
            </>
          )}

          {cardType === 'driver' && (
  <div className="mb-2 relative">
    <label className="block mb-1 text-sm font-medium text-gray-700">Select Driver</label>
    <input
      type="text"
      value={driverSearchInput}
      onChange={(e) => {
        setDriverSearchInput(e.target.value);
        setSelectedDriver(null);
      }}
      placeholder="Search driver by name or UID..."
      className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
    />
    {driverSearchInput && !selectedDriver && (
      <ul className="absolute z-10 bg-white border w-full mt-1 max-h-48 overflow-y-auto rounded-md shadow">
        {drivers
          .filter(driver =>
            `${driver.firstName} ${driver.lastName}`.toLowerCase().includes(driverSearchInput.toLowerCase()) ||
            driver.uid.includes(driverSearchInput)
          )
          .map(driver => (
            <li
              key={driver.uid}
              onClick={() => {
                setSelectedDriver(driver);
                setDriverSearchInput(`${driver.firstName} ${driver.lastName}`);
              }}
              className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
            >
              {driver.firstName} {driver.lastName} ({driver.uid})
            </li>
          ))}
      </ul>
    )}
  </div>
)}
{cardType === 'passenger' && (
  <>
    {/* Card Price */}
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

    {/* Issuance Fee */}
    <div className="mb-4">
      <label className="block mb-1 text-sm font-medium text-gray-700">Issuance Fee (₱)</label>
      <input
        type="number"
        min="0"
        value={cardIssuanceFee}
        onChange={(e) => setCardIssuanceFee(parseFloat(e.target.value))}
        className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
      />
    </div>
  </>
)}
          {/* Issuance Location */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">Issuance Location</label>
            <input
              type="text"
              value={cardIssuanceLocation}
              onChange={(e) => setCardIssuanceLocation(e.target.value)}
              placeholder="e.g., Terminal 1"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleIssueCard}
            className={`w-full mt-4 py-2 rounded-md font-medium transition bg-[#0A2A54] text-white hover:bg-opacity-90`}
          >
            {cardType === 'passenger' ? 'Issue Passenger Card' : 'Issue Driver Card'}
          </button>

          {/* Error Message */}
          {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}
        </div>
      </div>
    </div>
  )
}
