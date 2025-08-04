// UserDiscount.tsx
import React, { useEffect, useState } from 'react'
import { getDiscounts, updateDiscount, DiscountData } from '../../api/discountApi'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { DiscountCard } from '../../components/discount/DiscountCard' // adjust path as needed
import DiscountTable from './discountTable'

const discountTypes = [
  { type: 'student', label: 'Student Discount' },
  { type: 'senior', label: 'Senior Citizen Discount' },
  { type: 'pwd', label: 'PWD Discount' }
]

export default function UserDiscount() {
  const [discounts, setDiscounts] = useState<DiscountData>({
    student: { rate: 0, validity: 1 },
    senior: { rate: 0, validity: 1 },
    pwd: { rate: 0, validity: 1 }
  })

  const [initialDiscounts, setInitialDiscounts] = useState<DiscountData>({
    student: { rate: 0, validity: 1 },
    senior: { rate: 0, validity: 1 },
    pwd: { rate: 0, validity: 1 }
  })

  const [editing, setEditing] = useState<{ [key: string]: boolean }>({
    student: false,
    senior: false,
    pwd: false
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDiscounts()
        setDiscounts(data)
        setInitialDiscounts(data)
      } catch (err) {
        console.error(err)
        toast.error('Failed to load discount settings')
      }
    }

    fetchData()
  }, [])

  const handleChange = (type: string, field: 'rate' | 'validity', value: number) => {
    setDiscounts(prev => ({
      ...prev,
      [type]: {
        ...prev[type as keyof DiscountData],
        [field]: value
      }
    }))
  }

  const handleSave = async (type: string) => {
    const updated = discounts[type as keyof DiscountData]
    const original = initialDiscounts[type as keyof DiscountData]

    const payload: any = {}
    if (updated.rate !== original.rate) payload.rate = updated.rate
    if (updated.validity !== original.validity) payload.validity = updated.validity

    try {
      if (Object.keys(payload).length > 0) {
        await updateDiscount(type as 'student' | 'senior' | 'pwd', payload)
        setInitialDiscounts(prev => ({
          ...prev,
          [type]: updated
        }))
        toast.success(`Updated ${type} discount`)
      } else {
        toast.info('No changes to save')
      }
      setEditing(prev => ({ ...prev, [type]: false }))
    } catch (err) {
      console.error('Error saving discount:', err)
      toast.error(`Failed to update ${type} discount`)
    }
  }

  const handleCancel = (type: string) => {
    setDiscounts(prev => ({
      ...prev,
      [type]: initialDiscounts[type as keyof DiscountData]
    }))
    setEditing(prev => ({ ...prev, [type]: false }))
  }

  return (
    <div className="p-6">
      <ToastContainer />
      <h1 className="text-xl font-bold text-[#0A2A54] mb-6">User Discount Settings</h1>
      <div className="flex flex-wrap justify-between gap-6">
        {discountTypes.map(({ type, label }) => (
          <DiscountCard
            key={type}
            type={type}
            label={label}
            data={discounts[type]}
            isEditing={editing[type]}
            onChange={(field, value) => handleChange(type, field, value)}
            onSave={() => handleSave(type)}
            onCancel={() => handleCancel(type)}
            onEdit={() => setEditing(prev => ({ ...prev, [type]: true }))}
          />
        ))}
      </div>

      <DiscountTable/>
    </div>
  )
}
