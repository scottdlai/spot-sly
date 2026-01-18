import { useEffect, useState } from 'react';
import './index.css';
import { Slider } from '@/components/ui/slider';
import PlayIcon from '@/assets/icons/play';
import NextWordIcon from '@/assets/icons/next-word';
import NextSentenceIcon from '@/assets/icons/next-sentence';
import LastSentenceIcon from '@/assets/icons/last-sentence';
import LastWordIcon from '@/assets/icons/last-word';
import Quiz from '@/components/quiz';
import { WpmPopover } from '@/components/wpm-popover';
import { TextSizePopover } from '@/components/text-size-popover';
import { ThemePopover } from '@/components/theme-popover';
import { useTheme } from '@/hooks/useTheme';
import PauseIcon from '@/assets/icons/pause';
import { Undo2 } from 'lucide-react';
import { Palette } from 'lucide-react';
import { ALargeSmall } from 'lucide-react';

interface TokenProps {
  token: string;
  highlightIndex: number;
}

export interface SpeedReaderComponentProps {
  text: string;
  wps: number;
  onWpsChange: (wpsChange: (delta: number) => number) => void;
}

function getHighlightIndex(token: string): number {
  let mid = Math.floor(token.length / 2);
  mid = token.length % 2 !== 0 ? mid : mid - 1;
  return Math.min(2, mid);
}

function SpeedReaderComponent({ text, wps, onWpsChange }: SpeedReaderComponentProps) {
  const tokens = text.split(' ');

  const [currIndex, setCurrIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [textSize, setTextSize] = useState<number>(5);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (wps === 0 || isPaused) {
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
  }, [setCurrIndex, currIndex, wps, tokens.length, isPaused]);

  const endOfText = currIndex >= tokens.length;

  if (endOfText) {
    return <Quiz />;
  }

  const wpm = wps * 60;

  return (
    <div className="reader">
      <div className="reader__token" style={{ fontSize: `${textSize}rem` }}>
        <TokenComponent
          token={tokens[currIndex]}
          highlightIndex={getHighlightIndex(tokens[currIndex])}
        ></TokenComponent>
      </div>

      <div className='top-controls w-full flex p-8 absolute top-0 space-between *:w-full'>
        <div>
          <button>
            <Undo2 className="text-on-subtle h-5 w-5"></Undo2>
          </button>
        </div>

        <div className='flex flex-col text-center gap-1'>
          <span className='text-on'>15 min left</span>
          <span className='text-on-subtle callout'>Section in{" "}
            <span id='title'>Chapter 1.1 – Shared Objects and Synchronization</span>
          </span>
        </div>

        <div className='flex justify-end gap-1.5'>
          <ThemePopover
            theme={theme}
            onThemeChange={setTheme}
            trigger={
              <button>
                <Palette className="text-on-subtle h-5 w-5"></Palette>
              </button>
            }
          />
          <TextSizePopover
            textSize={textSize}
            onTextSizeChange={setTextSize}
            trigger={
              <button>
                <ALargeSmall className="text-on-subtle h-5 w-5"></ALargeSmall>
              </button>
            }
          />
        </div>
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
              <button onClick={() => setIsPaused(!isPaused)}>
                {isPaused ? (
                  <PlayIcon className="text-on-subtle pl-0.5 scale-125" />
                ) : (
                  <PauseIcon className="text-on-subtle pl-0.5 scale-125" />
                )}
              </button>
              <button>
                <NextWordIcon className="text-on-subtle"></NextWordIcon>
              </button>
              <button>
                <NextSentenceIcon className="text-on-subtle"></NextSentenceIcon>
              </button>
            </div>

            <WpmPopover
              wpm={wpm}
              onWpmChange={wpmChange => {
                // Convert WPM change function to WPS change
                onWpsChange(wps => wpmChange(wps * 60) / 60);
              }}
              trigger={
                <button className="w-[32px] h-[32px] aspect-square">
                  <span className="text-xs text-on-subtle">{wpm}</span>
                </button>
              }
            />
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
