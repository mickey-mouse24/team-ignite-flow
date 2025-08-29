import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import './App.css'

// Pages
import Login from './features/Login'
import Dashboard from './features/Dashboard'
import Initiatives from './features/Initiatives'
import Projects from './features/Projects'
import Team from './features/Team'
import NotFound from './features/NotFound'


// Components
import ProtectedRoute from './components/ProtectedRoute'

// Hooks
import { AuthProvider } from './hooks/useAuth'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/initiatives" element={
                <ProtectedRoute>
                  <Initiatives />
                </ProtectedRoute>
              } />
              <Route path="/projects" element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              } />
              <Route path="/team" element={
                <ProtectedRoute>
                  <Team />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster position="top-right" richColors />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
