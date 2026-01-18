import { useState } from 'react';
import './quiz.css';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

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
    correctIndex: 2
  },
  {
    question: 'Which component is responsible for executing instructions in a CPU?',
    options: ['ALU', 'Cache', 'Control Unit', 'Registers'],
    correctIndex: 0
  },
  {
    question: 'What is the primary purpose of a computer cache?',
    options: [
      'Store large files permanently',
      'Speed up access to frequently used data',
      'Manage power consumption',
      'Handle network traffic'
    ],
    correctIndex: 1
  }
];

export interface QuizProps {
  questions?: QuizQuestion[];
}

export default function Quiz({ questions = mockQuiz }: QuizProps = {}) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const currentQuestion = questions[current];

  const finished = current >= questions.length;

  const handleSelect = (index: number) => {
    if (selected === null) setSelected(index);
  };

  const nextQuestion = () => {
    if (current < questions.length) {
      setCurrent(current + 1);
      setSelected(null);
    }
  };

  if (finished) {
    const score = questions.reduce((acc, q) => acc + (selected === q.correctIndex ? 1 : 0), 0);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#1e1e1e] text-white p-6">
        <h2 className="text-2xl font-semibold mb-4">Quiz Complete</h2>
        <p className="text-lg">
          Your score: {score} / {questions.length}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1e1e1e] text-white p-6">
      <p className="text-sm text-gray-400 mb-2">
        Question {current + 1} of {questions.length}
      </p>
      <h1 className="text-center text-lg md:text-xl lg:text-2xl font-medium mb-6 whitespace-pre-line">
        {currentQuestion.question}
      </h1>

      <div className="flex flex-col gap-4 w-full max-w-xl">
        {currentQuestion.options.map((opt, idx) => {
          const isSelected = selected === idx;
          const isCorrect = idx === currentQuestion.correctIndex;
          const hasAnswered = selected !== null;

          // Logic for button colors
          let buttonStyles = 'border-gray-700 hover:bg-gray-700';

          if (hasAnswered) {
            if (isCorrect) {
              // Highlight the correct answer green
              buttonStyles = 'border-green-500 bg-green-900/30 text-green-400';
            } else if (isSelected && !isCorrect) {
              // Highlight the user's wrong selection red
              buttonStyles = 'border-red-500 bg-red-900/30 text-red-400';
            } else {
              // Dim other options
              buttonStyles = 'border-gray-800 opacity-50';
            }
          } else if (isSelected) {
            buttonStyles = 'border-gray-400 bg-gray-700';
          }

          return (
            <button
              key={idx}
              disabled={hasAnswered} // Prevent changing answer
              onClick={() => handleSelect(idx)}
              className={`question-option flex items-center gap-2 px-4 py-3 rounded-md text-left border transition-all ${buttonStyles}`}
            >
              <span
                className={`font-bold ${hasAnswered && isCorrect ? 'text-green-400' : 'text-gray-400'}`}
              >
                {String.fromCharCode(65 + idx)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      <button
        onClick={nextQuestion}
        disabled={selected === null}
        className="mt-6 px-6 py-3 rounded-md bg-blue-600 text-white disabled:bg-gray-700 disabled:opacity-50 hover:bg-blue-500 transition-colors"
      >
        {current + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}
      </button>
    </div>
  );
}
