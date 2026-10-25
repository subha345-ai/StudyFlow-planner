function ProgressBar({ percent = 78 }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Progress</h2>
      <div className="flex items-center gap-4">
        <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          ></div>
        </div>
        <span className="font-bold text-blue-600 text-lg">{percent}%</span>
      </div>
    </div>
  )
}

export default ProgressBar