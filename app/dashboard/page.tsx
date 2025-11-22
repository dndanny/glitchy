import { auth, signOut } from "@/auth";
import ProjectList from "./ProjectList";
import { LogOut } from "lucide-react";

export default async function Dashboard() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">My Projects</h1>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
             <div className="text-sm font-bold">{session?.user?.name}</div>
             <div className="text-xs text-gray-500">{session?.user?.email}</div>
          </div>
          <form action={async () => { 'use server'; await signOut(); }}>
             <button className="flex items-center gap-2 text-red-500 text-sm hover:bg-red-50 p-2 rounded"><LogOut size={16}/> Logout</button>
          </form>
        </div>
      </nav>
      <div className="p-8 max-w-5xl mx-auto">
        <ProjectList />
      </div>
    </div>
  );
}