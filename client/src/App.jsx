import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Landing from './pages/Landing';
import Workers from './pages/Workers';
import WorkerProfile from './pages/WorkerProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import ClientDashboard from './pages/client/Dashboard';
import ClientRequest from './pages/client/ClientRequest';
import ClientRequestsList from './pages/client/ClientRequestsList';
import ClientReview from './pages/client/ClientReview';
import ClientChat from './pages/client/ClientChat';
import WorkerDashboard from './pages/worker/Dashboard';
import AdminPanel from './pages/admin/AdminPanel';
import Browse from './pages/Browse';
import FieldCategories from './pages/FieldCategories';
import CategoryWorkers from './pages/CategoryWorkers';
import AdminLogin from './pages/AdminLogin';
import Terms from './pages/Terms';
import About from './pages/About';
import Contact from './pages/Contact';
import MyLiveClasses from './pages/client/MyLiveClasses';

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
  if (!user) return <Navigate to="/login" replace />;
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
        <Routes>
          <Route path="/" element={<Landing />} />
          
          {/* ✅ مسیرهای یکسان برای همه فیلدها */}
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
      </main>
      <Footer />
    </div>
  );
}