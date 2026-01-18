import { Routes, Route, Navigate } from "react-router-dom"
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import PostsPage from './pages/PostsPage'
import Hero from './pages/Hero'
import './App.css'
import { AuthProvider, useAuth } from './context/AuthContext'
import MainLayout from './components/layout/MainLayout'
import React from "react"

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Protected Posts Route */}
        <Route
          path="/posts"
          element={
            <ProtectedRoute>
              <MainLayout>
                <PostsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
