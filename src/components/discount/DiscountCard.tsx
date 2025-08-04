// DiscountCard.tsx (move this to same file or separate file as you prefer)
import React from 'react'
import { Pencil, X, PercentCircle } from 'lucide-react'

interface DiscountCardProps {
  type: string
  label: string
  data: { rate: number; validity: number }
  isEditing: boolean
  onChange: (field: 'rate' | 'validity', value: number) => void
  onSave: () => void
  onCancel: () => void
  onEdit: () => void
}

export const DiscountCard: React.FC<DiscountCardProps> = ({
  type,
  label,
  data,
  isEditing,
  onChange,
  onSave,
  onCancel,
  onEdit
}) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md shadow-gray-300 w-full max-w-md relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-xl font-semibold text-[#0A2A54]">
          <PercentCircle size={20} /> {label}
        </div>
        {isEditing ? (
          <button onClick={onCancel} className="text-gray-500 hover:text-red-600">
            <X size={20} />
          </button>
        ) : (
          <button onClick={onEdit} className="text-gray-500 hover:text-gray-800">
            <Pencil size={18} />
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Discount Rate (%)</label>
          <input
            type="number"
            value={data.rate}
            onChange={(e) => onChange('rate', parseFloat(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            disabled={!isEditing}
            min={0}
            max={100}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Validity (Years)</label>
          <input
            type="number"
            value={data.validity}
            onChange={(e) => onChange('validity', parseInt(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            disabled={!isEditing}
            min={1}
            max={100}
          />
        </div>

        {isEditing && (
          <button
            onClick={onSave}
            className="bg-yellow-500 text-white px-6 py-2 rounded-lg shadow hover:bg-yellow-400 transition"
          >
            Save Changes
          </button>
        )}
      </div>
    </div>
  )
}
