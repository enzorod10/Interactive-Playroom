'use client';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { Category, Question } from '../types';

interface QuizSectionTypes{
    questions: Question[];
    onComplete: (id: number, score: number) => void;
    selectedCategory: Category;
}

export default function QuizSection({ selectedCategory, questions, onComplete }: QuizSectionTypes) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<null | string>(null);
    const [score, setScore] = useState(0);
    const [disabledAnswers, setDisabledAnswers] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(11);

    const currentQuestion = questions[currentQuestionIndex];
    const { question, correct_answer, incorrect_answers, type } = currentQuestion;

    const shuffledAnswers = useMemo(() => {
        return type === 'multiple'
            ? [...incorrect_answers, correct_answer].sort(() => Math.random() - 0.5)
            : ['True', 'False'];
    }, [correct_answer, incorrect_answers, type]);

    const moveToNextQuestion = useCallback(() => {
        setDisabledAnswers(false);
        setSelectedAnswer(null);
        setTimeRemaining(11);
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            onComplete(selectedCategory.id, score);
        }
    }, [currentQuestionIndex, onComplete, questions.length, score, selectedCategory.id]);
    
    const handleAnswerClick = (answer: string) => {
        setDisabledAnswers(true);
        setSelectedAnswer(answer);
    
        if (answer === correct_answer) {
            setScore((prevScore) => prevScore + 1);
        }
    
        setTimeout(() => {
            moveToNextQuestion();
        }, 1000);
    };
    
    useEffect(() => {
        if (timeRemaining === 0) {
            moveToNextQuestion();
            return;
        }
    
        const timer = setTimeout(() => {
            setTimeRemaining((prevTime) => prevTime - 1);
        }, 1000);
    
        return () => clearTimeout(timer);
    }, [timeRemaining, moveToNextQuestion]);

    const timePercentage = ((timeRemaining - 1) / 10) * 100;

    return (
        <div className="flex flex-col items-center justify-center h-full max-w-2xl sm:mx-auto m-4 gap-8">
            <div className='flex flex-col w-full items-center gap-2'>
                <div className="text-lg font-medium">
                    Question {currentQuestionIndex + 1} of {questions.length}
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                        className={`h-full ${timePercentage <= 20 ? 'bg-red-500' : timePercentage <= 50 ? 'bg-orange-500' : 'bg-blue-500'} rounded-full transition-all duration-1000 ease-linear`}
                        style={{ width: `${timePercentage}%` }}
                    />
                </div>
            </div>
            <div className='flex flex-col items-center gap-4'>
                <div className="text-2xl font-bold text-center" dangerouslySetInnerHTML={{ __html: question }} />
                <div className="flex flex-col gap-4 ">
                    {shuffledAnswers.map((answer, index) => (
                        <button
                            key={index}
                            disabled={disabledAnswers}
                            onClick={() => handleAnswerClick(answer)}
                            className={`px-6 py-3 rounded-lg shadow-md text-lg font-medium cursor-pointer transition ${
                                selectedAnswer === answer
                                    ? answer === correct_answer
                                        ? 'bg-green-500 text-white'
                                        : 'bg-red-500 text-white'
                                    : 'bg-primary/50'
                            }`}
                            dangerouslySetInnerHTML={{ __html: answer }}
                        />
                    ))}
                </div>
            </div>

            <div className="text-lg font-medium">
                Score: {score} / {questions.length}
            </div>
        </div>
    );
}