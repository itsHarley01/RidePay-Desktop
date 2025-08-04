import { useEffect, useState } from 'react';

interface BusHistory {
  busUID: string;
  date: string; // format: YYYY-MM-DD
  loginTime: string; // format: HH:mm
  logoutTime: string; // format: HH:mm
  totalPassengers: number;
  totalSales: number;
}

const BusTable = () => {
  const [history, setHistory] = useState<BusHistory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    // Replace with real API call
    const fetchBusHistory = async () => {
      const sampleData: BusHistory[] = [

      ];
      setHistory(sampleData);
    };

    fetchBusHistory();
  }, []);

  const filteredHistory = history.filter((entry) =>
    entry.busUID.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const currentEntries = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by Bus ID..."
          className="border border-gray-300 px-4 py-2 rounded-md w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredHistory.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No records found.</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-[#0A2A54] text-left">
                <tr>
                  <th className="p-3">Bus ID</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Login</th>
                  <th className="p-3">Logout</th>
                  <th className="p-3">Total Passengers</th>
                  <th className="p-3">Total Sales</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.map((entry, i) => (
                  <tr
                    key={`${entry.busUID}-${entry.date}`}
                    className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="p-3">{entry.busUID}</td>
                    <td className="p-3">{entry.date}</td>
                    <td className="p-3">{entry.loginTime}</td>
                    <td className="p-3">{entry.logoutTime}</td>
                    <td className="p-3">{entry.totalPassengers}</td>
                    <td className="p-3">₱{entry.totalSales.toLocaleString()}</td>
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
    </div>
  );
};

export default BusTable;
