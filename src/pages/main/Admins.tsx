
import { useState } from 'react';
import AllAdmins from '../Admins/AllAdmins';
import Organizations from '../Admins/Organizations';
import AdminRequirements from '../Admins/AdminRequirements';

const Admins = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'org' | 'requirements'>('all');

  return (
    <div className="p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0A2A54] relative inline-block pb-2">
          Admins
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
            All Admins
          </button>
          <button
            className={`pb-2 text-lg font-medium transition-all duration-200 ${
              activeTab === 'org' ? 'text-[#0A2A54] border-b-4 border-yellow-400' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('org')}
          >
            Organizations
          </button>
          <button
            className={`pb-2 text-lg font-medium transition-all duration-200 ${
              activeTab === 'requirements' ? 'text-[#0A2A54] border-b-4 border-yellow-400' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('requirements')}
          >
            Admin Requirements
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'all' && <AllAdmins />}
        {activeTab === 'org' && <Organizations />}
        {activeTab === 'requirements' && <AdminRequirements />}
      </div>
    </div>
  );
};

export default Admins;