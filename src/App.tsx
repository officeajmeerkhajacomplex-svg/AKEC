import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import MobileLayout from "./components/layout/MobileLayout";
import Home from "./pages/Home";
import StudentLedger from "./pages/StudentLedger";
import SettingsPage from "./pages/Settings";
import PrivacySecurity from "./pages/PrivacySecurity";
import Login from "./pages/Login";
import SplashScreen from "./components/layout/SplashScreen";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-snow dark:bg-[#121212]">
        <div className="w-12 h-12 border-4 border-dodger border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <AnimatePresence mode="wait">
              {showSplash ? (
                <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
              ) : null}
            </AnimatePresence>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoute><MobileLayout /></ProtectedRoute>}>
                <Route path="/" element={<Home />} />
                <Route path="/student/:id" element={<StudentLedger />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/privacy-security" element={<PrivacySecurity />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
