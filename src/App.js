import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Pages/Dashboard';
import Layout from './components/Layout/Layout';
import Food from './components/Pages/Food';
import Orders from './components/Pages/Orders';
import NotFound from './CommonComponents/NotFound/NotFound';
import { AppProvider } from './components/Context/AppContext';
import Support from './components/Pages/Support';
import Login from './components/Pages/Login';
import Signup from './components/Pages/Signup';
import { AuthProvider } from './components/Context/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Feedback from './components/Pages/Feedback';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <Layout>
                  <Orders />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/food" element={
              <ProtectedRoute>
                <Layout>
                  <Food />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/support" element={
              <ProtectedRoute>
                <Layout>
                  <Support />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/feedback" element={
              <ProtectedRoute>
                <Layout>
                  <Feedback />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="*" element={
              <ProtectedRoute>
                <Navigate to="/\" replace />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
