import { useState } from 'react';
import './App.css';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Bunny from './components/bunny';
import { FileUpload, type FileUploadResult } from './FileUpload';
import UploadedFile from './pages/UploadedFile';
import { Textarea } from '@/components/ui/textarea';
import { ReadingControls } from '@/components/reading-controls';
import { useWpm } from '@/hooks/useWpm';

function App() {
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [result, setResult] = useState<FileUploadResult | null>(null);

  // State to track if textarea has text
  const [hasTextSelected, setHasTextSelected] = useState(false);
  const [textareaValue, setTextareaValue] = useState('');
  const { wpm, setWpm } = useWpm();

  if (result !== null) {
    console.log('Rendering UploadedFile with result:', result);
    return <UploadedFile result={result} onBack={() => setResult(null)} />;
  }

  if (isUploading) {
    return null;
  }

  return (
    <>
      <main className="flex flex-col items-center justify-center min-w-screen min-h-screen">
        <div className="h-[120px] flex gap-3 w-full items-center justify-center">
          <Bunny className='text-on-subtle' />
          <span className="font-serif text-2xl text-on font-medium leading-none">appName</span>
        </div>

        <Tabs
          defaultValue="file"
          className="flex flex-col w-full max-w-[400px] items-center justify-center"
        >
          <TabsList className="bg-surface-low w-full">
            <TabsTrigger value="file">File</TabsTrigger>
            <TabsTrigger value="text">Text</TabsTrigger>
          </TabsList>
          <TabsContent value="file" className="">
            {/* Enter file to read */}
            <FileUpload
              setIsUploading={setIsUploading}
              onResult={result => {
                setResult(result);
              }}
            />
          </TabsContent>

          <TabsContent value="text" className="">
            {/* Enter text to read */}
            <div className="w-full min-w-[400px] min-h-[200px]">
              <Textarea
                placeholder="Enter text to read"
                className="w-full min-w-[400px] h-[200px] max-h-[200px]"
                value={textareaValue}
                onChange={e => {
                  const value = e.target.value;
                  setTextareaValue(value);
                  setHasTextSelected(value.trim().length > 0);
                }}
              />
            </div>

            <div className="w-full absolute bottom-0 fixed left-0">
              <ReadingControls
                hasTextSelected={hasTextSelected}
                wpm={wpm}
                onWpmChange={setWpm}
                noTextHint="Enter text to start reading"
                onStartReading={() =>
                  setResult({
                    name: '',
                    sections: [{ text: textareaValue, title: 'TEXT' }]
                  })
                }
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}

export default App;
