// /components/dashboard/SalesOverview.tsx
import React from 'react';
import { FaBus, FaWallet, FaChartBar } from 'react-icons/fa';

const SalesOverview = () => {
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
          <h3 className="text-2xl font-bold">2,367</h3>
          <p className="text-sm text-green-500 mt-1">↑ 5%</p>
        </div>
        <div className="bg-indigo-100 p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Top up sales</span>
            <FaWallet className="text-indigo-500 text-lg" />
          </div>
          <h3 className="text-2xl font-bold">1,233</h3>
          <p className="text-sm text-red-500 mt-1">↓ 3%</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Total Sales</span>
            <FaChartBar className="text-purple-500 text-lg" />
          </div>
          <h3 className="text-2xl font-bold">100</h3>
          <p className="text-sm text-green-500 mt-1">↑ 5%</p>
        </div>
      </div>

      {/* Revenue breakdown on left, chart on right */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Revenue Breakdown */}
        <div className="w-full lg:w-1/3 space-y-2">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-500 text-sm">Total Sales</p>
            <h3 className="text-xl font-bold">$1,200,000</h3>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-500 text-sm">Bus</p>
            <h3 className="text-xl font-bold">$480,000</h3>
            <p className="text-sm text-indigo-500">40%</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-500 text-sm">Stores</p>
            <h3 className="text-xl font-bold">$720,000</h3>
            <p className="text-sm text-yellow-500">60%</p>
          </div>
        </div>

        {/* Bar Chart placeholder */}
        <div className="flex-1 h-auto bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
          [ Bar Chart Placeholder - Bus / TopUp / Card ]
        </div>
      </div>
    </div>
  );
};

export default SalesOverview;
