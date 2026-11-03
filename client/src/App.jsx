import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// ✅ Lazy load صفحات (فقط وقتی بازدید می‌شن، بارگذاری می‌شن)
const Landing = lazy(() => import('./pages/Landing'));
const Workers = lazy(() => import('./pages/Workers'));
const WorkerProfile = lazy(() => import('./pages/WorkerProfile'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Browse = lazy(() => import('./pages/Browse'));
const FieldCategories = lazy(() => import('./pages/FieldCategories'));
const CategoryWorkers = lazy(() => import('./pages/CategoryWorkers'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const Terms = lazy(() => import('./pages/Terms'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

const ClientDashboard = lazy(() => import('./pages/client/Dashboard'));
const ClientRequest = lazy(() => import('./pages/client/ClientRequest'));
const ClientRequestsList = lazy(() => import('./pages/client/ClientRequestsList'));
const ClientReview = lazy(() => import('./pages/client/ClientReview'));
const ClientChat = lazy(() => import('./pages/client/ClientChat'));
const MyLiveClasses = lazy(() => import('./pages/client/MyLiveClasses'));

const WorkerDashboard = lazy(() => import('./pages/worker/Dashboard'));
const AdminPanel = lazy(() => import('./pages/admin/AdminPanel'));

// ✅ کامپوننت Loading
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
    </div>
  );
}

function WorkerProfileRedirect() {
  const { id } = useParams();
  return <Navigate to={`/pro/${id}`} replace />;
}

function ProtectedRoute({ children, role }) {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

function DashboardRedirect() {
  const { user } = useAuthStore();
  if (user.role === 'client') return <Navigate to="/dashboard/client" replace />;
  if (user.role === 'worker') return <Navigate to="/dashboard/worker" replace />;
  if (user.role === 'admin') return <Navigate to="/admin1410" replace />;
  return <Navigate to="/" replace />;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <ScrollToTop />
      <main className="flex-1">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Landing />} />

            <Route path="/services" element={<Browse />} />
            <Route path="/services/:fieldName" element={<FieldCategories />} />
            <Route path="/category/:id" element={<CategoryWorkers />} />
            <Route path="/pro/:id" element={<WorkerProfile />} />

            <Route path="/professionals" element={<Workers />} />
            <Route path="/workers/:id" element={<WorkerProfileRedirect />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/dashboard" element={<DashboardRedirect />} />
            <Route path="/dashboard/client" element={<ProtectedRoute role="client"><ClientDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/client/request" element={<ProtectedRoute role="client"><ClientRequest /></ProtectedRoute>} />
            <Route path="/dashboard/client/requests" element={<ProtectedRoute role="client"><ClientRequestsList /></ProtectedRoute>} />
            <Route path="/dashboard/client/review/:jobId" element={<ProtectedRoute role="client"><ClientReview /></ProtectedRoute>} />
            <Route path="/dashboard/client/chat" element={<ProtectedRoute role="client"><ClientChat /></ProtectedRoute>} />

            <Route path="/dashboard/worker" element={<ProtectedRoute role="worker"><WorkerDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/my-classes" element={<ProtectedRoute><MyLiveClasses /></ProtectedRoute>} />

            <Route path="/admin1410" element={<ProtectedRoute role="admin"><AdminPanel /></ProtectedRoute>} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}