import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'

// Admin pages
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import Events from './pages/admin/Events'
import Clients from './pages/admin/Clients'
import Jobs from './pages/admin/Jobs'
import Applications from './pages/admin/Applications'
import News from './pages/admin/News'
import Messages from './pages/admin/Messages'
import Settings from './pages/admin/Settings'
import StateWorks from './pages/admin/StateWorks'
import FounderAdmin from './pages/admin/Founder'

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
    </Router>
  )
}

export default App


