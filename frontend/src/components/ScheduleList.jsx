function ScheduleList() {
  const schedule = [
    { time: '09:00', subject: 'Mathematics', color: 'border-blue-500' },
    { time: '11:00', subject: 'Physics', color: 'border-green-500' },
    { time: '15:00', subject: 'Programming', color: 'border-purple-500' },
  ]

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Today's Schedule</h2>
      <div className="space-y-3">
        {schedule.map((item, index) => (
          <div
            key={index}
            className={`border-l-4 ${item.color} bg-gray-50 px-4 py-3 rounded-r-lg flex justify-between items-center`}
          >
            <span className="font-semibold text-gray-700">{item.time}</span>
            <span className="text-gray-600">{item.subject}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ScheduleList