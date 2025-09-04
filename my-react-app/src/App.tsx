import { lazy, Suspense } from 'react'; // Import lazy and Suspense
import { Routes, Route } from 'react-router-dom';
import './App.css'; // Assuming this contains global styles

// Lazily load components to enable code-splitting
// User-facing pages
const HomePage = lazy(() => import('./pages/Home'));
const SearchResultsPage = lazy(() => import('./pages/SearchResultsPage'));
const BookPage = lazy(() => import('./pages/Book'));
const TravellerInfoPage = lazy(() => import('./pages/Travelinfo'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));
const ServicePage = lazy(() => import('./pages/service'));
// Authentication pages
const LoginPage = lazy(() => import('./pages/Login'));
const RegisterPage = lazy(() => import('./pages/Register'));
const UnauthorizedPage = lazy(() => import('./pages/Unauthorized'));
// Admin Pages - also lazily loaded
const AdminDashboard = lazy(() => import('./adminPages/Index'));
const ManageBusPage = lazy(() => import('./adminPages/manageBus'));
const ManageRoutePage = lazy(() => import('./adminPages/manageRoute'));
const ManageSchedulePage = lazy(() => import('./adminPages/manageSch'));
const ManageSeatPage = lazy(() => import('./adminPages/seat'));
const AdminPaymentPage = lazy(() => import('./adminPages/managePayment'));
const AboutUsPage = lazy(()=>import('./pages/About'))
const Contact = lazy(()=>import('./pages/contact'))
// Test page (if still needed, otherwise remove)
const ManageUser= lazy(()=>import('./adminPages/manageUser'))

// PrivateRoute component (assuming it's small and doesn't need lazy loading itself)
import PrivateRoute from './components/privatRoute';
import DestinationsPage from './pages/Destination';
import UserProfilePage from './pages/profileDetail';
import Review from './pages/review';
import EditProfilePage from './pages/editProfile';
import ChangePasswordPage from './pages/changePassword';
import Noti from './pages/Noti';
import SendNoti from './adminPages/SendNoti';

import DestinationDetailPage from './pages/DestinationDetails';
import Test from './components/test';
function App() {

  return (
    <>
      {/* Use Suspense to wrap your Routes. This will display a loading fallback
          content while the lazily loaded components are being fetched. */}
      <Suspense fallback={
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          <span className="ml-4 text-lg text-gray-700">Loading application...</span>
        </div>
      }>
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/unauthorized' element={<UnauthorizedPage />} />
          <Route path='/test' element={<Test />} />
 
          {/* User-specific Routes */}
          <Route path='/search-results' element={<SearchResultsPage />} />
          <Route path='/book/:id' element={<PrivateRoute allowedRoles={['user','admin']}><BookPage /></PrivateRoute>} />
          <Route path='/travel-info/:id' element={<PrivateRoute allowedRoles={['user','admin']}><TravellerInfoPage/></PrivateRoute>} />
          <Route path='/payment/:id' element={<PrivateRoute allowedRoles={['user','admin']}><PaymentPage/></PrivateRoute>} />
          <Route path='/review' element={<Review/>}/>
          <Route path='/service' element={<ServicePage />} />
          <Route path='/destinations' element={<DestinationsPage />} />
          <Route path='/about' element={<AboutUsPage/>}/>
          <Route path='/contact' element={<Contact/>}/>
          <Route path='/profileDetail' element={<PrivateRoute allowedRoles={['user','admin']}><UserProfilePage/></PrivateRoute>}/>
          <Route path='/edit-profile' element={<PrivateRoute allowedRoles={['user','admin']}><EditProfilePage/></PrivateRoute>}/>
          <Route path='/change-password' element={<PrivateRoute allowedRoles={['user','admin']}><ChangePasswordPage/></PrivateRoute>}/>
          <Route path='/notifications' element={<PrivateRoute allowedRoles={['user','admin']}><Noti/></PrivateRoute>}/>
          
          <Route path='/destinationDetail/:id' element={<DestinationDetailPage/>}/>
          {/* Admin Protected Routes */}
          {/* These routes require the user to have 'admin' role */}
          <Route path='/admin' element={<PrivateRoute allowedRoles={['admin']}><AdminDashboard /></PrivateRoute>} />
          <Route path='/manageBus' element={<PrivateRoute allowedRoles={['admin']}><ManageBusPage /></PrivateRoute>} />
          <Route path='/manageRoutes' element={<PrivateRoute allowedRoles={['admin']}><ManageRoutePage /></PrivateRoute>} />
          <Route path='/manageSch' element={<PrivateRoute allowedRoles={['admin']}><ManageSchedulePage /></PrivateRoute>} />
          <Route path='/seat' element={<PrivateRoute allowedRoles={['admin']}><ManageSeatPage /></PrivateRoute>} />
          <Route path='/managePayment' element={<PrivateRoute allowedRoles={['admin']}><AdminPaymentPage /></PrivateRoute>} />
          <Route path='/users' element={<PrivateRoute allowedRoles={['admin']}><ManageUser /></PrivateRoute>} />
          <Route path='/sendNoti'  element={<PrivateRoute allowedRoles={['admin']}><SendNoti/></PrivateRoute>}/>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
