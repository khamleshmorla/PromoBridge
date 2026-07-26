import { Routes, Route, Navigate, useOutletContext } from 'react-router-dom';
import { SignedIn, SignedOut, SignIn, SignUp } from '@clerk/clerk-react';
import { Toaster } from 'react-hot-toast';

// Pages
import LandingPage from './pages/LandingPage';
import BusinessDashboardPage from './pages/BusinessDashboardPage';
import CreatorDashboardPage from './pages/CreatorDashboardPage';
import CampaignListPage from './pages/CampaignListPage';
import CreateCampaignPage from './pages/CreateCampaignPage';
import CampaignDetailsPage from './pages/CampaignDetailsPage';
import CreatorDiscoveryPage from './pages/CreatorDiscoveryPage';
import ApplicationsPage from './pages/ApplicationsPage';
import MessagesPage from './pages/MessagesPage';
import NotificationsPage from './pages/NotificationsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

function DashboardIndexRoute() {
  const { role } = useOutletContext<{ role?: string }>() || {};
  const currentRole = role || localStorage.getItem('promobridge_user_role');

  if (currentRole === 'CREATOR') {
    return <CreatorDashboardPage />;
  }
  return <BusinessDashboardPage />;
}

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'bg-card text-foreground border border-border shadow-lg',
          duration: 4000,
          style: {
            background: 'hsl(var(--card))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Routes */}
        <Route path="/sign-in/*" element={
          <div className="min-h-screen flex items-center justify-center mesh-bg">
            <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" forceRedirectUrl="/dashboard" />
          </div>
        } />
        <Route path="/sign-up/*" element={
          <div className="min-h-screen flex items-center justify-center mesh-bg">
            <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" forceRedirectUrl="/dashboard" />
          </div>
        } />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={
          <SignedIn>
            <DashboardLayout />
          </SignedIn>
        }>
          <Route index element={<DashboardIndexRoute />} />
          <Route path="campaigns" element={<CampaignListPage />} />
          <Route path="campaigns/new" element={<CreateCampaignPage />} />
          <Route path="campaigns/:id" element={<CampaignDetailsPage />} />
          <Route path="creators" element={<CreatorDiscoveryPage />} />
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="bookmarks" element={<div className="text-2xl font-bold">Bookmarks</div>} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback: Redirect signed-out users to sign-in */}
        <Route path="/dashboard/*" element={
          <SignedOut>
            <Navigate to="/sign-in" replace />
          </SignedOut>
        } />

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
