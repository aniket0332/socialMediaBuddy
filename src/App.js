import PrivateRoute from "./routes/PrivateRoute";
import Dashboard from './pages/dashboard/dashboard';
import Auth from "./pages/auth/auth";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Auth />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;