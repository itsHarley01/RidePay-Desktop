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
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [timeFilter, setTimeFilter] = useState<'day' | 'week' | 'month' | 'year' | 'all'>('all');
  const [chartFilter, setChartFilter] = useState<'overall' | 'bus' | 'driver' | 'card'>('overall');
  const [chartData, setChartData] = useState<any[]>([]);
  const [totals, setTotals] = useState({ bus: 0, topup: 0, card: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const all = await getTransactions();
        setTransactions(all);
      } catch (err) {
        console.error('Error loading transactions:', err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const now = new Date();
    const startDate = new Date();

    switch (timeFilter) {
      case 'day':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        const day = now.getDay();
        startDate.setDate(now.getDate() - day);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'month':
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'year':
        startDate.setMonth(0, 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'all':
      default:
        startDate.setTime(0);
        break;
    }

    const filtered = transactions.filter((txn) => {
      const txnDate = new Date(txn.date || txn.timestamp);
      return txnDate >= startDate;
    });

    setFilteredTransactions(filtered);

    const total = { bus: 0, topup: 0, card: 0 };
    filtered.forEach((txn: any) => {
      const amount = txn.amount || 0;
      if (txn.type === 'bus') total.bus += amount;
      else if (txn.type === 'topup') total.topup += amount;
      else if (txn.type === 'card') total.card += amount;
    });
    setTotals(total);
  }, [transactions, timeFilter]);

  useEffect(() => {
    if (!filteredTransactions.length) return;

    if (chartFilter === 'overall') {
      setChartData([
        { name: 'Bus', amount: totals.bus },
        { name: 'TopUp', amount: totals.topup },
        { name: 'Card', amount: totals.card },
      ]);
    } else if (chartFilter === 'bus') {
      const grouped: Record<string, number> = {};
      filteredTransactions.forEach((txn) => {
        if (txn.type === 'bus') {
          const busId = txn.busId || 'Unknown Bus';
          grouped[busId] = (grouped[busId] || 0) + (txn.amount || 0);
        }
      });
      const chart = Object.entries(grouped).map(([bus, amount]) => ({
        name: bus,
        amount,
      }));
      setChartData(chart);
    } else if (chartFilter === 'driver') {
      const grouped: Record<string, number> = {};
      filteredTransactions.forEach((txn) => {
        if (txn.type === 'bus') {
          const driverId = txn.driverId || 'Unknown Driver';
          grouped[driverId] = (grouped[driverId] || 0) + (txn.amount || 0);
        }
      });
      const chart = Object.entries(grouped).map(([driver, amount]) => ({
        name: driver,
        amount,
      }));
      setChartData(chart);
    } else if (chartFilter === 'card') {
      const grouped: Record<string, number> = {};
      filteredTransactions.forEach((txn) => {
        if (txn.type === 'card') {
          const dateOnly = new Date(txn.date || txn.timestamp).toLocaleDateString();
          grouped[dateOnly] = (grouped[dateOnly] || 0) + (txn.amount || 0);
        }
      });
      const chart = Object.entries(grouped).map(([date, amount]) => ({
        name: date,
        amount,
      }));
      setChartData(chart);
    }
  }, [chartFilter, filteredTransactions, totals]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Sales Overview</h2>
        <select
          className="border p-1 rounded text-sm"
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value as any)}
        >
          <option value="day">This Day</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Summary Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-yellow-100 p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Bus sales</span>
            <FaBus className="text-yellow-500 text-lg" />
          </div>
          <h3 className="text-2xl font-bold">₱{totals.bus.toLocaleString()}</h3>
        </div>
        <div className="bg-indigo-100 p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Top up sales</span>
            <FaWallet className="text-indigo-500 text-lg" />
          </div>
          <h3 className="text-2xl font-bold">₱{totals.topup.toLocaleString()}</h3>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Card sales</span>
            <FaChartBar className="text-purple-500 text-lg" />
          </div>
          <h3 className="text-2xl font-bold">₱{totals.card.toLocaleString()}</h3>
        </div>
      </div>

      {/* Chart Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Revenue Breakdown */}
        <div className="w-full lg:w-1/3 space-y-2">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-500 text-sm">Total Sales</p>
            <h3 className="text-xl font-bold">
              ₱{(totals.bus + totals.topup + totals.card).toLocaleString()}
            </h3>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-500 text-sm">Bus</p>
            <h3 className="text-xl font-bold">₱{totals.bus.toLocaleString()}</h3>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-500 text-sm">TopUp</p>
            <h3 className="text-xl font-bold">₱{totals.topup.toLocaleString()}</h3>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-500 text-sm">Card</p>
            <h3 className="text-xl font-bold">₱{totals.card.toLocaleString()}</h3>
          </div>
        </div>

        {/* Graph */}
        <div className="flex-1 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-semibold text-gray-700">Sales Chart</h3>
            <select
              className="border p-1 rounded text-sm"
              value={chartFilter}
              onChange={(e) =>
                setChartFilter(e.target.value as 'overall' | 'bus' | 'driver' | 'card')
              }
            >
              <option value="overall">All</option>
              <option value="bus">Bus</option>
              <option value="driver">Driver</option>
              <option value="card">Card</option>
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
