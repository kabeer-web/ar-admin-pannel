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
import MatrixCalculator from './Components/MatrixCalculator';
import AiExcelManager from './Components/AiExcelManager'; // Naya Component Import

const PUBLISHABLE_KEY = "pk_test_c3RpcnJpbmctc2NvcnBpb24tNDguY2xlcmsuYWNjb3VudHMuZGV2JA";

function Dashboard() {
  // Default tab 'excel' kar di taake seedha wahi khule
  const [activeTab, setActiveTab] = useState('excel'); 

  return (
    <div className="flex min-h-screen bg-[#020806]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 h-screen overflow-y-auto bg-[#010604]">
        <div className="max-w-[1600px] mx-auto">
          {activeTab === 'generator' && <Generator3D />}
          {activeTab === 'qr' && <QrGenerator />}
          {activeTab === 'ar' && <ArGenerator />}
          {activeTab === 'calculator' && <MatrixCalculator />}
          {activeTab === 'excel' && <AiExcelManager />} {/* Naya Tab logic */}
        </div>
      </main>
    </div>
  );
}

// App component ka baaki logic same rahega
function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<div className="min-h-screen bg-[#010604] flex items-center justify-center p-4"><SignIn routing="path" path="/login" signUpUrl="/signup" fallbackRedirectUrl="/dashboard" /></div>} />
          <Route path="/signup" element={<div className="min-h-screen bg-[#010604] flex items-center justify-center p-4"><SignUp routing="path" path="/signup" signInUrl="/login" /></div>} />
          
          <Route path="/dashboard" element={
            <>
              <SignedIn><Dashboard /></SignedIn>
              <SignedOut><RedirectToSignIn /></SignedOut>
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