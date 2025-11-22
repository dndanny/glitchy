import { auth } from "@/auth";
import connectDB from "@/lib/db";
import { Project, User } from "@/lib/models";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  // Ensure the User model is registered before populating
  if(!User) await connectDB(); 

  const project = await Project.findOne({ _id: params.id, ownerId: session.user.id })
    .populate('ownerId', 'name email'); // Populate owner name for the public link
  
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { files, title } = await req.json();
  await connectDB();

  const project = await Project.findOneAndUpdate(
    { _id: params.id, ownerId: session.user.id },
    { files, title },
    { new: true }
  );

  return NextResponse.json(project);
}