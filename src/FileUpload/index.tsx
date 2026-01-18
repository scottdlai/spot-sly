import { Card } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { initEpubFile } from '@lingo-reader/epub-parser';
import type { Section } from '@/pages/UploadedFile';

export interface FileUploadResult {
  sections: Section[];
  name: string;
}

export interface FileUploadProps {
  readonly onResult?: (result: FileUploadResult) => void;
  readonly onError?: (err: Error) => void;
  readonly setIsUploading: (isUploading: boolean) => void;
}

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

    try {
      setIsUploading(true);
      setError(null);
      const parser = new DOMParser();
      const book = await initEpubFile(file);
      const spine = book.getSpine();
      // console.log(book);
      // console.log(spine);
      const promises = [];
      for (const section of spine) {
        promises.push(book.loadChapter(section.id));
      }
      const chapters = await Promise.all(promises);
      const sections: Section[] = [];
      for (const { html } of chapters) {
        const doc = parser.parseFromString(html, 'text/html');
        // Remove all anchors first
        const anchorTags = doc.querySelectorAll('a');
        anchorTags.forEach(anchor => {
          const textNode = doc.createTextNode(anchor.textContent || '');
          anchor.parentNode?.replaceChild(textNode, anchor);
        });
        const topLevel = doc.querySelectorAll('h1');

        // If no h1s then skip
        if (!topLevel.length) {
          continue;
        }
        topLevel.forEach(top => console.log(top.textContent));

        // const section = {};
        // // Parse a section
        // for (const top of topLevel) {
        //   section.title = top.textContent;
        // }
        // // Recursively parse the document to extract sections
        // result.push({});
      }

      // const sections = (await Promise.all(promises)).map(({ html }) => {
      //   const doc = parser.parseFromString(html, 'text/html');
      //   let topLevel = doc.querySelectorAll('h1');
      //
      //   // If no h1s then check the h2s
      //   if (!topLevel.length) {
      //     topLevel = doc.querySelectorAll('h2');
      //   }
      //   // h1Elements.forEach(h1 => console.log(h1.textContent?.replace(/\r\n|\n|\r/gm, ' ')));
      //   return doc;
      // });
      // console.log(sections);
      // return;
      // handleResult(sections);
      // setResult(sections);
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
             border-none bg-surface-low hover:bg-surface-med/75 w-full min-w-[400px] min-h-[200px] flex flex-col items-center justify-center cursor-pointer rounded-md
              transition-colors duration-200 ease-in-out
            `}
      >
        <input
          id="files"
          ref={fileInputRef}
          type="file"
          accept=".epub"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-4 text-center w-full p-8">
          <div className="flex flex-row gap-2 items-center justify-center">
            <Upload className="w-6 h-6 text-on-subtle" />
            <p className="text-on text-lg">Upload file</p>
          </div>

          <p className="text-on-subtle text-sm">
            Drag or select to upload a .PDF or .EPUB file <br />
            smaller than 50 MB
          </p>
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
