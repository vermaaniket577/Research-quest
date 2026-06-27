
'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import Cookies from 'js-cookie';

function DashboardContent() {
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Handle Google OAuth token from URL redirect
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      Cookies.set('token', tokenFromUrl, { expires: 7, path: '/' });
      // Force refresh page to trigger AuthProvider session loading
      window.location.href = '/dashboard';
    }
  }, [searchParams]);

  if (isLoading) {
    return <p>Loading profile...</p>;
  }

  if (!user) {
    return <p>Redirecting...</p>;
  }

  return (
    <div className="dashboard-card">
      <div className="greeting-icon">🔬</div>
      <h1>Hi ResearchQuest</h1>
      <p className="greeting-subtitle">
        Welcome back, <strong>{user.fullName || 'Researcher'}</strong>!
      </p>
      <div className="user-info">
        <div className="info-item">
          <span className="info-label">Full Name</span>
          <span className="info-value">{user.fullName}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Email</span>
          <span className="info-value">{user.email}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Role</span>
          <span className="info-value" style={{ textTransform: 'capitalize' }}>
            {user.role}
          </span>
        </div>
        {user.institution && (
          <div className="info-item">
            <span className="info-label">Institution</span>
            <span className="info-value">{user.institution}</span>
          </div>
        )}
        {user.researchDomain && (
          <div className="info-item">
            <span className="info-label">Research Domain</span>
            <span className="info-value">{user.researchDomain}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <DashboardContent />
    </Suspense>
  );
}