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
import PauseIcon from '@/assets/icons/pause';

interface TokenProps {
  token: string;
  highlightIndex: number;
}

export interface SpeedReaderComponentProps {
  text: string;
  wps: number;
  onWpsChange: (wpsChange: (curWps: number) => number) => void;
  back: () => void;
}

const PAUSE_TIMEOUT_IN_MS = 3_000;

function getHighlightIndex(token: string): number {
  let mid = Math.floor(token.length / 2);
  mid = token.length % 2 !== 0 ? mid : mid - 1;
  return Math.min(2, mid);
}

function SpeedReaderComponent({ text, wps, onWpsChange, back }: SpeedReaderComponentProps) {
  const tokens = text.split(' ');

  const [currIndex, setCurrIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(true);

  const [showControls, setShowControls] = useState<boolean>(true);

  // 2. Effect to handle inactivity
  useEffect(() => {
    let timer: number;

    const handleMouseMove = () => {
      setShowControls(true);

      // Clear existing timer and start a new 3-second countdown
      clearTimeout(timer);

      // Only start the timer if the player is NOT paused
      // (Usually, users want controls to stay visible while paused)
      if (!isPaused) {
        timer = setTimeout(() => {
          setShowControls(false);
        }, PAUSE_TIMEOUT_IN_MS);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Initial timer setup if already playing
    if (!isPaused) {
      timer = setTimeout(() => setShowControls(false), PAUSE_TIMEOUT_IN_MS);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timer);
    };
  }, [isPaused]);

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
    return (
      <Quiz
        retryAtSlowerSpeed={() => {
          setCurrIndex(0);
          onWpsChange(wps => wps - 1);
        }}
        readAnotherPassage={() => back()}
      />
    );
  }

  const wpm = wps * 60;

  const goToTokenAndPause = (token: number | ((curToken: number) => number)) => {
    setIsPaused(true);
    setCurrIndex(token);
  };

  return (
    <div className="reader">
      <div className="reader__token">
        <TokenComponent
          token={tokens[currIndex]}
          highlightIndex={getHighlightIndex(tokens[currIndex])}
        ></TokenComponent>
      </div>

      <div className="top-controls top-8 w-full flex justify-center"></div>

      {showControls && (
        <div className="bg-primary rounded-xlg flex flex-col gap-2 p-1 min-w-90 bg-surface-low rounded-xl px-3 pt-1 pb-2 absolute bottom-8">
          <div className="control__top">
            <div className="controls__btns flex justify-between">
              <div className="w-[32px] h-[32px] aspect-square"></div>
              <div className="flex flex-row gap-0.5 w-full justify-center">
                <button name="start" onClick={() => goToTokenAndPause(0)}>
                  <LastSentenceIcon className="text-on-subtle"></LastSentenceIcon>
                </button>
                <button
                  name="previous-token"
                  onClick={() => goToTokenAndPause(currIndex => Math.max(currIndex - 1, 0))}
                >
                  <LastWordIcon className="text-on-subtle"></LastWordIcon>
                </button>
                <button onClick={() => setIsPaused(!isPaused)}>
                  {isPaused ? (
                    <PlayIcon className="text-on-subtle pl-0.5 scale-125" />
                  ) : (
                    <PauseIcon className="text-on-subtle pl-0.5 scale-125" />
                  )}
                </button>
                <button
                  name="next-token"
                  onClick={() =>
                    goToTokenAndPause(curIndex => Math.min(curIndex + 1, tokens.length - 1))
                  }
                >
                  <NextWordIcon className="text-on-subtle"></NextWordIcon>
                </button>
                <button name="quiz" onClick={() => goToTokenAndPause(tokens.length)}>
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
      )}
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
