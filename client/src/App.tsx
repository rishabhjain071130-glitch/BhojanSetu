import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { DemoFloatingWidget } from './components/DemoFloatingWidget.js';
import { ProtectedRoute } from './components/ProtectedRoute.js';

// Pages
import { LandingPage } from './pages/LandingPage.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { BrowseListingsPage } from './pages/BrowseListingsPage.js';
import { CreateListingPage } from './pages/CreateListingPage.js';
import { ListingDetailPage } from './pages/ListingDetailPage.js';
import { RequestsPage } from './pages/RequestsPage.js';
import { PartnerProfilePage } from './pages/PartnerProfilePage.js';
import { AdminPartnersPage } from './pages/AdminPartnersPage.js';
import { ImpactPage } from './pages/ImpactPage.js';
import { FoodSafetyPage } from './pages/FoodSafetyPage.js';
import { NotFoundPage } from './pages/NotFoundPage.js';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#F7F4EC] text-[#202820] font-sans antialiased selection:bg-[#DDE8D8] selection:text-[#174D3A]">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/listings" element={<BrowseListingsPage />} />
              <Route path="/listings/:id" element={<ListingDetailPage />} />
              <Route path="/impact" element={<ImpactPage />} />
              <Route path="/food-safety" element={<FoodSafetyPage />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/listings/create"
                element={
                  <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                    <CreateListingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/requests"
                element={
                  <ProtectedRoute allowedRoles={['partner', 'admin']}>
                    <RequestsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/partner/profile"
                element={
                  <ProtectedRoute allowedRoles={['partner', 'admin']}>
                    <PartnerProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/partners"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminPartnersPage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
          <DemoFloatingWidget />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
