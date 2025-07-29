import { useState } from 'react'
import BusTable from '../../components/Drivers/BusTable';
import SalesTable from '../../components/Drivers/salesTable';

export default function DriverHistoy() {
    const [activeTab, setActiveTab] = useState<'bus' | 'sales'>('bus');
  return (
    <div className="p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0A2A54] relative inline-block pb-2">
          History
          <span className="absolute left-0 bottom-0 w-full h-1 bg-yellow-400 rounded"></span>
        </h1>
      </div>

            {/* Tabs */}
      <div className="mt-6 border-b border-gray-300">
        <div className="flex space-x-8">
          <button
            className={`pb-2 text-lg font-medium transition-all duration-200 ${
              activeTab === 'bus' ? 'text-[#0A2A54] border-b-4 border-yellow-400' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('bus')}
          >
            Bus
          </button>
          <button
            className={`pb-2 text-lg font-medium transition-all duration-200 ${
              activeTab === 'sales' ? 'text-[#0A2A54] border-b-4 border-yellow-400' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('sales')}
          >
            Sales
          </button>
        </div>
      </div>

    <div className="mt-6">
      {activeTab === 'bus' ? <BusTable /> : <SalesTable />}
    </div>

    </div>
  )
}
