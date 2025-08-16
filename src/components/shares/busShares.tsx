import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Share = {
  id: number;
  name: string;
  share: number;
  locked?: boolean;
};

type BusSharesProps = {
  initialShares?: Share[]; // fetched data
  onSave?: (shares: Share[]) => void; // push to DB
};

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626"];

const roundToWhole = (value: number) => Math.round(value);

export default function BusShares({ initialShares, onSave }: BusSharesProps) {
  const [shares, setShares] = useState<Share[]>(
    initialShares ?? [
      { id: 1, name: "DOTr", share: 0 },
      { id: 2, name: "Transport Cooperative", share: 0 },
      { id: 3, name: "Transport Operator", share: 0 },
      { id: 4, name: "Driver", share: 0 },
    ]
  );

  const [isEditing, setIsEditing] = useState(false);

  // If parent updates props (like after fetching async), sync to state
  useEffect(() => {
    if (initialShares) setShares(initialShares);
  }, [initialShares]);

  const updateShare = (id: number, newValue: number) => {
    newValue = roundToWhole(newValue);

    const otherLockedTotal = shares
      .filter((s) => s.id !== id && s.locked)
      .reduce((sum, s) => sum + s.share, 0);

    if (newValue + otherLockedTotal > 100) {
      newValue = 100 - otherLockedTotal;
    }

    let updated = shares.map((s) =>
      s.id === id ? { ...s, share: newValue, locked: true } : s
    );

    const lockedTotal = updated
      .filter((s) => s.locked)
      .reduce((sum, s) => sum + s.share, 0);

    let remaining = 100 - lockedTotal;
    const unlocked = updated.filter((s) => !s.locked);

    if (unlocked.length > 0) {
      const perShare = remaining / unlocked.length;
      updated = updated.map((s) =>
        s.locked ? s : { ...s, share: roundToWhole(perShare) }
      );
    }

    setShares(updated);
  };

  const clearShare = (id: number) => {
    setShares((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, share: 0, locked: false } : s
      )
    );
  };

  const handleSave = () => {
    setIsEditing(false);
    onSave?.(shares); // callback to parent
  };

  return (
    <div className="w-full mx-auto p-6 bg-white shadow-lg rounded-xl">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Bus Shares Allocation
        </h2>
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600"
        >
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>

      {/* Pie Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={shares}
            dataKey="share"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            paddingAngle={2}
            label={({ value }) => `${value}%`}
            labelLine={false}
          >
            {shares.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(val: number) => `${Math.round(val)}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      {/* Inputs only when editing */}
      {isEditing && (
        <div className="grid grid-cols-2 gap-4 mt-6">
          {shares.map((s) => (
            <div
              key={s.id}
              className="flex justify-between items-center border rounded px-3 py-2"
            >
              <span className="font-medium">{s.name}</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={s.share}
                  onChange={(e) => updateShare(s.id, parseInt(e.target.value))}
                  className="w-20 px-2 py-1 border rounded text-right"
                />
                <button
                  onClick={() => clearShare(s.id)}
                  className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                >
                  Clear
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Total */}
      <div className="mt-2 text-lg font-semibold text-center">
        Total:{" "}
        <span
          className={
            shares.reduce((sum, s) => sum + s.share, 0) === 100
              ? "text-green-600"
              : "text-red-500"
          }
        >
          {shares.reduce((sum, s) => sum + s.share, 0)}%
        </span>
      </div>
    </div>
  );
}
