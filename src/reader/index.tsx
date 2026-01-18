import { useEffect, useState } from 'react';
import './index.css';
import { Slider } from '@/components/ui/slider';
import PlayIcon from '@/assets/icons/play';
import NextWordIcon from '@/assets/icons/next-word';
import NextSentenceIcon from '@/assets/icons/next-sentence';
import LastSentenceIcon from '@/assets/icons/last-sentence';
import LastWordIcon from '@/assets/icons/last-word';
import Quiz, { type QuizQuestion } from '@/components/quiz';
import { WpmPopover } from '@/components/wpm-popover';
import { TextSizePopover } from '@/components/text-size-popover';
import { ThemePopover } from '@/components/theme-popover';
import { useTheme } from '@/hooks/useTheme';
import { useWpm } from '@/hooks/useWpm';
import PauseIcon from '@/assets/icons/pause';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod/v3';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { Undo2 } from 'lucide-react';
import { Palette } from 'lucide-react';
import { ALargeSmall } from 'lucide-react';
import Bunny from '@/components/bunny';

interface TokenProps {
  token: string;
  highlightIndex: number;
}

export interface SpeedReaderComponentProps {
  sectionTitle: string;
  text: string;
  onWpsChange: (wpsChange: (curWps: number) => number) => void;
  back: () => void;
}

const PAUSE_TIMEOUT_IN_MS = 3_000;

const mockQuiz: QuizQuestion[] = [
  {
    question:
      'According to the passage, why have manufacturers stopped trying to increase the clock speed of processors?',
    options: [
      'The industry has shifted focus entirely to mobile devices.',
      'Moores Law has been repealed, making it physically impossible.',
      'Increasing clock speed causes the processors to overheat.',
      'There is no longer a demand for faster computing tasks.'
    ],
    correctAnswerIndex: 2
  },
  {
    question: 'Which component is responsible for executing instructions in a CPU?',
    options: ['ALU', 'Cache', 'Control Unit', 'Registers'],
    correctAnswerIndex: 0
  },
  {
    question: 'What is the primary purpose of a computer cache?',
    options: [
      'Store large files permanently',
      'Speed up access to frequently used data',
      'Manage power consumption',
      'Handle network traffic'
    ],
    correctAnswerIndex: 1
  }
];

function getHighlightIndex(token: string): number {
  let mid = Math.floor(token.length / 2);
  mid = token.length % 2 !== 0 ? mid : mid - 1;
  return Math.min(2, mid);
}

function SpeedReaderComponent({
  sectionTitle,
  text,
  onWpsChange,
  back
}: SpeedReaderComponentProps) {
  const tokens = text.split(' ');

  const [currIndex, setCurrIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [textSize, setTextSize] = useState<number>(5);
  const { theme, setTheme } = useTheme();

  const [showControls, setShowControls] = useState<boolean>(true);

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { wpm, setWpm } = useWpm();

  // Use WPM from localStorage, convert to WPS for reading speed
  const currentWps = wpm / 60;

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
    if (currentWps === 0 || isPaused) {
      return;
    }

    // Add a bit of delay at the last word before showing quiz
    const timeout = currIndex + 1 < tokens.length ? 1000 / currentWps : 500;

    const timer = setTimeout(() => {
      if (currIndex >= tokens.length) {
        return;
      }

      setCurrIndex(prevIndex => prevIndex + 1);
    }, timeout);

    return () => {
      clearInterval(timer);
    };
  }, [setCurrIndex, currIndex, currentWps, tokens.length, isPaused]);

  const endOfText = currIndex >= tokens.length;

  useEffect(() => {
    async function getQuizQuestions() {

      setIsLoading(true);


      // try {

      setQuestions(mockQuiz);
      setIsLoading(false);

    }

    getQuizQuestions();
  }, [endOfText, text]);

  if (endOfText) {
    return isLoading ? (
      <div className='flex flex-col gap-1.5 justify-center items-center min-w-screen min-h-screen'>
        <Bunny className='text-on-subtle'></Bunny>
        <p className='text-on-subtle'>Generating quiz...</p>
      </div>
    ) : (
      <Quiz
        wpm={wpm}
        questions={questions}
        retryAtSlowerSpeed={() => {
          setCurrIndex(0);
          setWpm(wpm - 60);
        }}
        readAnotherPassage={() => back()}
      />
    );
  }

  const goToTokenAndPause = (token: number | ((curToken: number) => number)) => {
    setIsPaused(true);
    setCurrIndex(token);
  };

  return (
    <div className="reader">
      <div className="reader__token" style={{ fontSize: `${textSize}rem` }}>
        <TokenComponent
          token={tokens[currIndex]}
          highlightIndex={getHighlightIndex(tokens[currIndex])}
        ></TokenComponent>
      </div>

      <div className="top-controls w-full flex p-8 absolute top-0 space-between *:w-full">
        <div>
          <button>
            <Undo2 className="text-on-subtle h-5 w-5"></Undo2>
          </button>
        </div>

        <div className="flex flex-col text-center gap-1">
          <span className="text-on">{Math.ceil((tokens.length - currIndex) / wpm)} min left</span>
          <span className="text-on-subtle callout">
            Section in <span id="title">{sectionTitle}</span>
          </span>
        </div>

        <div className="flex justify-end gap-1.5">
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
                setWpm={setWpm}
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
