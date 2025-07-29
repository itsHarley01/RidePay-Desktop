import AllDrivers from "../Drivers/AllDrivers";

export default function Drivers() {
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
      <div className="mt-6 border-b border-gray-300 mb-6"/>

      <AllDrivers/>
    </div>
  )
}
