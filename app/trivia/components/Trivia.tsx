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
        if (options.difficulty && options.difficulty !== 'Any') {
            url += `&difficulty=${options.difficulty.toLowerCase()}`;
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

    const isStartDisabled = !options.category || !options.difficulty;

    return (
        <div className="flex flex-col items-center justify-center h-[calc(100dvh-48px)] w-full border-2 border-red-500">
            {!quizStarted ? (
                <>
                    <div className="text-2xl font-semibold mb-4">Choose a Category</div>
                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        {categories.map((cat) => (
                            <div
                                key={cat.id}
                                className={`flex flex-col items-center p-4 rounded-lg shadow-md cursor-pointer transition ${
                                    options.id === cat.id
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white hover:bg-gray-200'
                                }`}
                                onClick={() => setOptions((prev) => ({ ...prev, id: cat.id, category: cat.name }))}
                            >
                                <cat.img className="h-10 w-10 mb-2 object-cover rounded-full" />
                                <div className="text-lg font-medium">{cat.name}</div>
                            </div>
                        ))}
                    </div>
                    <div className="text-2xl font-semibold mb-4">Choose a Difficulty</div>
                    <div className="flex gap-6 mb-8">
                        {['Any', 'Easy', 'Medium', 'Hard'].map((difficulty) => (
                            <div
                                key={difficulty}
                                className={`px-6 py-3 rounded-lg shadow-md text-lg font-medium cursor-pointer transition ${
                                    options.difficulty === difficulty
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white hover:bg-gray-200'
                                }`}
                                onClick={() => setOptions((prev) => ({ ...prev, difficulty }))}
                            >
                                {difficulty}
                            </div>
                        ))}
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
                </>
            ) : <QuizSection questions={questions}/>}
        </div>
    );
}