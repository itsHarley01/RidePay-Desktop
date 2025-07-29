import React, { useState } from "react";
import {
  Cog6ToothIcon,
  BellIcon,
  UserCircleIcon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom"; 
import GeneralSettings from "./GeneralSettings";
import NotificationSettings from "./NotificationSettings";
import AccountSettings from "./AccountSettings";
import { logout } from "../../utils/auth"; 

export default function AppSettings({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate(); // ✅ create navigate instance
  const [activeTab, setActiveTab] = useState<"general" | "notifications" | "account">("general");

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralSettings />;
      case "notifications":
        return <NotificationSettings />;
      case "account":
        return <AccountSettings />;
      default:
        return null;
    }
  };

  const handleLogout = () => {
    logout(); 
    navigate("/");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Dim Background */}
      <div className="absolute inset-0 bg-black/50 bg-opacity-40" onClick={onClose} />

      {/* Settings Panel */}
      <div className="relative z-50 bg-white w-[720px] h-[520px] rounded-xl shadow-lg flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-1/3 bg-[#0A2A54] text-white flex flex-col p-4 justify-between">
          {/* Top Section */}
          <div>
            {/* Close Button */}
            <button
              className="absolute top-3 left-3 text-gray-300 hover:text-red-400"
              onClick={onClose}
              title="Close"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            {/* Navigation Tabs */}
            <div className="mt-10 space-y-4">
              <div
                onClick={() => setActiveTab("general")}
                className={`flex items-center space-x-2 cursor-pointer hover:text-[#f2be22] ${
                  activeTab === "general" ? "text-[#f2be22]" : ""
                }`}
              >
                <Cog6ToothIcon className="w-5 h-5" />
                <span>General</span>
              </div>
              <div
                onClick={() => setActiveTab("notifications")}
                className={`flex items-center space-x-2 cursor-pointer hover:text-[#f2be22] ${
                  activeTab === "notifications" ? "text-[#f2be22]" : ""
                }`}
              >
                <BellIcon className="w-5 h-5" />
                <span>Notifications</span>
              </div>
              <div
                onClick={() => setActiveTab("account")}
                className={`flex items-center space-x-2 cursor-pointer hover:text-[#f2be22] ${
                  activeTab === "account" ? "text-[#f2be22]" : ""
                }`}
              >
                <UserCircleIcon className="w-5 h-5" />
                <span>Account</span>
              </div>
            </div>
          </div>

          {/* Bottom Logout Button */}
          <div className="mt-6">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-red-400 hover:text-red-500"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-6 relative overflow-y-auto">{renderContent()}</div>
      </div>
    </div>
  );
}
