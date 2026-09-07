import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { ResumePage } from '@/pages/ResumePage';
import { SkillGapPage } from '@/pages/SkillGapPage';
import { RoadmapPage } from '@/pages/RoadmapPage';
import { AssessmentsPage } from '@/pages/AssessmentsPage';
import { InterviewsPage } from '@/pages/InterviewsPage';
import { CompaniesPage } from '@/pages/CompaniesPage';
import { ProgressPage } from '@/pages/ProgressPage';
import { CoachPage } from '@/pages/CoachPage';
import { SettingsPage } from '@/pages/SettingsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Routes>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/resume" element={<ResumePage />} />
                    <Route path="/skill-gap" element={<SkillGapPage />} />
                    <Route path="/roadmap" element={<RoadmapPage />} />
                    <Route path="/assessments/:type" element={<AssessmentsPage />} />
                    <Route path="/interviews" element={<InterviewsPage />} />
                    <Route path="/companies" element={<CompaniesPage />} />
                    <Route path="/progress" element={<ProgressPage />} />
                    <Route path="/coach" element={<CoachPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
