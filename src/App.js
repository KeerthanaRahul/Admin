import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import Dashboard from './components/Pages/Dashboard';
import Layout from './components/Layout/Layout';
import Food from './components/Pages/Food';
import Orders from './components/Pages/Orders';
import Reservations from './components/Pages/Reservations';
import NotFound from './CommonComponents/NotFound/NotFound';
import { AppProvider } from './components/Context/AppContext';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/food" element={<Food />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/staff" element={<Navigate to="/" />} />
          <Route path="/settings" element={<Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;
