import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Login from "../components/Login";
import Dashboard from "../components/pages/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import MyTickets from "../components/pages/MyTickets";
import OutgoingTickets from "../components/pages/OutgoingTickets";
import Home from "../components/pages/Home";
function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute
                allowedRoles={["Admin","User", "ExternalService", "CartridgeService"]}>
                <Home />;
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute
                allowedRoles={["Admin"]}>
                <Dashboard />;
              </ProtectedRoute>
            }
          />
          <Route
            path="/outgoingtickets"
            element={
              <ProtectedRoute
                allowedRoles={["Admin","User","ExternalService", "CartridgeService"]}>
                <OutgoingTickets />;
              </ProtectedRoute>
            }
          />
          <Route
            path="/mytickets"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "Admin",
                  "User",
                  "ExternalService",
                  "CartridgeService",
                ]}>
                <MyTickets />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
