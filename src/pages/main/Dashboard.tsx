import { useEffect, useState } from 'react';
import { FaBus, FaUsers, FaUserTie } from 'react-icons/fa';
import ClickableCountContainer from '../../components/Dashboard/ClickableCountContainer';
import SalesOverview from '../../components/Dashboard/SalesOverview';
import AdminContainer from '../../components/Dashboard/AdminContainer';
import RecentTransactions from '../../components/Dashboard/RecentTransactions';
import DriverDashboard from '../Drivers/DriverDashboard'; // import this

import { getAllBuses } from '../../api/busApi';
import { getAllDrivers } from '../../api/driverApi';
import DriverShares from '../../components/Dashboard/Shares';

const Dashboard = () => {
  const userRole = localStorage.getItem('role');

  // 👇 If role is 'driver', show driver dashboard instead
  if (userRole === 'driver') {
    return <DriverDashboard />;
  }

  // Admin/operator/co-op dashboard below
  const [totalBuses, setTotalBuses] = useState(0);
  const [totalDrivers, setTotalDrivers] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const busesData = await getAllBuses();
        setTotalBuses(Object.keys(busesData).length);

        const driversData = await getAllDrivers();
        setTotalDrivers(Object.keys(driversData).length);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0A2A54] relative inline-block pb-2">
          Dashboard
          <span className="absolute left-0 bottom-0 w-full h-1 bg-yellow-400 rounded"></span>
        </h1>
        <p className="text-lg text-gray-700 mt-3">Welcome back Admin name!</p>
        <p className="text-sm text-gray-500">role</p>
      </div>

      {/* Count Containers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-10">
        <ClickableCountContainer
          icon={<FaUsers />}
          count={0} // Placeholder for now
          title="Total Passengers"
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-500"
          className="min-h-[140px]"
        />
        <ClickableCountContainer
          icon={<FaBus />}
          count={totalBuses}
          title="Total Bus"
          iconBgColor="bg-blue-100"
          iconColor="text-blue-500"
          className="min-h-[140px]"
        />
        <ClickableCountContainer
          icon={<FaUserTie />}
          count={totalDrivers}
          title="Total Drivers"
          iconBgColor="bg-gray-200"
          iconColor="text-gray-800"
          className="min-h-[140px]"
        />
      </div>

      {/* Sales Overview + Admins */}
      <div className="grid grid-cols-1 mb-10 lg:grid-cols-[2.2fr_0.8fr] gap-6 min-h-[500px]">
        <div className="h-full w-full">
          <SalesOverview />
        </div>
        <div className="h-full w-full">
          <AdminContainer />
        </div>
      </div>

      <DriverShares />

      {/* Transactions */}
      <RecentTransactions />
    </div>
  );
};

export default Dashboard;
