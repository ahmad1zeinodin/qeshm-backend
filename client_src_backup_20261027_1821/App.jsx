import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Navbar from './components/Navbar';
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
import Hotels from './pages/Hotels';
import WorkerDashboard from './pages/worker/Dashboard';
import ProfileSettings from './pages/worker/ProfileSettings';
import WorkerSubscription from './pages/worker/Subscription';
import WorkerOnboarding from './pages/worker/Onboarding';
import BusinessDashboard from './pages/business/Dashboard';
import BusinessOnboarding from './pages/business/Onboarding';
import AdminPanel from './pages/admin/Panel';
import Browse from './pages/Browse';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import ReporterPanel from './pages/ReporterPanel';
import AdminLogin from './pages/AdminLogin';
import Attractions from './pages/Attractions';
import Restaurants from './pages/Restaurants';
import Terms from './pages/Terms';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import WorkerConsultations from './pages/worker/Consultations';
import WorkerLiveClasses from './pages/worker/LiveClasses';
import MyLiveClasses from './pages/client/MyLiveClasses';
import ShopBrowse from './pages/ShopBrowse';
import WorkerShopPage from './pages/worker/Shop';
import VendorProducts from './pages/worker/VendorProducts';
import WorkerWallet from './pages/worker/WorkerWallet';
import Bookings from './pages/Bookings';

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

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <ScrollToTop />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/browse" element={<Navigate to="/services" replace />} />
          <Route path="/services" element={<Browse />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/attractions" element={<Attractions />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/reporter" element={<ReporterPanel />} />
          <Route path="/workers" element={<Navigate to="/professionals" replace />} />
          <Route path="/workers/:id" element={<WorkerProfileRedirect />} />
          <Route path="/professionals" element={<Workers />} />
          <Route path="/pro/:id" element={<WorkerProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/client" element={<ProtectedRoute role="client"><ClientDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/client/request" element={<ProtectedRoute role="client"><ClientRequest /></ProtectedRoute>} />
          <Route path="/dashboard/client/requests" element={<ProtectedRoute role="client"><ClientRequestsList /></ProtectedRoute>} />
          <Route path="/dashboard/client/review/:jobId" element={<ProtectedRoute role="client"><ClientReview /></ProtectedRoute>} />
          <Route path="/dashboard/client/chat" element={<ProtectedRoute role="client"><ClientChat /></ProtectedRoute>} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/dashboard/worker" element={<ProtectedRoute role="worker"><WorkerDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/worker/profile" element={<ProtectedRoute role="worker"><ProfileSettings /></ProtectedRoute>} />
          <Route path="/dashboard/worker/onboarding" element={<ProtectedRoute role="worker"><WorkerOnboarding /></ProtectedRoute>} />
          <Route path="/dashboard/worker/subscription" element={<ProtectedRoute role="worker"><WorkerSubscription /></ProtectedRoute>} />
          <Route path="/dashboard/worker/consultations" element={<ProtectedRoute role="worker"><WorkerConsultations /></ProtectedRoute>} />
          <Route path="/dashboard/worker/live-classes" element={<ProtectedRoute role="worker"><WorkerLiveClasses /></ProtectedRoute>} />
          <Route path="/dashboard/my-classes" element={<ProtectedRoute><MyLiveClasses /></ProtectedRoute>} />
          <Route path="/shop" element={<ShopBrowse />} />
          <Route path="/dashboard/worker/shop" element={<ProtectedRoute role="worker"><WorkerShopPage /></ProtectedRoute>} />
          <Route path="/dashboard/worker/products" element={<ProtectedRoute role="worker"><VendorProducts /></ProtectedRoute>} />
          <Route path="/dashboard/worker/wallet" element={<ProtectedRoute role="worker"><WorkerWallet /></ProtectedRoute>} />
          <Route path="/dashboard/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
          <Route path="/admin1410" element={<ProtectedRoute role="admin"><AdminPanel /></ProtectedRoute>} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/dashboard/business" element={<ProtectedRoute role="business"><BusinessDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/business/onboarding" element={<ProtectedRoute role="business"><BusinessOnboarding /></ProtectedRoute>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
