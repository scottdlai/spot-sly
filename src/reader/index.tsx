import { useEffect, useState } from "react";
import './index.css';

const testText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In consequat est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec convallis, quam eget bibendum ultricies, nisl ante porta mi, rutrum posuere sem nisl vel est. Vivamus efficitur iaculis dignissim. Etiam egestas consectetur posuere. Aenean eu magna eu sapien mollis fringilla. Praesent est ligula, dignissim id malesuada vitae, consectetur eget arcu. Etiam a neque et justo posuere pharetra non blandit risus. Duis fringilla libero vitae nisl egestas elementum. Donec ut suscipit nunc, id imperdiet ipsum. Integer vel placerat felis, eget consectetur lorem. Nam mi purus, egestas sit amet ultrices venenatis, accumsan in purus. Nullam id leo vel enim aliquam congue. Morbi urna est, viverra vitae mattis suscipit, efficitur non est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. "

const tokens = testText.split(" ");
const wps = 100 / 60;

interface TokenProps {
  token: string;
  highlightIndex: number;
}

function getHighlightIndex(token: string): number {
  const mid = Math.floor(token.length / 2);
  return (token.length % 2 !== 0) ? mid : mid - 1;
}

function SpeedReaderComponent() {
  const [currIndex, setCurrIndex] = useState<number>(0);
  console.log("Made component");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrIndex((prevIndex) => ((prevIndex + 1) % tokens.length));
    }, 1000 / wps);
    console.log("Set up interval");

    return () => {
      clearInterval(timer);
    }
  }, []);

  return (
    <div className="reader">
      <div className="reader__token">
        <TokenComponent
          token={tokens[currIndex]}
          highlightIndex={getHighlightIndex(tokens[currIndex])}>
        </TokenComponent>
      </div>
      <div className="controls">
        <div className="controls__btns">
          <button>A</button>
          <button>B</button>
          <button>C</button>
          <button>D</button>
          <button>E</button>
        </div>
        <div></div>
      </div>
    </div>
  )
}

function TokenComponent({ token, highlightIndex }: TokenProps) {
  return (<>
    {
      token.split("").map((char, index) => {
        const style = (index === highlightIndex) ? 'reader__token__hl' : '';

        return <span key={index} className={style ?? undefined}>{char}</span>
      })
    }
  </>)
}


export default SpeedReaderComponent;
