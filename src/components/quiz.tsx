import { useState } from 'react';
import './quiz.css';
import CorrectAnswerIcon from '@/assets/icons/correct-answer';
import WrongAnswerIcon from '@/assets/icons/wrong-answer';
import Bunny from './bunny';

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
        return (
            <div className="min-h-screen flex flex-col gap-6 items-center justify-center p-10 *:max-w-md text-center">
                <Bunny />

                <div className='flex flex-col gap-1'>
                    <p className='text-on-subtle/75'>You got</p>
                    <h1 className="text-3xl text-on font-serif mb-0.5">20%</h1>
                    <p className='text-lg text-on-subtle font-serif'>1 of 5 correct</p>
                </div>

                <p className="text-lg paragraph-text text-on-subtle mb-2">
                    You answered all {questions.length} questions at 900 WPM! But we don’t actually think you understand what you read 😔
                </p>

                <div className='w-full flex flex-col gap-3'>
                    <button className='w-full px-6 py-3 rounded-md bg-primary text-on disabled:text-on-disabled disabled:bg-surface-low disabled:opacity-40 transition-colors'>Retry at reduced speed</button>
                    <button className='w-full px-6 py-3 rounded-md bg-surface-low text-on disabled:text-on-disabled disabled:bg-surface-low disabled:opacity-40 transition-colors'>Read another passage</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen *:max-w-lg flex flex-col items-center justify-between text-white p-10">
            <div className="flex flex-col items-center justify-center text-center">
                <p className="text-sm text-on-subtle mb-2">
                    Question {current + 1} of {questions.length}
                </p>
                <h1 className="font-serif title-1">{currentQuestion.question}</h1>
            </div>

            <div className="grid grid-cols-1 gap-4 w-full">
                {currentQuestion.options.map((opt, idx) => {
                    const isSelected = selected === idx;
                    const isCorrect = idx === currentQuestion.correctIndex;
                    const hasAnswered = selected !== null;

                    // Logic for button colors
                    let buttonStyles = 'bg-surface-med/50 hover:bg-surface-med';

                    if (hasAnswered) {
                        if (isCorrect) {
                            // Highlight the correct answer green
                            buttonStyles = 'border-green-500 bg-green-900/30 text-green-400';
                        } else if (isSelected && !isCorrect) {
                            // Highlight the user's wrong selection red
                            buttonStyles = 'border-red-500 bg-red-900/30 text-red-400';
                        } else {
                            // Dim other options
                            buttonStyles = 'bg-surface-med/25 border-gray-800 opacity-50';
                        }
                    } else if (isSelected) {
                        buttonStyles = 'border-gray-400 bg-gray-700';
                    }

                    // Logic for chip colors
                    let chipStyles = 'bg-surface-hi';
                    let chipTextStyles = 'text-on-subtle';

                    if (hasAnswered) {
                        if (isCorrect) {
                            // Highlight the correct answer green
                            chipStyles = 'bg-green-900/50';
                            chipTextStyles = 'text-green-400';
                        } else if (isSelected && !isCorrect) {
                            // Highlight the user's wrong selection red
                            chipStyles = 'bg-red-900/50';
                            chipTextStyles = 'text-red-400';
                        } else {
                            // Dim other options
                            chipStyles = 'bg-surface-med/25 opacity-50';
                            chipTextStyles = 'text-on-subtle';
                        }
                    } else if (isSelected) {
                        chipStyles = 'bg-surface-med/50';
                        chipTextStyles = 'text-on-subtle';
                    }

                    return (
                        <div className='flex'>
                            <button
                                key={idx}
                                disabled={hasAnswered} // Prevent changing answer
                                onClick={() => handleSelect(idx)}
                                className={`question-option w-full body-text flex items-center gap-4 rounded-md text-left transition-all ${buttonStyles}`}
                            >
                                <div id='color-chip' className={`aspect-square w-6 h-6 flex items-center justify-center rounded-sm transition-all ${chipStyles}`}>
                                    <span className={`font-bold ${chipTextStyles}`}>
                                        {String.fromCharCode(65 + idx)}
                                    </span>
                                </div>
                                <span className='py-2'>
                                    {opt}
                                </span>
                            </button>

                            {hasAnswered && isCorrect && <div className='absolute w-full max-w-lg'>
                                <div className='w-full max-w-lg'></div>
                                <CorrectAnswerIcon className='text-green-400 scale-150 -translate-x-1 -translate-y-1' />
                            </div>}

                            {hasAnswered && !isCorrect && isSelected && <div className='absolute w-full max-w-lg'>
                                <div className='w-full max-w-lg'></div>
                                <WrongAnswerIcon className='text-red-400 scale-150 -translate-x-1' />
                            </div>}
                        </div>
                    );
                })}
            </div>

            <button
                onClick={nextQuestion}
                disabled={selected === null}
                className="w-full px-6 py-3 rounded-md bg-primary text-on disabled:text-on-disabled disabled:bg-surface-low disabled:opacity-40 transition-colors"
            >
                {current + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}
            </button>
        </div>
    );
}
