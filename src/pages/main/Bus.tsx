import React, { useState } from 'react';
import AllBus from '../Bus/AllBus';
import LiveBus from '../Bus/LiveBus';
import Device from '../Bus/Device';

export default function Bus() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0A2A54] relative inline-block pb-2">
          Bus
          <span className="absolute left-0 bottom-0 w-full h-1 bg-yellow-400 rounded"></span>
        </h1>
      </div>

      {/* Tabs */}
      <div className="mt-6 border-b border-gray-300">
        <div className="flex space-x-8">
          <button
            className={`pb-2 text-lg font-medium transition-all duration-200 ${
              activeTab === 'all' ? 'text-[#0A2A54] border-b-4 border-yellow-400' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('all')}
          >
            All Buses
          </button>

          <button
            className={`pb-2 text-lg font-medium transition-all duration-200 ${
              activeTab === 'live' ? 'text-[#0A2A54] border-b-4 border-yellow-400' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('live')}
          >
            Live Bus
          </button>

          <button
            className={`pb-2 text-lg font-medium transition-all duration-200 ${
              activeTab === 'devices' ? 'text-[#0A2A54] border-b-4 border-yellow-400' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('devices')}
          >
            Devices
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'all' && <AllBus />}
        {activeTab === 'live' && <LiveBus />}
        {activeTab === 'devices' && <Device />}
      </div>
    </div>
  );
}
