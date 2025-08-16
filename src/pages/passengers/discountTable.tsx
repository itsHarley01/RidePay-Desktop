import React, { useState, useEffect } from 'react'
import { getAllDiscountApplications } from '../../api/discountApplicationApi'

interface DiscountApplicant {
  uid: string
  fullName: string
  discountType: 'student' | 'senior' | 'pwd'
  status: 'pending' | 'approved' | 'rejected'
  dateOfApplication: string
  email: string
  contactNumber: string
  files: Record<string, string> // key = file field name, value = public URL
}

export default function DiscountTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedApplicant, setSelectedApplicant] = useState<DiscountApplicant | null>(null)
  const [applicants, setApplicants] = useState<DiscountApplicant[]>([])
  const [filteredApplicants, setFilteredApplicants] = useState<DiscountApplicant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllDiscountApplications()

        const formatted: DiscountApplicant[] = data.map((app: any) => ({
          uid: app.userId,
          fullName: `${app.data.firstName} ${app.data.middleName || ''} ${app.data.lastName}`.trim(),
          discountType: app.category,
          status: app.status.status,
          dateOfApplication: app.status.dateOfApplication,
          email: app.data.email,
          contactNumber: app.data.contactNumber,
          files: app.file || {}
        }))

        setApplicants(formatted)
        setFilteredApplicants(formatted)
      } catch (error) {
        console.error('Error fetching discount applications:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const term = searchTerm.toLowerCase()
    setFilteredApplicants(
      applicants.filter((a) => a.fullName.toLowerCase().includes(term))
    )
  }, [searchTerm, applicants])

  return (
    <div>
      <div className="bg-white shadow-md p-6 mt-5 rounded-lg relative">
        <h1 className="text-xl font-bold text-[#0A2A54] mb-6">Discount Application</h1>

        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search applicant..."
            className="border border-gray-300 px-4 py-2 rounded-md w-1/2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading...</div>
        ) : filteredApplicants.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No applicants found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left bg-gray-100 text-[#0A2A54]">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Discount Type</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Contact Number</th>
                  <th className="p-3">Date Applied</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplicants.map((a, i) => (
                  <tr key={a.uid} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                    <td className="p-3">{a.fullName}</td>
                    <td className="p-3 capitalize">{a.discountType}</td>
                    <td className="p-3 capitalize">{a.status}</td>
                    <td className="p-3">{a.email}</td>
                    <td className="p-3">{a.contactNumber}</td>
                    <td className="p-3">{new Date(a.dateOfApplication).toLocaleDateString()}</td>
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

      {/* Applicant Details */}
      {selectedApplicant && (
        <div className="mt-4 p-4 border rounded bg-white shadow">
          <h3 className="text-lg font-semibold mb-2">Applicant Details</h3>
          <p><strong>User ID:</strong> {selectedApplicant.uid}</p>
          <p><strong>Name:</strong> {selectedApplicant.fullName}</p>
          <p><strong>Discount Type:</strong> {selectedApplicant.discountType}</p>
          <p><strong>Status:</strong> {selectedApplicant.status}</p>
          <p><strong>Email:</strong> {selectedApplicant.email}</p>
          <p><strong>Contact Number:</strong> {selectedApplicant.contactNumber}</p>
          <p><strong>Date Applied:</strong> {new Date(selectedApplicant.dateOfApplication).toLocaleString()}</p>

          {Object.keys(selectedApplicant.files).length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Uploaded Files:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(selectedApplicant.files).map(([key, url]) => (
                  <div key={key} className="border rounded p-2 text-center">
                    <p className="text-xs font-medium mb-1">{key}</p>
                    {url.endsWith('.pdf') ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline text-xs"
                      >
                        View PDF
                      </a>
                    ) : (
                      <img
                        src={url}
                        alt={key}
                        className="max-h-40 mx-auto object-contain rounded"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

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
