import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { TransactionFormModal } from '../../pages/transactions/TransactionFormModal';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTransactionSaved = () => {
    setIsTransactionModalOpen(false);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Navbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenNewTransaction={() => setIsTransactionModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Outlet receives refreshKey context if pages wish to re-fetch */}
          <Outlet context={{ refreshKey, triggerRefresh: () => setRefreshKey((k) => k + 1) }} />
        </main>
      </div>

      <TransactionFormModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onSaved={handleTransactionSaved}
      />
    </div>
  );
};
