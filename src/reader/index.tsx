import { useEffect, useState } from 'react';
import './index.css';
import { Slider } from '@/components/ui/slider';

const testText =
  'The Project Gutenberg EBook of Alice in Wonderland by Lewis Carroll. This eBook is for the use of anyone anywhere at no cost and with almost no restrictions whatsoever. You may copy it give it away or reuse it under the terms of the Project Gutenberg License included with this eBook or online at www.gutenberg.org Title Alice in Wonderland Author Lewis Carroll Language English';

const tokens = testText.split(' ');
const wps = 600 / 60;

interface TokenProps {
  token: string;
  highlightIndex: number;
}

function getHighlightIndex(token: string): number {
  let mid = Math.floor(token.length / 2);
  mid = token.length % 2 !== 0 ? mid : mid - 1;
  return Math.min(2, mid);
}

function SpeedReaderComponent() {
  const [currIndex, setCurrIndex] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrIndex(prevIndex => (prevIndex + 1) % tokens.length);
    }, 1000 / wps);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="reader">
      <div className="reader__token">
        <TokenComponent
          token={tokens[currIndex]}
          highlightIndex={getHighlightIndex(tokens[currIndex])}
        ></TokenComponent>
      </div>
      <div className="bg-primary rounded-xlg flex flex-col gap-2 p-1 min-w-90">
        <div className="controls__btns">
          <button>A</button>
          <button>B</button>
          <button>C</button>
          <button>D</button>
          <button>E</button>
        </div>
        <Slider
          className="control__progress opacity-100"
          value={[currIndex]}
          max={tokens.length}
          disabled
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
