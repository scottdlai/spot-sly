import { useWpm } from '@/hooks/useWpm';
import { WpmPopover } from './wpm-popover';

interface ReadingControlsProps {
  hasTextSelected: boolean;
  onStartReading?: () => void;
  noTextHint?: string;
}

export function ReadingControls({
  hasTextSelected,
  onStartReading,
  noTextHint = 'Highlight a section to start reading!'
}: ReadingControlsProps) {
  const { wpm, setWpm } = useWpm();

  return (
    <div className="w-full flex flex-col gap-2 fixed bottom-6 items-center">
      <div className="buttons flex flex-row gap-3">
        <WpmPopover
          wpm={wpm}
          setWpm={setWpm}
          trigger={
            <button
              type="button"
              className="bg-surface-med flex gap-2.5 rounded-lg px-4 py-2 cursor-pointer"
            >
              <span className="text-primary">{wpm} WPM</span>
              <span className="text-on">Change</span>
            </button>
          }
        />

        <button
          id="start-reading"
          className={`flex gap-2.5 rounded-lg ${hasTextSelected ? 'bg-primary text-on-primary' : 'bg-surface-med text-on-disabled opacity-40'}`}
          onClick={onStartReading}
          disabled={!hasTextSelected}
        >
          Start reading
        </button>
      </div>
      <span id="start-reading-hint" className="subhead select-none text-on-subtle">
        {hasTextSelected ? 'Ready to read!' : noTextHint}
      </span>
    </div>
  );
}
