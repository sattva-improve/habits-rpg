import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserProvider } from '@/contexts/UserContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Layout } from './layouts';
import { Dashboard } from './pages/Dashboard';
import { CreateHabit } from './pages/CreateHabit';
import { Achievements } from './pages/Achievements';
import { AuthPage } from './pages/Auth';
import { ProfileSetupPage } from './pages/ProfileSetup';
import { ROUTES } from './constants';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/profile-setup"
              element={
                <ProtectedRoute>
                  <ProfileSetupPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
                      <Route path={ROUTES.CREATE_QUEST} element={<CreateHabit />} />
                      <Route path={ROUTES.ACHIEVEMENTS} element={<Achievements />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster position="top-center" richColors />
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}