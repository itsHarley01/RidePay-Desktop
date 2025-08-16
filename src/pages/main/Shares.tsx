import React, { useEffect, useState } from 'react'
import {
  getShares,
  updateMainShares,
  updateOperatorShares,
} from '../../api/sharesApi'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import BusShares from '../../components/shares/busShares'
import CardShares from '../../components/shares/cardShares'

export default function Shares() {
  const [initialShares, setInitialShares] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchShares = async () => {
      try {
        const data = await getShares()
        // map API -> BusShares format
        const mapped = [
          { id: 1, name: 'DOTr', share: Number(data.dotrShare) },
          { id: 2, name: 'Transport Cooperative', share: Number(data.coopShare) },
          { id: 3, name: 'Transport Operator', share: Number(data.operatorShare) },
          { id: 4, name: 'Driver', share: Number(data.driverShare) },
        ]
        setInitialShares(mapped)
      } catch (err) {
        toast.error('Failed to fetch shares')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchShares()
  }, [])

const handleSave = async (shares: any[]) => {
  try {
    const payloadMain = {
      dotrShare: String(shares.find((s) => s.name === 'DOTr')?.share ?? 0),
      coopShare: String(shares.find((s) => s.name === 'Transport Cooperative')?.share ?? 0),
    }

    const payloadOperator = {
      operatorShare: String(shares.find((s) => s.name === 'Transport Operator')?.share ?? 0),
      driverShare: String(shares.find((s) => s.name === 'Driver')?.share ?? 0),
    }

    await updateMainShares(payloadMain)
    await updateOperatorShares(payloadOperator)

    toast.success('Shares updated successfully')
  } catch (err) {
    toast.error('Failed to update shares')
    console.error(err)
  }
}


  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-3xl font-bold text-[#0A2A54] relative inline-block pb-2 mb-6">
        Shares
        <span className="absolute left-0 bottom-0 w-full h-1 bg-yellow-400 rounded"></span>
      </h1>

      <div className="mt-6 border-b border-gray-300"></div>
      
      <div className="my-6 flex gap-6">
        {/* Left column - BusShares */}
        <div className="w-1/3">  
          {!loading && initialShares.length > 0 && (
            <BusShares initialShares={initialShares} onSave={handleSave} />
          )}
        </div>
        
        {/* Right column - Graphs container */}
        <div className="flex-1 bg-gray-100 rounded-xl p-4 shadow">
          <h2 className="text-xl font-semibold mb-4">Graphs</h2>
          {/* Add your charts here */}
          <p className="text-gray-600">Graph placeholder...</p>
        </div>
      </div>

      <CardShares />
    </div>
  )
}
