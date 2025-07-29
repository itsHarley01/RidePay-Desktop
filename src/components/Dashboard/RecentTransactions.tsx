import React, { useEffect, useState } from 'react';
import { getTransactions, Transaction } from '../../api/transactionsApi';

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getTransactions();
        setTransactions(data.reverse()); // reverse to show newest first
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full mt-6">
      <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>

      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : transactions.length === 0 ? (
        <div className="text-sm text-gray-500">No transactions found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-left">
            <thead>
              <tr className="bg-gray-100 text-sm text-gray-600">
                <th className="px-4 py-2">Transaction ID</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Date of Transaction</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.transactionUID} className="border-b hover:bg-gray-50 text-sm">
                  <td className="px-4 py-2">{tx.transactionUID}</td>
                  <td className="px-4 py-2 capitalize">{tx.transactionType?.type}</td>
                  <td className="px-4 py-2">₱{tx.amount.toLocaleString()}</td>
                  <td className="px-4 py-2">{new Date(tx.dateOfTransaction || '').toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <button className="bg-yellow-400 text-white text-xs px-3 py-1 rounded hover:bg-yellow-500">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;
