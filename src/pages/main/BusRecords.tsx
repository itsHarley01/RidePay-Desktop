import { useEffect, useState } from 'react';
import { getTransactions } from '../../api/transactionsApi';
import BusTransactionDetails from '../../components/BusTransactions/BusTransactionDetails';

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
}


const BusTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter based on searchTerm
const filteredTransactions = transactions.filter((tx) =>
  tx.transactionUID.toLowerCase().includes(searchTerm.toLowerCase()) ||
  tx.busId.toLowerCase().includes(searchTerm.toLowerCase()) ||
  tx.driverId.toLowerCase().includes(searchTerm.toLowerCase()) ||
  tx.deviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
  tx.fromUser.toLowerCase().includes(searchTerm.toLowerCase())
);

// Pagination logic
const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
const paginatedTransactions = filteredTransactions.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);


useEffect(() => {
  const fetchBusTransactions = async () => {
    try {
      const txs = await getTransactions({ type: 'bus' });
      setTransactions(txs);
    } catch (error) {
      console.error('Error fetching bus transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchBusTransactions();
}, []);


  return (
    <div className="p-6">
      {/* Main Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0A2A54] relative inline-block pb-2">
          Bus Transactions
          <span className="absolute left-0 bottom-0 w-full h-1 bg-yellow-400 rounded"></span>
        </h1>
      </div>

      {/* Sub Heading */}
      <div className="mt-6 border-b border-gray-300"></div>
      

      <div className="bg-white shadow-md p-6 rounded-lg relative mt-6">
        <h2 className="text-xl font-semibold mb-4">Bus Transactions</h2>

        <div className="mb-4 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search by Transaction ID, Bus, Driver..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on new search
            }}
            className="px-4 py-2 border border-gray-300 rounded-md w-full max-w-md"
          />
        </div>
          

        {/* States */}
        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No bus transactions found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left bg-gray-100 text-[#0A2A54]">
                <tr>
                  <th className="p-3">Transaction ID</th>
                  <th className="p-3">Date and Time</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">From</th>
                  <th className="p-3">Bus ID</th>
                  <th className="p-3">Driver</th>
                  <th className="p-3">Device</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((tx, i) => (
                  <tr
                    key={tx.transactionUID}
                    className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="p-3">{tx.transactionUID}</td>
                    <td className="p-3">{new Date(tx.date).toLocaleString()}</td>
                    <td className="p-3">₱{tx.amount.toFixed(2)}</td>
                    <td className="p-3">{tx.fromUser}</td>
                    <td className="p-3">{tx.busId}</td>
                    <td className="p-3">{tx.driverId}</td>
                    <td className="p-3">{tx.deviceId}</td>
                    <td className="p-3">
                      <button
                        onClick={() => setSelectedTransaction(tx)}
                        className="text-sm bg-[#0A2A54] text-white px-3 py-1 rounded-md shadow hover:bg-opacity-90 transition"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-center mt-6 gap-2">
  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
    <button
      key={page}
      onClick={() => setCurrentPage(page)}
      className={`px-3 py-1 rounded-md ${
        page === currentPage
          ? 'bg-[#0A2A54] text-white'
          : 'bg-gray-200 text-gray-700'
      }`}
    >
      {page}
    </button>
  ))}
</div>

          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <BusTransactionDetails
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
};

export default BusTransactions;
