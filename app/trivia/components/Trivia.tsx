'use client';
import { useState } from 'react';
import { categories } from "../data";
import QuizSection from './QuizSection';

interface optionsType {
    id: number | undefined;
    category: string | undefined;
    difficulty: string | undefined;
}

export default function Trivia() {
    const [options, setOptions] = useState<optionsType>({ id: undefined, category: undefined, difficulty: undefined });
    const [questions, setQuestions] = useState([]);
    const [quizStarted, setQuizStarted] = useState(false);

    const buildApiUrl = () => {
        let url = `https://opentdb.com/api.php?amount=10`;
        if (options.id && options.id !== 8) {
            url += `&category=${options.id}`;
        }
        return url;
    };

    const handleStartClick = async () => {
        const apiUrl = buildApiUrl();
        const response = await fetch(apiUrl);
        const data = await response.json();
        setQuestions(data.results);
        setQuizStarted(true);
    };

    const isStartDisabled = !options.category;

    return (
        <div className="h-[calc(100dvh-48px)] w-full overflow-hidden">
            {!quizStarted ? (
                <div className='flex flex-col h-full p-4 sm:mx-auto max-w-2xl justify-evenly gap-4'>
                    <div className='flex flex-col gap-4 overflow-hidden'>
                        <div className="text-xl font-semibold w-full text-center">Choose a Category</div>
                        <div className="flex flex-wrap justify-center gap-4 overflow-auto">
                            {categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    className={`flex flex-col h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-lg shadow-md border cursor-pointer transition ${
                                        options.id === cat.id
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-white hover:bg-gray-200'
                                    }`}
                                    onClick={() => setOptions((prev) => ({ ...prev, id: cat.id, category: cat.name }))}
                                >
                                    <cat.img className="h-8 w-8" />
                                    <div className="text-sm">{cat.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        type="button"
                        className={`text-white bg-gradient-to-r from-cyan-500 to-blue-500 font-medium rounded-lg text-lg px-6 py-3 transition ${
                            isStartDisabled
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800'
                        }`}
                        onClick={handleStartClick}
                        disabled={isStartDisabled}
                    >
                        Start
                    </button>
                </div>
            ) : <QuizSection questions={questions}/>}
        </div>
    );
}