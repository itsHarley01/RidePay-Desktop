// /components/dashboard/RecentTransactions.tsx
import React from 'react';

const transactions = [
  { name: "Jennifer", id: "elizabethlopez", amount: 42, date: "05/03/2025" },
  { name: "Matthew Martinez", id: "mmartinez1997", amount: 79, date: "12/06/2023" },
  { name: "Elizabeth Hall", id: "elizabeth_hall_1988", amount: 75, date: "07/08/2021" },
  { name: "Maria White", id: "maria_white", amount: 58, date: "14/03/2023" },
  { name: "Elizabeth Watson", id: "ewatson", amount: 98, date: "17/01/2021" },
  { name: "Elizabeth Allen", id: "eallen1988", amount: 93, date: "11/02/2025" },
  { name: "Caleb Jones", id: "calebjones", amount: 73, date: "19/07/2020" },
];

const RecentTransactions = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full mt-6">
      <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-left">
          <thead>
            <tr className="bg-gray-100 text-sm text-gray-600">
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Transaction ID</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Date of Transaction</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr key={index} className="border-b hover:bg-gray-50 text-sm">
                <td className="px-4 py-2">{tx.name}</td>
                <td className="px-4 py-2">{tx.id}</td>
                <td className="px-4 py-2">{tx.amount}</td>
                <td className="px-4 py-2">{tx.date}</td>
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
    </div>
  );
};

export default RecentTransactions;
