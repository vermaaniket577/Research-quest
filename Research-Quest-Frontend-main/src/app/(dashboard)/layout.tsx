'use client';

import React from 'react';
import { useAuth } from '@/hooks/use-auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, isLoading } = useAuth();

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="nav-brand">ResearchQuest</div>
        <div className="nav-user">
          <span>{isLoading ? 'Loading...' : user?.fullName || 'User'}</span>
          {!isLoading && user && (
            <button onClick={logout} className="btn-logout">
              Logout
            </button>
          )}
        </div>
      </nav>
      <main className="dashboard-main">{children}</main>
    </div>
  );
}