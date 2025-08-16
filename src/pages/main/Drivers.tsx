import { useState, useEffect } from "react";
import AllDrivers from "../Drivers/AllDrivers";
import AdminRequirements from "../Admins/AdminRequirements";

export default function Drivers() {
  const [role, setRole] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"drivers" | "requirements">("drivers");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  // Admin-operator tabbed layout
  if (role === "admin-operator") {
    return (
      <div className="p-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#0A2A54] relative inline-block pb-2">
            Drivers
            <span className="absolute left-0 bottom-0 w-full h-1 bg-yellow-400 rounded"></span>
          </h1>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-gray-300">
          <div className="flex space-x-8">
            <button
              className={`pb-2 text-lg font-medium transition-all duration-200 ${
                activeTab === "drivers"
                  ? "text-[#0A2A54] border-b-4 border-yellow-400"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("drivers")}
            >
              All Drivers
            </button>
            <button
              className={`pb-2 text-lg font-medium transition-all duration-200 ${
                activeTab === "requirements"
                  ? "text-[#0A2A54] border-b-4 border-yellow-400"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("requirements")}
            >
              Admin Requirements
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "drivers" && <AllDrivers />}
          {activeTab === "requirements" && <AdminRequirements />}
        </div>
      </div>
    );
  }

  // Default layout (non-admin-operator)
  return (
    <div className="p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0A2A54] relative inline-block pb-2">
          Drivers
          <span className="absolute left-0 bottom-0 w-full h-1 bg-yellow-400 rounded"></span>
        </h1>
      </div>

      {/* Separator */}
      <div className="mt-6 border-b border-gray-300 mb-6" />

      {/* Content */}
      <AllDrivers />
    </div>
  );
}
