/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './lib/AppContext';
import { AppShell } from './components/layout/AppShell';
import { Toaster } from './components/ui/sonner';

// Pages - to be implemented
import { Dashboard } from './pages/Dashboard';
import { Ledger } from './pages/Ledger';
import { Notices } from './pages/Notices';
import { Settings } from './pages/Settings';
import { Auth } from './pages/Auth';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<AppShell />}>
            <Route index element={<Dashboard />} />
            <Route path="ledger" element={<Ledger />} />
            <Route path="notices" element={<Notices />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
        <Toaster position="top-center" expand={false} richColors />
      </BrowserRouter>
    </AppProvider>
  );
}
