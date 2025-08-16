// src/pages/CardIssuance.tsx

import { useState, useEffect } from 'react'
import { getAllCards } from '../../api/cardApi'
import CardDetails from '../../components/Card/CardDetails'
import IssueNewCard from '../../components/Card/IssueNewCard'

interface CardRecord {
  cardUID: string
  tagUID: string
  status: string
  cardType: string
  issuedUser: string
  issuanceDate: string
}

export default function CardIssuance() {
  const [cards, setCards] = useState<CardRecord[]>([]) // empty for now
  const [filteredCards, setFilteredCards] = useState<CardRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8
  const [selectedCard, setSelectedCard] = useState<CardRecord | null>(null)
  const [showIssueModal, setShowIssueModal] = useState(false)
  const [allUsers, setAllUsers] = useState<User[]>([])


  // ✅ Fetch cards from API
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const rawCards = await getAllCards()
        const mappedCards: CardRecord[] = rawCards.map((card: any) => ({
          cardUID: card.cardId || '-',
          tagUID: card.tagUid || '-',
          status: card.cardStatus || 'unknown',
          issuedUser: card.userUid || 'N/A',
          issuanceDate: card.dateOfIssuance || new Date().toISOString(),
        }))
        setCards(mappedCards)
      } catch (err) {
        console.error('Error fetching cards:', err)
      }
    }

    fetchCards()
  }, [])

  useEffect(() => {
    setFilteredCards(cards)
  }, [cards])

  useEffect(() => {
    const filtered = cards.filter((c) =>
      [c.cardUID, c.tagUID, c.status, c.issuedUser]
        .some(field => field.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    setFilteredCards(filtered)
    setCurrentPage(1)
  }, [searchTerm, cards])

  const totalPages = Math.ceil(filteredCards.length / itemsPerPage)
  const currentItems = filteredCards.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="bg-white shadow-md p-6 rounded-lg relative">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search cards..."
          className="border border-gray-300 px-4 py-2 rounded-md w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => setShowIssueModal(true)} className="bg-[#0A2A54] text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition">
          Issue Card
        </button>
      </div>

      {filteredCards.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No card records found.</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left bg-gray-100 text-[#0A2A54]">
                <tr>
                  <th className="p-3">Card ID</th>
                  <th className="p-3">Tag ID</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Card Type</th>
                  <th className="p-3">Issued User</th>
                  <th className="p-3">Date of Issuance</th>
                  <th className="p-3">Time of Issuance</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((card, i) => {
                  const d = new Date(card.issuanceDate)
                  return (
                    <tr key={card.cardUID} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                      <td className="p-3">{card.cardUID}</td>
                      <td className="p-3">{card.tagUID}</td>
                      <td className="p-3">{card.status}</td>
                      <td className="p-3">{card.cardType}</td>
                      <td className="p-3">{card.issuedUser || 'N/A'}</td>
                      <td className="p-3">
                        {d.toLocaleDateString('en-PH', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="p-3">
                        {d.toLocaleTimeString('en-PH', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => setSelectedCard(card)}
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

      {selectedCard && (
        <CardDetails
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}

      {showIssueModal && (
        <IssueNewCard
          onClose={() => setShowIssueModal(false)}
          users={allUsers}
        />
      )}

    </div>
  )
}
