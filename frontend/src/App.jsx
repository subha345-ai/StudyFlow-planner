import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import ProfileSetup from './pages/ProfileSetup'
import Dashboard from './pages/Dashboard'
import Search from './pages/Search'
import Schedule from './pages/Schedule'
import Tasks from './pages/Tasks'
import Progress from './pages/Progress'
import Subjects from './pages/Subjects'
import Pomodoro from './pages/Pomodoro'
import Chapters from './pages/Chapters'
import ChapterDetail from './pages/ChapterDetail'
import TaskDetail from './pages/TaskDetail'
import Exam from './pages/Exam'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import MainLayout from './layouts/MainLayout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ═══ Auth ═══ */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProfileSetup />} />

        {/* ═══ Main ═══ */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/search" element={<Search />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/pomodoro" element={<Pomodoro />} />
          <Route path="/chapters" element={<Chapters />} />
          <Route path="/chapter/:id" element={<ChapterDetail />} />
          <Route path="/task/:id" element={<TaskDetail />} />
        </Route>

        {/* ═══ Exam ═══ */}
        <Route path="/exam/:chapterId/:topicId" element={<Exam />} />
        <Route path="/exam/task/:id" element={<Exam />} />

        {/* ═══ Admin ═══ */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App