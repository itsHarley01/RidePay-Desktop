// /components/dashboard/AdminContainer.tsx
import React from 'react';

const adminList = [
  // { name: "Juan dela Cruz", role: "Human Resources", avatar: "🧑‍💼" },
  // { name: "Blandin Son", role: "Cashier", avatar: "👨‍💻" },
  // { name: "Chrysler Mc", role: "Cashier", avatar: "👩‍💻" },
  // { name: "John Harley", role: "Accountant", avatar: "🧑‍💼" },
  // { name: "Imo mama", role: "Accountant", avatar: "👨‍💼" },
];

const AdminContainer = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full h-full md:max-w-xs">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md font-semibold">Admins</h3>
        <button className="text-xs bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 transition">View all</button>
      </div>

      <div className="space-y-4">
        {adminList.map((admin, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="text-2xl">{admin.avatar}</div>
            <div>
              <p className="text-sm font-medium">{admin.name}</p>
              <p className="text-xs text-gray-500">{admin.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminContainer;
