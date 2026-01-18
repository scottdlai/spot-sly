import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useWpm } from '@/hooks/useWpm';
import { Minus, Plus } from 'lucide-react';
import type { ReactNode } from 'react';

interface WpmPopoverProps {
  trigger: ReactNode;
  step?: number;
}

export function WpmPopover({ trigger, step = 60 }: WpmPopoverProps) {
  const { wpm, setWpm } = useWpm();

  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>

      <PopoverContent
        side="top"
        sideOffset={8}
        className="bg-surface-med border-none rounded-lg w-fit shadow-2xl"
      >
        <div className="space-y-4">
          <p className="text-on-subtle text-sm font-medium px-1">Change reading speed</p>

          <div className="h-6 flex items-center justify-center gap-2">
            {/* Decrease Button */}
            <button
              type="button"
              onClick={() => setWpm(wpm => wpm - step)}
              className="flex items-center gap-1 text-on transition-colors bg-surface-hi/50 hover:bg-surface-hi rounded-lg !px-3"
            >
              <Minus className="w-4 h-4" />
              <span className="text-sm font-medium">{step}</span>
            </button>

            {/* Center Display */}
            <div className="flex-1 bg-surface-hi rounded-lg p-2 flex items-center justify-center gap-1">
              <span className="text-on-subtle text-sm font-bold uppercase tracking-wider">WPM</span>
              <span className="text-on text-sm font-semibold">{wpm}</span>
            </div>

            {/* Increase Button */}
            <button
              type="button"
              onClick={() => setWpm(wpm => wpm + step)}
              className="flex items-center gap-1 text-on transition-colors bg-surface-hi/50 hover:bg-surface-hi rounded-lg !px-3"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">{step}</span>
            </button>
          </div>
        </div>

        {/* Custom Arrow/Caret */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-surface-med rotate-45" />
      </PopoverContent>
    </Popover>
  );
}
