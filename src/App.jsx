import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './components/Login'
import Gallery from './components/Gallery'
import './App.css'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  
  console.log('ProtectedRoute - loading:', loading, 'user:', user)
  
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-wave">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p>Setting sail...</p>
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/login" />
  }
  
  return children
}

function AppRoutes() {
  const { user, loading } = useAuth()

  console.log('AppRoutes - loading:', loading, 'user:', user)

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-wave">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p>Setting sail...</p>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Gallery />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

function App() {
  console.log('App component rendering')
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app">
          <div className="ocean-bg"></div>
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
