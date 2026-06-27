import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <h1>404 - Page Not Found</h1>
        <p style={{ marginTop: 16 }}>The page you are looking for does not exist.</p>
        <Link href="/login" className="btn btn-primary" style={{ marginTop: 20, display: 'inline-block' }}>
          Go to Login
        </Link>
      </div>
    </div>
  );
}