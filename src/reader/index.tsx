import { useEffect, useState } from "react";

const testText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In consequat est est. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec convallis, quam eget bibendum ultricies, nisl ante porta mi, rutrum posuere sem nisl vel est. Vivamus efficitur iaculis dignissim. Etiam egestas consectetur posuere. Aenean eu magna eu sapien mollis fringilla. Praesent est ligula, dignissim id malesuada vitae, consectetur eget arcu. Etiam a neque et justo posuere pharetra non blandit risus. Duis fringilla libero vitae nisl egestas elementum. Donec ut suscipit nunc, id imperdiet ipsum. Integer vel placerat felis, eget consectetur lorem. Nam mi purus, egestas sit amet ultrices venenatis, accumsan in purus. Nullam id leo vel enim aliquam congue. Morbi urna est, viverra vitae mattis suscipit, efficitur non est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. "

const tokens = testText.split(" ");
const wps = 100 / 60; //

function SpeedReaderComponent() {
  const [currIndex, setCurrIndex] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrIndex((prevIndex) => ((prevIndex + 1) % tokens.length));
    }, 1000 / wps);

    return () => {
      clearInterval(timer);
    }
  }, []);

  return (
    <>
      <div className="token">
        {tokens[currIndex]}
      </div>
    </>
  )
}

export default SpeedReaderComponent;
