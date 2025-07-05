import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from "@/contexts/auth-context";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import DashboardPage from "@/pages/dashboard";
import LandingPage  from "@/pages/LandingPage";
function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}


export default App;
