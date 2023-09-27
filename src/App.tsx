import { useEffect, useRef, useState } from "react";
const WORDS_PER_SENTENCE = 10;
function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [text, setText] = useState(
    "the quick brown fox jumps over the lazy dog dog"
  );
  const [results, setResults] = useState({ error: 0 });
  const [timeStamp, setTimeStamp] = useState(1);
  const [words, setWords] = useState<string[]>([]);
  const [countTime, setCountTime] = useState(0);
  const timer = useRef<number | null>(null);
  const MakeATenWordSentence = (words: string[]) => {
    let text = "";
    for (let i = 0; i < WORDS_PER_SENTENCE; i++) {
      const randomNumberIndex = Math.floor(Math.random() * words.length);
      text = text.concat(words[randomNumberIndex] + " ");
    }
    return text.trim();
  };
  useEffect(() => {
    if (currentIndex === 1) {
      timer.current = setInterval(() => {
        setCountTime((P) => P + 1);
      }, 1000);
    }

    if (currentIndex === 1) {
      setTimeStamp(Date.now());
    } else {
      return;
    }
  }, [currentIndex]);
  useEffect(() => {
    const getTextFile = async () => {
      try {
        const response = await fetch("/utils/words_alpha.txt");
        const data = await response.text();
        const wordArray = data.split("\r\n");
        setWords(wordArray);
      } catch (er) {
        console.log(er);
      }
    };
    getTextFile();
  }, []);
  useEffect(() => {
    if (countTime > 10) {
      console.log(timer);
      clearInterval(timer.current!);
    } else return;
  }, [countTime]);
  return (
    <div
      className="flex w-screen bg-blue-500  justify-center items-center flex-col h-screen gap-6"
      onKeyDown={(e) => {
        if (e.key === text[currentIndex]) {
          if (currentIndex >= text.length - 1) {
            setCurrentIndex(0);
            // can add the new text once the existing block was finished
            setTimeStamp((p) => Date.now() - p);

            setText(MakeATenWordSentence(words));
            return;
          }
          // getRandomText(currentIndex === 0);
          setCurrentIndex((p) => p + 1);
        } else {
          setResults((p) => ({ ...p, error: p.error + 1 }));
          return;
        }
      }}
      tabIndex={0}
      autoFocus={true}
    >
      <h1>Type Here!!!!</h1>
      <div className="text-2xl  ">
        {text
          .replace(/ /g, ".")
          .split("")
          .map((i, t) => {
            return (
              <span
                key={t}
                className={`${
                  t === currentIndex &&
                  " bg-white rounded-sm shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)] scale-50 "
                } relative p-1 transition-all ease-linear  `}
              >
                {i}
              </span>
            );
          })}
      </div>
      <p className="text-xl">{results.error}</p>
      <p className="text-xl">
        {Math.floor((60 * WORDS_PER_SENTENCE) / Math.ceil(timeStamp / 1000))}{" "}
        WPM{" "}
      </p>
      <p>{countTime}</p>
    </div>
  );
}

export default App;
