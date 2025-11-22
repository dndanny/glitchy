import connectDB from "@/lib/db";
import { User, Project } from "@/lib/models";
import { notFound } from "next/navigation";

interface Props {
  params: { username: string; project: string };
}

export default async function PublicProjectPage({ params }: Props) {
  await connectDB();
  
  const decodedUsername = decodeURIComponent(params.username);
  const decodedTitle = decodeURIComponent(params.project);

  const user = await User.findOne({ name: decodedUsername });
  if (!user) return notFound();

  const project = await Project.findOne({ ownerId: user._id, title: decodedTitle });
  if (!project) return notFound();

  const html = project.files.find((f: any) => f.name === 'index.html')?.content || '';
  const css = project.files.find((f: any) => f.name === 'styles.css')?.content || '';
  const js = project.files.find((f: any) => f.name === 'script.js')?.content || '';
  
  const doc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${project.title}</title>
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>
          try {
            ${js}
          } catch(err) { console.error(err); }
        </script>
      </body>
    </html>
  `;

  return (
     <iframe 
       srcDoc={doc} 
       style={{ width: '100vw', height: '100vh', border: 'none', display: 'block' }}
       title={project.title}
     />
  );
}