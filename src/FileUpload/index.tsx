import { Card } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import { useRef, useState } from 'react';

export interface FileUploadResult {
  sections: {
    title: string;
    text: string;
    // some epub don't have heading levels
    level?: 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6';
  }[];
  name: string;
}

export interface FileUploadProps {
  readonly onResult?: (result: FileUploadResult) => void;
  readonly onError?: (err: Error) => void;
  readonly setIsUploading: (isUploading: boolean) => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function FileUpload({
  onResult: handleResult,
  onError: handleError,
  setIsUploading
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [result, setResult] = useState<FileUploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const file = e.target.files![0];

    if (!file) {
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        throw new Error(`Upload failed: ${res.status}`);
      }

      const data = await res.json();
      setResult(data);

      if (handleResult) {
        handleResult(data);
      }
    } catch (err: unknown) {
      setError((err as Error).message);
      if (handleError) {
        handleError(err as Error);
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Card
        onClick={() => {
          fileInputRef.current?.click();
        }}
        className={`
              mt-2 border-none bg-[#332a26] min-h-[250px] flex flex-col items-center justify-center cursor-pointer
              transition-colors duration-200 ease-in-out hover:bg-[#3d332e]
            `}
      >
        <input ref={fileInputRef} type="file" accept=".epub" onChange={handleFileChange} />

        <div className="flex flex-col items-center gap-4 text-center p-8">
          <Upload className="w-6 h-6 text-[#d9c5b2]" />
          <div className="space-y-2">
            <p className="text-[#d9c5b2] text-lg">Upload file to read</p>
            <p className="text-[#8c7a70] text-sm">
              Drag or select to upload a .PDF or .EPUB file <br />
              smaller than 50 MB
            </p>
          </div>
        </div>
      </Card>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <pre
          style={{
            marginTop: 16,
            padding: 12,
            maxHeight: 300,
            overflow: 'auto'
          }}
        >
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </>
  );
}
