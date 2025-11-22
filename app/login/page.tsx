'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await signIn('credentials', { 
        email: e.target.email.value, 
        password: e.target.password.value, 
        redirect: false 
      });

      if (res?.error) {
        setError("Invalid credentials.");
      } else {
        router.push('/dashboard');
      }
    } catch(err) {
      setError("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        <input name="email" type="email" placeholder="Email" required className="w-full border p-2 mb-4 rounded"/>
        <input name="password" type="password" placeholder="Password" required className="w-full border p-2 mb-6 rounded"/>
        <button disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded disabled:bg-blue-300">
          {loading ? 'Logging in...' : 'Log In'}
        </button>
        <p className="mt-4 text-sm">Don't have an account? <Link href="/register" className="text-blue-500">Register</Link></p>
      </form>
    </div>
  );
}