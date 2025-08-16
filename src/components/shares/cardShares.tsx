import React, { useState } from "react";

type Share = {
  id: number;
  name: string;
  share: number;
};

export default function CardShares() {
  const [shares, setShares] = useState<Share[]>([
    { id: 1, name: "Transport Cooperative", share: 50 },
    { id: 2, name: "DOTr", share: 50 },
  ]);

  const updateShare = (id: number, newValue: number) => {
    const idx = shares.findIndex((s) => s.id === id);
    const oldValue = shares[idx].share;
    const delta = newValue - oldValue;

    const othersCount = shares.length - 1;
    if (othersCount <= 0) return;

    const adjustPer = delta / othersCount;

    let updated = shares.map((s) => {
      if (s.id === id) return { ...s, share: newValue };
      return {
        ...s,
        share: Math.max(0, Math.min(100, s.share - adjustPer)),
      };
    });

    // Normalize to exactly 100
    const total = updated.reduce((sum, s) => sum + s.share, 0);
    const diff = 100 - total;
    updated[updated.length - 1].share += diff;

    setShares(updated);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Card Revenue Shares
      </h2>

      {shares.map((s) => (
        <div key={s.id} className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700 font-medium">{s.name}</span>
            <input
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={s.share}
              onChange={(e) =>
                updateShare(s.id, parseFloat(e.target.value) || 0)
              }
              className="w-20 px-2 py-1 border rounded text-right"
            />
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={s.share}
            onChange={(e) => updateShare(s.id, parseFloat(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>
      ))}

      <div className="mt-6 text-lg font-semibold text-center">
        Total:{" "}
        <span
          className={
            shares.reduce((sum, s) => sum + s.share, 0).toFixed(1) === "100.0"
              ? "text-green-600"
              : "text-red-500"
          }
        >
          {shares.reduce((sum, s) => sum + s.share, 0).toFixed(1)}%
        </span>
      </div>
    </div>
  );
}
