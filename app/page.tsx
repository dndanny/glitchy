import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-6xl font-bold mb-4">Glitch Clone</h1>
      <p className="text-xl mb-8">Build web apps instantly.</p>
      <div className="flex gap-4">
        <Link href="/login" className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg">Login</Link>
        <Link href="/register" className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg">Register</Link>
      </div>
    </main>
  );
}