'use client';
import { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { Save, File, Trash2, Plus, Globe } from 'lucide-react';
import Link from 'next/link';

export default function EditorPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<any>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [srcDoc, setSrcDoc] = useState('');

  useEffect(() => {
    fetch(`/api/projects/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setProject(data);
        setFiles(data.files);
        if (data.files.length > 0) setActiveFileId(data.files[0]._id);
        updatePreview(data.files);
      });
  }, [params.id]);

  useEffect(() => {
    if (!project) return;
    const timer = setTimeout(async () => {
        setSaving(true);
        await fetch(`/api/projects/${params.id}`, {
            method: 'PUT',
            body: JSON.stringify({ files, title: project.title })
        });
        setSaving(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [files, project, params.id]);

  const updatePreview = (currentFiles: any[]) => {
    const html = currentFiles.find((f: any) => f.name === 'index.html')?.content || '';
    const css = currentFiles.find((f: any) => f.name === 'styles.css')?.content || '';
    const js = currentFiles.find((f: any) => f.name === 'script.js')?.content || '';
    
    const doc = `
      <html>
        <head>
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
    setSrcDoc(doc);
  };

  const handleEditorChange = (value: string | undefined) => {
    const newFiles = files.map(f => 
      f._id === activeFileId ? { ...f, content: value } : f
    );
    setFiles(newFiles);
    updatePreview(newFiles);
  };

  const activeFile = files.find(f => f._id === activeFileId);

  const addNewFile = () => {
    const name = prompt("File name (e.g., about.html):");
    if (!name) return;
    const ext = name.split('.').pop();
    let lang = 'plaintext';
    if (ext === 'html') lang = 'html';
    if (ext === 'css') lang = 'css';
    if (ext === 'js') lang = 'javascript';

    const newFile = { _id: Date.now().toString(), name, language: lang, content: '' };
    setFiles([...files, newFile]);
    setActiveFileId(newFile._id);
  };

  const deleteFile = (id: string) => {
    if(!confirm("Delete file?")) return;
    const newFiles = files.filter(f => f._id !== id);
    setFiles(newFiles);
    if (activeFileId === id && newFiles.length > 0) setActiveFileId(newFiles[0]._id);
  };

  if (!project) return <div className="p-10 text-center">Loading Editor...</div>;
  
  const publicUrl = `/site/${encodeURIComponent(project.ownerId?.name || '')}/${encodeURIComponent(project.title)}`;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="h-14 bg-gray-900 text-white flex items-center px-4 justify-between border-b border-gray-700">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="font-bold text-xl">GlitchClone</Link>
          <span className="text-gray-400">/</span>
          <input 
            value={project.title} 
            onChange={(e) => setProject({...project, title: e.target.value})}
            className="bg-transparent border-none text-white font-medium focus:ring-0 w-64"
          />
        </div>
        <div className="flex items-center gap-4 text-sm">
           {saving ? <span className="text-yellow-400 flex items-center gap-1"><Save size={14} className="animate-pulse"/> Saving...</span> : <span className="text-green-400">Saved</span>}
           
           <a 
             href={publicUrl} 
             target="_blank" 
             className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded text-xs uppercase font-bold tracking-wide transition"
           >
             <Globe size={14} /> Open Live
           </a>
           
           <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center font-bold">
             {(project.ownerId?.name || 'U').slice(0,2)}
           </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 bg-gray-800 text-gray-300 flex flex-col border-r border-gray-700">
           <div className="p-3 flex justify-between items-center border-b border-gray-700">
             <span className="text-xs font-bold uppercase tracking-wider">Files</span>
             <button onClick={addNewFile} className="p-1 hover:bg-gray-700 rounded"><Plus size={16}/></button>
           </div>
           <div className="flex-1 overflow-y-auto">
             {files.map(file => (
               <div 
                 key={file._id}
                 onClick={() => setActiveFileId(file._id)}
                 className={`group flex items-center justify-between px-4 py-2 cursor-pointer text-sm ${activeFileId === file._id ? 'bg-gray-700 text-white' : 'hover:bg-gray-750'}`}
               >
                 <div className="flex items-center gap-2">
                   <File size={14} />
                   <span>{file.name}</span>
                 </div>
                 <button 
                   onClick={(e) => { e.stopPropagation(); deleteFile(file._id); }}
                   className="opacity-0 group-hover:opacity-100 hover:text-red-400"
                 >
                   <Trash2 size={14} />
                 </button>
               </div>
             ))}
           </div>
        </div>

        <div className="flex-1 flex flex-col bg-gray-900">
          {activeFile ? (
            <Editor
              height="100%"
              theme="vs-dark"
              path={activeFile.name}
              defaultLanguage={activeFile.language}
              language={activeFile.language}
              value={activeFile.content}
              onChange={handleEditorChange}
              options={{ minimap: { enabled: false }, fontSize: 14 }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500">Select a file</div>
          )}
        </div>

        <div className="w-1/2 bg-white border-l border-gray-700 flex flex-col">
           <div className="h-10 bg-gray-100 border-b flex items-center px-4 text-xs text-gray-500 font-bold uppercase tracking-wider">
             Live Preview
           </div>
           <iframe 
             srcDoc={srcDoc}
             title="preview"
             className="flex-1 w-full h-full border-none"
             sandbox="allow-scripts"
           />
        </div>
      </div>
    </div>
  );
}