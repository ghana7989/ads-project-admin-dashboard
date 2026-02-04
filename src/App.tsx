import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useAppSelector } from './app/hooks';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import VideosPage from './pages/VideosPage';
import SequencesPage from './pages/SequencesPage';
import SequenceEditorPage from './pages/SequenceEditorPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="videos" element={<VideosPage />} />
          <Route path="sequences" element={<SequencesPage />} />
          <Route path="sequences/:id/edit" element={<SequenceEditorPage />} />
          <Route path="sequences/new" element={<SequenceEditorPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
