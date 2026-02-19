import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { 
  ClerkProvider, 
  SignedIn, 
  SignedOut, 
  RedirectToSignIn, 
  SignIn, 
  SignUp 
} from '@clerk/clerk-react';

// Components
import Sidebar from './Components/Sidebar';
import ArGenerator from './Components/ArGenerator';
import Generator3D from './Components/Generator3D';
import QrGenerator from './Components/QrGenerator';
import ARView from './Components/ARView'; 
import LandingPage from './Components/LandingPage';
import MatrixCalculator from './Components/MatrixCalculator';

// Clerk Key
const PUBLISHABLE_KEY = "pk_test_c3RpcnJpbmctc2NvcnBpb24tNDguY2xlcmsuYWNjb3VudHMuZGV2JA";

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

// --- DASHBOARD COMPONENT ---
// Ye component tab dikhega jab user login hoga
function Dashboard() {
  const [activeTab, setActiveTab] = useState('ar'); 

  return (
    <div className="flex min-h-screen bg-[#020806]">
      {/* Sidebar with Tab state and Logout Logic inside */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto custom-scrollbar bg-[#010604]">
        <div className="max-w-[1600px] mx-auto">
          {activeTab === 'generator' && <Generator3D />}
          {activeTab === 'qr' && <QrGenerator />}
          {activeTab === 'ar' && <ArGenerator />}
          {activeTab === 'calculator' && <MatrixCalculator />}
        </div>
      </main>
    </div>
  );
}

// --- MAIN APP COMPONENT ---
function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Router>
        <Routes>
          {/* Public Route: Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={
            <div className="min-h-screen bg-[#010604] flex items-center justify-center p-4">
              <SignIn 
                routing="path" 
                path="/login" 
                signUpUrl="/signup" 
                fallbackRedirectUrl="/dashboard" 
              />
            </div>
          } />

          <Route path="/signup" element={
            <div className="min-h-screen bg-[#010604] flex items-center justify-center p-4">
              <SignUp 
                routing="path" 
                path="/signup" 
                signInUrl="/login" 
              />
            </div>
          } />
          
          {/* Protected Dashboard: Only for SignedIn Users */}
          <Route path="/dashboard" element={
            <>
              <SignedIn>
                <Dashboard />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          } />
          
          {/* Customer View Route (No Auth Needed for Public AR) */}
          <Route path="/view" element={<ARView />} />

          {/* Fallback: Redirect anything unknown to Home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ClerkProvider>
  );
}

export default App;