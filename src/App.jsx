import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'

// Admin pages
const Login = lazy(() => import('./pages/admin/Login'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const Events = lazy(() => import('./pages/admin/Events'))
const Clients = lazy(() => import('./pages/admin/Clients'))
const Jobs = lazy(() => import('./pages/admin/Jobs'))
const Applications = lazy(() => import('./pages/admin/Applications'))
const News = lazy(() => import('./pages/admin/News'))
const Messages = lazy(() => import('./pages/admin/Messages'))
const Settings = lazy(() => import('./pages/admin/Settings'))
const StateWorks = lazy(() => import('./pages/admin/StateWorks'))
const FounderAdmin = lazy(() => import('./pages/admin/Founder'))

const pageFallback = (
  <div className="min-h-screen flex items-center justify-center bg-gray-900">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500" />
  </div>
)

// Public pages
import Home from './pages/public/Home'
import About from './pages/public/About'
import Services from './pages/public/Services'
import Portfolio from './pages/public/Portfolio'
import ClientsPublic from './pages/public/Clients'
import Careers from './pages/public/Careers'
import Contact from './pages/public/Contact'
import StateWorkPage from './pages/public/StateWork'
import FounderPublic from './pages/public/Founder'

function App() {
  return (
    <Router>
      <Suspense fallback={pageFallback}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/founder" element={<FounderPublic />} />
        <Route path="/services" element={<Services />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/clients" element={<ClientsPublic />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/states/:slug" element={<StateWorkPage />} />

        {/* Admin auth */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/clients"
          element={
            <ProtectedRoute>
              <Clients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs"
          element={
            <ProtectedRoute>
              <Jobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/applications"
          element={
            <ProtectedRoute>
              <Applications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/news"
          element={
            <ProtectedRoute>
              <News />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/state-works"
          element={
            <ProtectedRoute>
              <StateWorks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/founder"
          element={
            <ProtectedRoute>
              <FounderAdmin />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>
    </Router>
  )
}

export default App


