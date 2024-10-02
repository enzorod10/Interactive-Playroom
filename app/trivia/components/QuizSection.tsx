import { useState, useMemo, useEffect, useCallback } from 'react';
import { Question } from '../types';

interface QuizSectionTypes{
    questions: Question[];
}

export default function QuizSection({ questions }: QuizSectionTypes) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<null | string>(null);
    const [score, setScore] = useState(0);
    const [disabledAnswers, setDisabledAnswers] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(10);

    const currentQuestion = questions[currentQuestionIndex];
    const { question, correct_answer, incorrect_answers, type } = currentQuestion;

    const shuffledAnswers = useMemo(() => {
        return type === 'multiple'
            ? [...incorrect_answers, correct_answer].sort(() => Math.random() - 0.5)
            : ['True', 'False'];
    }, [correct_answer, incorrect_answers, type]);

    const handleAnswerClick = (answer: string) => {
        setDisabledAnswers(true);
        setSelectedAnswer(answer);

        // Check if the answer is correct and update score
        if (answer === correct_answer) {
            setScore(score + 1);
        }

        // Move to the next question after a short delay
        setTimeout(() => {
            moveToNextQuestion(answer === correct_answer);
        }, 1000);
    };

    const moveToNextQuestion = useCallback((isCorrect: boolean) => {
        setDisabledAnswers(false);
        setSelectedAnswer(null);
        setTimeRemaining(10); // Reset timer for next question
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            alert(`Quiz complete! Your score: ${score + (isCorrect ? 1 : 0)} / ${questions.length}`);
        }
    }, [currentQuestionIndex, questions.length, score])

    // useEffect(() => {
    //     if (timeRemaining === 0) {
    //         moveToNextQuestion(false);
    //         return;
    //     }

    //     const timer = setTimeout(() => {
    //         setTimeRemaining(timeRemaining - 1);
    //     }, 1000);

    //     return () => clearTimeout(timer);
    // }, [timeRemaining, currentQuestionIndex, moveToNextQuestion]);

    return (
        <div className="flex flex-col items-center border h-full max-w-2xl sm:mx-auto">
            <div className="text-xl font-bold mb-4">Time remaining: {timeRemaining}s</div>
            <div className="text-lg font-medium mb-4">
                Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            <div className="text-2xl font-bold mb-4" dangerouslySetInnerHTML={{ __html: question }} />

            <div className="flex flex-col gap-4 mb-6">
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
                                : 'bg-white hover:bg-gray-200'
                        }`}
                        dangerouslySetInnerHTML={{ __html: answer }}
                    />
                ))}
            </div>

            <div className="text-lg font-medium">
                Score: {score} / {questions.length}
            </div>
        </div>
    );
}