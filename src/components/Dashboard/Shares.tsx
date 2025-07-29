import React, { useEffect, useState } from 'react';
import { getShares } from '../../api/sharesApi';
import {
  PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, ResponsiveContainer
} from 'recharts';

const COLORS = ['#FFD700', '#4F46E5', '#10B981']; // DOTR, Coop, Driver

const SharesBreakdown = () => {
  const [shares, setShares] = useState({ dotrShare: 0, coopShare: 0, driverShare: 0 });
  const [view, setView] = useState('overall');

  useEffect(() => {
    const loadShares = async () => {
      try {
        const data = await getShares();
        setShares(data);
      } catch (err) {
        console.error('Failed to fetch shares:', err);
      }
    };
    loadShares();
  }, []);

  const total = shares.dotrShare + shares.coopShare + shares.driverShare;

  const pieData = [
    { name: 'DOTR', value: shares.dotrShare },
    { name: 'Cooperative', value: shares.coopShare },
    { name: 'Driver', value: shares.driverShare },
  ];

  const singleBarData = [
    {
      name: view === 'dotr' ? 'DOTR' :
            view === 'coop' ? 'Cooperative' : 'Driver',
      Share: shares[`${view}Share`] || 0,
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Shares Breakdown</h2>
        <select
          className="border p-2 rounded-md text-sm"
          value={view}
          onChange={(e) => setView(e.target.value)}
        >
          <option value="overall">Overall Shares</option>
          <option value="dotr">DOTR Share</option>
          <option value="coop">Cooperative Share</option>
          <option value="driver">Driver Share</option>
        </select>
      </div>

      <div className="h-72 w-full">
        {view === 'overall' ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={singleBarData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Share" fill={view === 'dotr' ? COLORS[0] : view === 'coop' ? COLORS[1] : COLORS[2]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default SharesBreakdown;
