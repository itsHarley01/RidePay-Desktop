// src/components/CardTransactionsTable.tsx

import { useEffect, useState } from 'react'
import { getTransactions } from '../../api/transactionsApi' // adjust path if needed
import CardTransactionDetails from './CardTransactionDetails'

interface CardTransaction {
  transactionUID: string
  date: string
  amount: number
  fromUser: string
  cardIssuanceLocation: string
  type: string
}

export default function CardTransactionsTable() {
  const [transactions, setTransactions] = useState<CardTransaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<CardTransaction[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const [selectedTransaction, setSelectedTransaction] = useState<CardTransaction | null>(null)

                    
  useEffect(() => {
    async function fetchCardTransactions() {
      try {
        const res = await getTransactions({ type: 'card' }) // fetch only card transactions
        setTransactions(res)
        setFilteredTransactions(res)
      } catch (error) {
        console.error('Failed to fetch card transactions:', error)
      }
    }

    fetchCardTransactions()
  }, [])

  useEffect(() => {
    const filtered = transactions.filter(
      (txn) =>
        txn.transactionUID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.fromUser?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.cardIssuanceLocation?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredTransactions(filtered)
    setCurrentPage(1)
  }, [searchTerm, transactions])

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const currentItems = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="bg-white shadow-md p-6 rounded-lg relative">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search transaction..."
          className="border border-gray-300 px-4 py-2 rounded-md w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No transactions found.</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left bg-gray-100 text-[#0A2A54]">
                <tr>
                  <th className="p-3">Transaction ID</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">From</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
                <tbody>
                  {currentItems.map((txn, i) => {
                    const d = new Date(txn.date)
                    return (
                      <tr key={txn.transactionUID} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                        <td className="p-3">{txn.transactionUID}</td>
                        <td className="p-3">{d.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                        <td className="p-3">{d.toLocaleTimeString('en-PH', { hour: 'numeric', minute: '2-digit', hour12: true })}</td>
                        <td className="p-3">₱{txn.amount.toFixed(2)}</td>
                        <td className="p-3">{txn.fromUser || 'N/A'}</td>
                        <td className="p-3">{txn.cardIssuanceLocation || 'N/A'}</td>
                        <td className="p-3">
                            <button
                              onClick={() => setSelectedTransaction(txn)}
                              className="text-sm bg-[#0A2A54] text-white px-3 py-1 rounded-md shadow hover:bg-opacity-90 transition"
                            >
                              Details
                            </button>
                        </td>
                      </tr>
                    )
                  })}
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

      {selectedTransaction && (
          <CardTransactionDetails
            transaction={selectedTransaction}
            onClose={() => setSelectedTransaction(null)}
          />
        )}
    </div>
  )
}
