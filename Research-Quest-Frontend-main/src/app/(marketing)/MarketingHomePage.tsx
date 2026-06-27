import React from 'react';
import Link from 'next/link';

export default function MarketingHomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to ResearchQuest</h1>
        <p className="text-lg mb-8">Your AI-powered research assistant.</p>
        
        <div className="flex justify-center gap-4">
          {/* Top of funnel acquisition: Drive traffic to the free tool */}
          <Link 
            href="/paper-search" 
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Start Free Search
          </Link>

          {/* Returning users go to login; your middleware will protect the dashboard */}
          <Link 
            href="/login" 
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}