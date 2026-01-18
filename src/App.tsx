import { useState } from 'react';
import './App.css';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Bunny from './components/bunny';
import { FileUpload, type FileUploadResult } from './FileUpload';
import UploadedFile from './pages/UploadedFile';

function App() {
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [result, setResult] = useState<FileUploadResult | null>(null);

  if (result !== null) {
    return <UploadedFile result={result} />;
  }

  return (
    <>
      <main className="flex flex-col items-center justify-center min-w-screen min-h-screen">
        <div className="h-[120px] flex gap-3 w-full items-center justify-center">
          <Bunny />
          <span className="font-serif text-2xl text-on font-medium leading-none">appName</span>
        </div>

        {/* SCOTT DO STUFF HERE */}
        <Tabs defaultValue="file" className="flex flex-col w-full items-center justify-center">
          <TabsList className="bg-surface-med w-full">
            <TabsTrigger value="file">File</TabsTrigger>
            <TabsTrigger value="text">Text</TabsTrigger>
          </TabsList>
          <TabsContent value="file" className="">
            <FileUpload
              setIsUploading={setIsUploading}
              onResult={result => {
                setResult(result);
              }}
            />
          </TabsContent>
          <TabsContent value="text" className="">
            Change your password here.
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}

export default App;
