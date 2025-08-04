import React, { useState, useEffect } from 'react'

interface DiscountApplicant {
  uid: string
  fullName: string
  discountType: 'student' | 'senior' | 'pwd'
  status: 'pending' | 'approved' | 'rejected'
}

export default function DiscountTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedApplicant, setSelectedApplicant] = useState<DiscountApplicant | null>(null)

  const [applicants] = useState<DiscountApplicant[]>([
 
  ])

  const [filteredApplicants, setFilteredApplicants] = useState<DiscountApplicant[]>(applicants)

  useEffect(() => {
    const term = searchTerm.toLowerCase()
    setFilteredApplicants(
      applicants.filter((a) => a.fullName.toLowerCase().includes(term))
    )
  }, [searchTerm, applicants])

  return (
    <div className="">
      <div className="bg-white shadow-md p-6 mt-5 rounded-lg relative">
        <h1 className="text-xl font-bold text-[#0A2A54] mb-6">Discount Application</h1>
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search passenger..."
            className="border border-gray-300 px-4 py-2 rounded-md w-1/2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredApplicants.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No passengers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left bg-gray-100 text-[#0A2A54]">
                <tr>
                  <th className="p-3">User ID</th>
                  <th className="p-3">Name of Applicant</th>
                  <th className="p-3">Discount Type</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplicants.map((a, i) => (
                  <tr key={a.uid} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                    <td className="p-3">{a.uid}</td>
                    <td className="p-3">{a.fullName}</td>
                    <td className="p-3 capitalize">{a.discountType}</td>
                    <td className="p-3 capitalize">{a.status}</td>
                    <td className="p-3">
                      <button
                        onClick={() => setSelectedApplicant(a)}
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
        )}
      </div>

      {/* Optional Detail Viewer (not modal) */}
      {selectedApplicant && (
        <div className="mt-4 p-4 border rounded bg-white shadow">
          <h3 className="text-lg font-semibold mb-2">Applicant Details</h3>
          <p><strong>User ID:</strong> {selectedApplicant.uid}</p>
          <p><strong>Name:</strong> {selectedApplicant.fullName}</p>
          <p><strong>Discount Type:</strong> {selectedApplicant.discountType}</p>
          <p><strong>Status:</strong> {selectedApplicant.status}</p>
          <button
            onClick={() => setSelectedApplicant(null)}
            className="mt-3 text-sm px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      )}
    </div>
  )
}
