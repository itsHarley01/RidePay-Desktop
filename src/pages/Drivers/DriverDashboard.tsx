import { useState } from 'react'
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

import {
  FaUsers,
  FaMoneyBillWave,
  FaPercentage,
} from 'react-icons/fa'
import ClickableCountContainer from '../../components/Dashboard/ClickableCountContainer'

const filterOptions = ['This Day', 'This Week', 'This Month', 'This Year', 'Lifetime']

const DriverDashboard = () => {
  const [selectedFilter, setSelectedFilter] = useState('This Day')

  const [salesTotal, setSalesTotal] = useState(0)
  const [workedDays, setWorkedDays] = useState(0)
  const [passengerTotal, setPassengerTotal] = useState(0)
  const [monthlyTripCount, setMonthlyTripCount] = useState(0)
  const [avgSalesPerDay, setAvgSalesPerDay] = useState(0)
  const [salesChartData, setSalesChartData] = useState<any[]>([])
  const [performanceChartData, setPerformanceChartData] = useState<any[]>([])

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilter(e.target.value)
    // TODO: Fetch data based on selected filter
  }

  const salesGoal = 10000
  const salesProgress = Math.min((salesTotal / salesGoal) * 100, 100)
  const averageFare = passengerTotal > 0 ? (salesTotal / passengerTotal).toFixed(2) : '0.00'

  return (
    <div className="p-6 space-y-8">
      {/* Header and Filter */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#0A2A54] relative inline-block pb-2">
            Dashboard
            <span className="absolute left-0 bottom-0 w-full h-1 bg-yellow-400 rounded"></span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Driver Performance Overview</p>
        </div>
        <select
          className="border border-gray-300 rounded px-3 py-1 text-sm"
          value={selectedFilter}
          onChange={handleFilterChange}
        >
          {filterOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* Count Containers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        <ClickableCountContainer
          icon={<FaUsers />}
          count={passengerTotal}
          title="Total Passengers"
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-500"
          className="min-h-[140px]"
        />
        <ClickableCountContainer
          icon={<FaMoneyBillWave />}
          count={salesTotal}
          title="Total Sales"
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          className="min-h-[140px]"
        />
        <ClickableCountContainer
          icon={<FaPercentage />}
          count={workedDays}
          title="Share"
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          className="min-h-[140px]"
        />
      </div>

      {/* Sales Graph Section */}
      <div className="flex flex-col bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-md font-semibold text-gray-700 mb-4">Sales Graph</h3>
        <div className="flex flex-col md:flex-row justify-between w-full gap-6">
          {/* Left Data */}
          <div className="flex flex-col space-y-4 w-full md:w-1/5">
            <div className="bg-yellow-100 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600">Total Sales</p>
              <h3 className="text-xl font-bold text-gray-900">₱{salesTotal.toLocaleString()}</h3>
            </div>
            <div className="bg-green-100 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600">Worked Days</p>
              <h3 className="text-xl font-bold text-gray-900">{workedDays}</h3>
            </div>
            <div className="bg-indigo-100 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600">Total Passengers</p>
              <h3 className="text-xl font-bold text-gray-900">{passengerTotal}</h3>
            </div>
          </div>

          {/* Graph */}
          <div className="w-full md:w-3/5">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Right Panel */}
          <div className="flex flex-col space-y-4 w-full md:w-1/5">
            <div className="bg-white p-4 rounded-lg shadow border">
              <p className="text-sm text-gray-600">Avg Fare / Passenger</p>
              <h3 className="text-lg font-bold text-gray-900">₱{averageFare}</h3>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <p className="text-sm text-gray-600">Sales Goal Progress</p>
              <div className="w-full bg-gray-200 h-2 rounded">
                <div className="bg-green-500 h-2 rounded" style={{ width: `${salesProgress}%` }} />
              </div>
              <p className="text-xs text-gray-500 mt-1">{salesProgress.toFixed(0)}% of ₱{salesGoal.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Driver Performance Section */}
      <div className="flex flex-col bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-md font-semibold text-gray-700 mb-4">Driver Performance</h3>
        <div className="flex flex-col md:flex-row justify-between w-full gap-6">
          {/* Left Side - Data */}
          <div className="flex flex-col space-y-4 w-full md:w-1/5">
            <div className="bg-purple-100 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600">This Month</p>
              <h3 className="text-xl font-bold text-gray-900">{monthlyTripCount} trips</h3>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600">Avg Sales / Day</p>
              <h3 className="text-xl font-bold text-gray-900">₱{avgSalesPerDay.toLocaleString()}</h3>
            </div>
          </div>

          {/* Graph */}
          <div className="w-full md:w-3/5">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#f97316" />
                <Bar dataKey="passengers" fill="#60a5fa" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Right Panel */}
          <div className="flex flex-col space-y-4 w-full md:w-1/5">
            <div className="bg-white p-4 rounded-lg shadow border">
              <p className="text-sm text-gray-600">Avg Passengers / Trip</p>
              <h3 className="text-lg font-bold text-gray-900">
                {monthlyTripCount && passengerTotal ? (passengerTotal / monthlyTripCount).toFixed(1) : '0.0'}
              </h3>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <p className="text-sm text-gray-600">Top Day (Placeholder)</p>
              <h3 className="text-md font-semibold text-indigo-700">Wednesday</h3>
              <p className="text-xs text-gray-500">₱1,230 | 102 passengers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DriverDashboard
