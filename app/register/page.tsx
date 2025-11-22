'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: e.target.name.value,
        email: e.target.email.value,
        password: e.target.password.value
      })
    });

    if (res.ok) {
      router.push('/login');
    } else {
      const data = await res.json();
      setError(data.error || "Registration failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6">Register</h2>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        <input name="name" type="text" placeholder="Name (used for public URL)" required className="w-full border p-2 mb-4 rounded"/>
        <input name="email" type="email" placeholder="Email" required className="w-full border p-2 mb-4 rounded"/>
        <input name="password" type="password" placeholder="Password" required className="w-full border p-2 mb-6 rounded"/>
        <button disabled={loading} className="w-full bg-green-600 text-white p-2 rounded disabled:bg-green-300">
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
        <p className="mt-4 text-sm">Already have an account? <Link href="/login" className="text-blue-500">Login</Link></p>
      </form>
    </div>
  );
}