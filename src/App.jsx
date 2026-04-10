import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './components/Home';
import ContactPage from './components/ContactPage';
import ProductsPage from './components/ProductsPage';
import AdminLogin from './components/admin/AdminLogin';
import AdminSignup from './components/admin/AdminSignup';
import AdminForgotPassword from './components/admin/AdminForgotPassword';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminBlog from './components/admin/AdminBlog';
import AllBlogsPage from './components/AllBlogsPage';
import BlogDetailPage from './components/BlogDetailPage';
import PolicyNotice from './components/PolicyNotice';
import TermsOfService from './components/TermsOfService';
import PetsCareLanding from './components/PetsCareLanding';
import AboutPage from './components/AboutPage';
import DoctorsPage from './components/DoctorsPage';
import ProductDetailPage from './components/ProductDetailPage';

const PUBLIC_TITLE = 'Kings Pet Hospital | Best Veterinary Care';
const ADMIN_DASHBOARD_TITLE = 'Admin Dashboard | Kings Pet Hospital';

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
};

const RouteTitleManager = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    document.title = path.startsWith('/admin') ? ADMIN_DASHBOARD_TITLE : PUBLIC_TITLE;
  }, [location.pathname]);

  return null;
};

function App() {
  return (
    <Router>
      <RouteTitleManager />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Home />} />
        <Route path="/gallery" element={<Home />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/team" element={<DoctorsPage />} />
        <Route path="/booking" element={<Home />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/pets-care" element={<PetsCareLanding />} />
        <Route path="/blog" element={<AllBlogsPage />} />
        <Route path="/blog/:id" element={<BlogDetailPage />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/blogs" element={<AdminBlog />} />
        <Route path="/privacy" element={<PolicyNotice />} />
        <Route path="/terms" element={<TermsOfService />} />
      </Routes>
    </Router>
  );
}

export default App;
