import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn, SignIn, SignUp } from '@clerk/clerk-react';

// Components
import Sidebar from './Components/Sidebar';
import ArGenerator from './Components/ArGenerator';
import Generator3D from './Components/Generator3D';
import QrGenerator from './Components/QrGenerator';
import ARView from './Components/ARView'; 
import LandingPage from './Components/LandingPage';

const PUBLISHABLE_KEY = "pk_test_c3RpcnJpbmctc2NvcnBpb24tNDguY2xlcmsuYWNjb3VudHMuZGV2JA";

function Dashboard() {
  const [activeTab, setActiveTab] = useState('ar'); 

  return (
    <div className="flex min-h-screen bg-[#020806]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 h-screen overflow-y-auto custom-scrollbar">
        <div className="max-w-[1600px] mx-auto">
          {activeTab === 'generator' && <Generator3D />}
          {activeTab === 'qr' && <QrGenerator />}
          {activeTab === 'ar' && <ArGenerator />}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Router>
        <Routes>
          {/* Root: Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Login Page */}
          <Route path="/login" element={
            <div className="min-h-screen bg-[#010604] flex items-center justify-center">
              <SignIn routing="path" path="/login" signUpUrl="/signup" fallbackRedirectUrl="/dashboard" />
            </div>
          } />

          {/* Signup Page */}
          <Route path="/signup" element={
            <div className="min-h-screen bg-[#010604] flex items-center justify-center">
              <SignUp routing="path" path="/signup" signInUrl="/login" />
            </div>
          } />
          
          {/* Protected Dashboard Route */}
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
          
          <Route path="/view" element={<ARView />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ClerkProvider>
  );
}

export default App;