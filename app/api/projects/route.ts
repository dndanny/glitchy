import { auth } from "@/auth";
import connectDB from "@/lib/db";
import { Project } from "@/lib/models";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const projects = await Project.find({ ownerId: session.user.id }).sort({ updatedAt: -1 });
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  
  const defaultFiles = [
    { name: 'index.html', language: 'html', content: '<h1>Hello World</h1>' },
    { name: 'styles.css', language: 'css', content: 'body { color: blue; }' },
    { name: 'script.js', language: 'javascript', content: 'console.log("Loaded");' }
  ];

  const project = await Project.create({
    ownerId: session.user.id,
    title: "New Project",
    files: defaultFiles
  });

  return NextResponse.json(project);
}