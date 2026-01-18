import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Minus, Plus, AArrowDown, AArrowUp } from 'lucide-react';
import type { ReactNode } from 'react';

interface TextSizePopoverProps {
    textSize: number;
    onTextSizeChange: (textSizeChange: (size: number) => number) => void;
    trigger: ReactNode;
    step?: number;
}

export function TextSizePopover({ textSize, onTextSizeChange, trigger, step = 0.5 }: TextSizePopoverProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                {trigger}
            </PopoverTrigger>

            <PopoverContent
                side="bottom"
                sideOffset={8}
                className="bg-surface-med border-none rounded-lg w-fit shadow-2xl"
            >
                <div className="space-y-4">
                    <p className="text-on-subtle text-sm font-medium px-1">Change text size</p>

                    <div className="h-6 flex items-center justify-center gap-2">
                        {/* Decrease Button */}
                        <button
                            type="button"
                            onClick={() => onTextSizeChange(size => Math.max(2, size - step))}
                            className="flex items-center gap-1 text-on hover:text-white transition-colors bg-surface-hi/50 hover:bg-surface-hi rounded-lg !px-3"
                        >
                            <AArrowDown className="w-5 h-5" />
                            {/* <span className="text-sm font-medium">{step}</span> */}
                        </button>

                        {/* Center Display */}
                        <div className="flex-1 bg-surface-hi rounded-lg p-2 flex items-center justify-center gap-2">
                            <span className="text-on-subtle text-sm font-bold uppercase tracking-wider">
                                Size
                            </span>
                            <span className="text-on text-sm font-semibold">{textSize.toFixed(1)}rem</span>
                        </div>

                        {/* Increase Button */}
                        <button
                            type="button"
                            onClick={() => onTextSizeChange(size => Math.min(10, size + step))}
                            className="flex items-center gap-1 text-on hover:text-white transition-colors bg-surface-hi/50 hover:bg-surface-hi rounded-lg !px-3"
                        >
                            <AArrowUp className="w-5 h-5" />
                            {/* <span className="text-sm font-medium">{step}</span> */}
                        </button>
                    </div>
                </div>

                {/* Custom Arrow/Caret */}
                {/* <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-surface-med rotate-45" /> */}
            </PopoverContent>
        </Popover>
    );
}
