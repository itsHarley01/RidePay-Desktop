// src/components/PassengerTable.tsx

import { useEffect, useState } from 'react'
import { getAllPassengers } from '../../api/passengerApi'
import PassengerDetails from '../../components/passengers/PassengersDetails'
import UserDiscount from '../passengers/userDiscount' // Make sure the file exports default correctly

interface Passenger {
  uid: string
  systemUid: string
  firstName: string
  lastName: string
  middleName?: string
  email: string
  phone: string
  userBalance: number
  birthdate: string
  gender: string
  status: string
  cardId: string
}

export default function PassengerTable() {
  const [passengers, setPassengers] = useState<Passenger[]>([])
  const [filteredPassengers, setFilteredPassengers] = useState<Passenger[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8
  const [activeTab, setActiveTab] = useState<'passengers' | 'user-discount'>('passengers')

  const [selectedPassenger, setSelectedPassenger] = useState<Passenger | null>(null)

  useEffect(() => {
    async function fetchPassengers() {
      try {
        const data = await getAllPassengers()
        setPassengers(data)
        setFilteredPassengers(data)
      } catch (err) {
        console.error('Error fetching passengers:', err)
      }
    }

    fetchPassengers()
  }, [])

  useEffect(() => {
    const filtered = passengers.filter((p) =>
      [p.systemUid, p.firstName, p.lastName, p.middleName, p.email, p.phone]
        .some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    setFilteredPassengers(filtered)
    setCurrentPage(1)
  }, [searchTerm, passengers])

  const totalPages = Math.ceil(filteredPassengers.length / itemsPerPage)
  const currentItems = filteredPassengers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="p-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0A2A54] relative inline-block pb-2">
          Passengers
          <span className="absolute left-0 bottom-0 w-full h-1 bg-yellow-400 rounded"></span>
        </h1>
      </div>

      {/* Tabs */}
      <div className="mt-6 border-b border-gray-300">
        <div className="flex space-x-8">
          <button
            className={`pb-2 text-lg font-medium transition-all duration-200 ${
              activeTab === 'passengers'
                ? 'text-[#0A2A54] border-b-4 border-yellow-400'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('passengers')}
          >
            Passengers
          </button>
          <button
            className={`pb-2 text-lg font-medium transition-all duration-200 ${
              activeTab === 'user-discount'
                ? 'text-[#0A2A54] border-b-4 border-yellow-400'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('user-discount')}
          >
            User Discount
          </button>
        </div>
      </div>

      
        {activeTab === 'passengers' ? (
          <div className="bg-white shadow-md p-6 mt-5 rounded-lg relative">
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                placeholder="Search passenger..."
                className="border border-gray-300 px-4 py-2 rounded-md w-1/2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {filteredPassengers.length === 0 ? (
              <div className="text-center text-gray-500 py-10">No passengers found.</div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="text-left bg-gray-100 text-[#0A2A54]">
                      <tr>
                        <th className="p-3">User UID</th>
                        <th className="p-3">First Name</th>
                        <th className="p-3">Last Name</th>
                        <th className="p-3">Middle Name</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Phone</th>
                        <th className="p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((p, i) => (
                        <tr
                          key={p.uid}
                          className={i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}
                        >
                          <td className="p-3">{p.systemUid}</td>
                          <td className="p-3">{p.firstName}</td>
                          <td className="p-3">{p.lastName}</td>
                          <td className="p-3">{p.middleName || 'N/A'}</td>
                          <td className="p-3">{p.email}</td>
                          <td className="p-3">{p.phone || 'N/A'}</td>
                          <td className="p-3">
                            <button
                              onClick={() => setSelectedPassenger(p)}
                              className="text-sm bg-[#0A2A54] text-white px-3 py-1 rounded-md shadow hover:bg-opacity-90 transition"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center mt-6 space-x-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      className="px-3 py-1 bg-white border rounded shadow"
                    >
                      &lt;
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 border rounded shadow ${
                          currentPage === i + 1
                            ? 'bg-yellow-400 text-[#0A2A54]'
                            : 'bg-white hover:bg-yellow-100'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      className="px-3 py-1 bg-white border rounded shadow"
                    >
                      &gt;
                    </button>
                  </div>
                )}
              </>
            )}

            {selectedPassenger && (
              <PassengerDetails
                passenger={selectedPassenger}
                onClose={() => setSelectedPassenger(null)}
              />
            )}
          </div>
        ) : (
          <div className="mt-6">
            <UserDiscount />
          </div>
        )}
      </div>
  )
}
