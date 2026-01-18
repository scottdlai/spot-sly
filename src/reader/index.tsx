import { useEffect, useState } from 'react';
import './index.css';
import { Slider } from '@/components/ui/slider';
import PlayIcon from '@/assets/icons/play';
import NextWordIcon from '@/assets/icons/next-word';
import NextSentenceIcon from '@/assets/icons/next-sentence';
import LastSentenceIcon from '@/assets/icons/last-sentence';
import LastWordIcon from '@/assets/icons/last-word';
import Quiz from '@/components/quiz';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Minus, Plus } from 'lucide-react';

interface TokenProps {
  token: string;
  highlightIndex: number;
}

function getHighlightIndex(token: string): number {
  let mid = Math.floor(token.length / 2);
  mid = token.length % 2 !== 0 ? mid : mid - 1;
  return Math.min(2, mid);
}

export interface SpeedReaderComponentProps {
  text: string;
  wps: number;
  onWpsChange: (wpsChange: (delta: number) => number) => void;
}

function SpeedReaderComponent({ text, wps, onWpsChange }: SpeedReaderComponentProps) {
  const tokens = text.split(' ');

  const [currIndex, setCurrIndex] = useState<number>(1);

  useEffect(() => {
    if (wps === 0) {
      return;
    }

    // Add a bit of delay at the last word before showing quiz
    const timeout = currIndex + 1 < tokens.length ? 1000 / wps : 500;

    const timer = setTimeout(() => {
      if (currIndex >= tokens.length) {
        return;
      }

      setCurrIndex(prevIndex => prevIndex + 1);
    }, timeout);

    return () => {
      clearInterval(timer);
    };
  }, [setCurrIndex, currIndex, wps, tokens.length]);

  const endOfText = currIndex >= tokens.length;

  if (endOfText) {
    return <Quiz />;
  }

  const wpm = wps * 60;

  return (
    <div className="reader">
      <div className="reader__token">
        <TokenComponent
          token={tokens[currIndex]}
          highlightIndex={getHighlightIndex(tokens[currIndex])}
        ></TokenComponent>
      </div>

      <div className="bg-primary rounded-xlg flex flex-col gap-2 p-1 min-w-90 bg-surface-low rounded-xl px-3 pt-1 pb-2 absolute bottom-8">
        <div className="control__top">
          <div className="controls__btns flex justify-between">
            <div className="w-[32px] h-[32px] aspect-square"></div>
            <div className="flex flex-row gap-0.5 w-full justify-center">
              <button>
                <LastSentenceIcon className="text-on-subtle"></LastSentenceIcon>
              </button>
              <button>
                <LastWordIcon className="text-on-subtle"></LastWordIcon>
              </button>
              <button>
                <PlayIcon className="text-on-subtle pl-0.5 scale-125" />
              </button>
              <button>
                <NextWordIcon className="text-on-subtle"></NextWordIcon>
              </button>
              <button>
                <NextSentenceIcon className="text-on-subtle"></NextSentenceIcon>
              </button>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <button className="w-[32px] h-[32px] aspect-square">
                  <span className="text-xs text-on-subtle">{wpm}</span>
                </button>
              </PopoverTrigger>

              {/* The "Toast" Content positioned above */}
              <PopoverContent
                side="top"
                sideOffset={12}
                className="bg-[#4a3f3b] border-none rounded-2xl px-1 w-48 shadow-2xl"
              >
                <div className="space-y-4">
                  <p className="text-[#d9c5b2]/70 text-sm font-medium px-1">Change reading speed</p>

                  <div className="h-6 flex items-center justify-center gap-0">
                    {/* Decrease Button */}
                    <button
                      onClick={() => onWpsChange(wps => wps - 1)}
                      className="flex items-center gap-1 text-[#d9c5b2] hover:text-white transition-colors"
                    >
                      <Minus className="w-2 h-2" />
                      <span className="text-sm font-medium">60</span>
                    </button>

                    {/* Center Display */}
                    <div className="flex-1 bg-[#63554f] rounded-lg p-2 flex items-center justify-center gap-1">
                      <span className="text-[#d9c5b2]/50 text-sm font-bold uppercase tracking-wider">
                        WPM
                      </span>
                      <span className="text-white text-sm font-semibold">{wpm}</span>
                    </div>

                    {/* Increase Button */}
                    <button
                      onClick={() => onWpsChange(wps => wps + 1)}
                      className="flex items-center gap-1 text-[#d9c5b2] hover:text-white transition-colors"
                    >
                      <Plus className="w-2 h-2" />
                      <span className="text-sm font-medium">60</span>
                    </button>
                  </div>
                </div>

                {/* Custom Arrow/Caret */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#4a3f3b] rotate-45" />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <Slider
          className="control__progress opacity-100"
          value={[currIndex]}
          max={tokens.length - 1}
          onValueChange={([value]) => {
            setCurrIndex(value);
          }}
        ></Slider>
      </div>
    </div>
  );
}

function TokenComponent({ token, highlightIndex }: TokenProps) {
  const before = token.slice(0, highlightIndex);
  const highlight = token[highlightIndex];
  const after = token.slice(highlightIndex + 1);

  return (
    <>
      <span className="reader__char reader__char--before">{before}</span>
      <span className="reader__token--hl">{highlight}</span>
      <span className="reader__char reader__char--after">{after}</span>
    </>
  );
}

export default SpeedReaderComponent;
