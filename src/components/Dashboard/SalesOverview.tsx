import React, { useEffect, useState } from 'react';
import { FaBus, FaWallet, FaChartBar } from 'react-icons/fa';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from 'recharts';
import { getTransactions } from '../../api/transactionsApi';

const SalesOverview = () => {
  const [busSalesTotal, setBusSalesTotal] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filter, setFilter] = useState<'overall' | 'bus' | 'driver'>('overall');
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allTransactions = await getTransactions();
        setTransactions(allTransactions);

        const busTransactions = allTransactions.filter(
          (txn: any) => txn.transactionType?.type === 'bus'
        );
        const totalAmount = busTransactions.reduce(
          (acc: number, txn: any) => acc + (txn.amount || 0),
          0
        );
        setBusSalesTotal(totalAmount);
      } catch (error) {
        console.error('Error fetching bus sales:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!transactions.length) return;

    if (filter === 'overall') {
      const grouped = {
        Bus: 0,
        TopUp: 0,
        Card: 0,
      };

      transactions.forEach((txn: any) => {
        const type = txn.transactionType?.type;
        const amount = txn.amount || 0;
        if (type === 'bus') grouped.Bus += amount;
        else if (type === 'topup') grouped.TopUp += amount;
        else if (type === 'card') grouped.Card += amount;
      });

      setChartData([
        { name: 'Bus', amount: grouped.Bus },
        { name: 'TopUp', amount: grouped.TopUp },
        { name: 'Card', amount: grouped.Card },
      ]);
    } else if (filter === 'bus') {
      const grouped: Record<string, number> = {};

      transactions.forEach((txn: any) => {
        const isBus = txn.transactionType?.type === 'bus';
        const busId = txn.transactionType?.busId; // <-- updated to use busId
        if (isBus && busId) {
          grouped[busId] = (grouped[busId] || 0) + (txn.amount || 0);
        }
      });

      const chart = Object.entries(grouped).map(([bus, amount]) => ({
        name: bus,
        amount,
      }));

      setChartData(chart);
    } else if (filter === 'driver') {
      const grouped: Record<string, number> = {};

      transactions.forEach((txn: any) => {
        const driver = txn.transactionType?.driver;
        if (driver) {
          grouped[driver] = (grouped[driver] || 0) + (txn.amount || 0);
        }
      });

      const chart = Object.entries(grouped).map(([driver, amount]) => ({
        name: driver,
        amount,
      }));

      setChartData(chart);
    }
  }, [filter, transactions]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <h2 className="text-lg font-semibold mb-4">Sales Overview</h2>

      {/* Top 3 sales boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-yellow-100 p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Bus sales</span>
            <FaBus className="text-yellow-500 text-lg" />
          </div>
          <h3 className="text-2xl font-bold">₱{busSalesTotal.toLocaleString()}</h3>
          <p className="text-sm text-green-500 mt-1">↑ 5%</p>
        </div>
        <div className="bg-indigo-100 p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Top up sales</span>
            <FaWallet className="text-indigo-500 text-lg" />
          </div>
          <h3 className="text-2xl font-bold">₱0</h3>
          <p className="text-sm text-red-500 mt-1">↓ 0%</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Others</span>
            <FaChartBar className="text-purple-500 text-lg" />
          </div>
          <h3 className="text-2xl font-bold">₱0</h3>
          <p className="text-sm text-green-500 mt-1">↑ 0%</p>
        </div>
      </div>

      {/* Revenue breakdown and chart */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Revenue Breakdown */}
        <div className="w-full lg:w-1/3 space-y-2">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-500 text-sm">Total Sales</p>
            <h3 className="text-xl font-bold">₱{busSalesTotal.toLocaleString()}</h3>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-500 text-sm">Bus</p>
            <h3 className="text-xl font-bold">₱{busSalesTotal.toLocaleString()}</h3>
            <p className="text-sm text-indigo-500">100%</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-500 text-sm">Stores</p>
            <h3 className="text-xl font-bold">₱0</h3>
            <p className="text-sm text-yellow-500">0%</p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="flex-1 bg-white p-4 rounded-lg shadow-sm">
          {/* Dropdown Filter */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-semibold text-gray-700">Sales Chart</h3>
            <select
              className="border p-1 rounded text-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'overall' | 'bus' | 'driver')}
            >
              <option value="overall">Overall</option>
              <option value="bus">By Bus</option>
              <option value="driver">By Driver</option>
            </select>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SalesOverview;
