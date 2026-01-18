import { useState, useEffect } from 'react';
import { TreeView, type TreeDataItem } from '@/components/tree-view';
// import responseData from '@/assets/response.json';
import type { FileUploadResult } from '@/FileUpload';
import { ReadingControls } from '@/components/reading-controls';
import SpeedReaderComponent from '@/reader';
import { ArrowLeftIcon } from 'lucide-react';

type Section = {
  title: string;
  text: string;
  // some epub don't have heading levels
  level?: 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6';
};

export interface UploadedFileProps {
  result: FileUploadResult;
  onBack: () => void;
}

export default function UploadedFile({
  result: responseData,
  onBack: cancelCurrentBook
}: UploadedFileProps) {
  console.log('UploadedFile rendered with:', responseData);

  // State to track the selected section
  const [selectedSection, setSelectedSection] = useState<Section | null>(
    responseData.sections[0] || null
  );

  const [wpm, setWpm] = useState<number>(600 / 60);

  const [startReading, setStartReading] = useState<boolean>(false);

  // State to track if scrolled to bottom
  const [isAtBottom, setIsAtBottom] = useState(false);

  // State to track if text is selected
  const hasTextSelected = selectedSection !== null;

  // Check scroll position
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollBottom = scrollTop + windowHeight;

      // Check if scrolled to bottom (with a small threshold for edge cases)
      const threshold = 10; // pixels from bottom
      const atBottom = scrollBottom >= documentHeight - threshold;
      setIsAtBottom(atBottom);
    };

    // Check initial scroll position
    handleScroll();

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [selectedSection]); // Re-check when section changes (content height may change)

  // Transform sections from JSON into TreeDataItem format
  const treeData: TreeDataItem[] = responseData.sections.map((section, index) => ({
    id: `section-${index}`,
    name: section.title,
    onClick: () => {
      setSelectedSection(section);
    }
  }));

  // Split text into paragraphs (split by periods followed by space, then group into reasonable chunks)
  const splitTextIntoParagraphs = (text: string): string[] => {
    // Split by periods followed by spaces, then group every ~3-4 sentences into a paragraph
    const sentences = text.split(/(?<=\.)\s+/).filter(s => s.trim().length > 0);
    const paragraphs: string[] = [];
    const sentencesPerParagraph = 3;

    for (let i = 0; i < sentences.length; i += sentencesPerParagraph) {
      paragraphs.push(sentences.slice(i, i + sentencesPerParagraph).join(' '));
    }

    return paragraphs.length > 0 ? paragraphs : [text];
  };

  // Validate that result has sections
  if (!responseData || !responseData.sections || responseData.sections.length === 0) {
    console.error('Invalid result data:', responseData);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-on">No sections available to display.</div>
      </div>
    );
  }

  if (startReading && hasTextSelected) {
    return <SpeedReaderComponent text={selectedSection.text} wps={wpm} />;
  }

  return (
    <div className="grid grid-cols-4 w-full max-w-full overflow-x-hidden gap-8 lg:gap-32 p-4 lg:p-12">
      <div className="flex flex-col col-span-1 gap-1 select-none">
        {/* Return */}
        <button
          className="ml-2 w-[32px] h-[32px] icon-button rounded-lg bg-transparent hover:bg-surface-med/75 transition-colors duration-200 ease-in-out"
          onClick={cancelCurrentBook}
        >
          <ArrowLeftIcon className="w-4 h-4 mx-auto my-auto text-on-subtle" />
        </button>

        {/* Tree Structure */}
        <div id="tree-structure">
          <TreeView
            data={treeData}
            initialSelectedItemId="section-0"
            onSelectChange={item => {
              // Sync TreeView selection with component state
              if (item) {
                const sectionIndex = parseInt(item.id.replace('section-', ''));
                setSelectedSection(responseData.sections[sectionIndex]);
              }
            }}
          />
        </div>
      </div>

      <main className="col-span-3 w-full flex flex-col items-center gap-10 *:w-full *:max-w-xl pb-16">
        {/* OVERLAY - Only show when not at bottom */}
        {!isAtBottom && (
          <div
            id="gradient-overlay"
            className="select-none gradient-overlay w-full max-w-full absolute h-1/4 bottom-0 fixed"
          ></div>
        )}

        {selectedSection && (
          <>
            <div className="flex flex-col gap-1 mt-3.5 select-none">
              <span className="text-primary-subtle">{selectedSection.level}</span>
              <h2 className="title-1 text-on">{selectedSection.title.replace(/\n/g, ' ')}</h2>
            </div>

            <div
              id="selected-section"
              className="*:block *:font-serif *:paragraph-text *:text-on [&>*:not(:last-child)]:mb-6 pb-1"
            >
              {splitTextIntoParagraphs(selectedSection.text).map((paragraph, index) => (
                <span key={index}>{paragraph}</span>
              ))}
            </div>
          </>
        )}

        <ReadingControls
          hasTextSelected={hasTextSelected}
          wpm={wpm}
          onStartReading={() => {
            setStartReading(true);
          }}
        />
      </main>
    </div>
  );
}
