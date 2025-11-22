'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Code } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProjectList() {
  const [projects, setProjects] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/projects').then(res => res.json()).then(setProjects);
  }, []);

  const createProject = async () => {
    const res = await fetch('/api/projects', { method: 'POST' });
    const project = await res.json();
    router.push(`/editor/${project._id}`);
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">All Projects</h2>
        <button onClick={createProject} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700">
          <Plus size={18} /> New Project
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map(p => (
          <Link key={p._id} href={`/editor/${p._id}`} className="block bg-white p-6 rounded shadow hover:shadow-md transition border">
             <div className="flex items-center gap-3 mb-4">
               <div className="bg-yellow-100 p-2 rounded text-yellow-600"><Code size={24} /></div>
               <h3 className="font-bold text-lg">{p.title}</h3>
             </div>
             <p className="text-gray-500 text-sm">Last edited: {new Date(p.updatedAt).toLocaleDateString()}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}