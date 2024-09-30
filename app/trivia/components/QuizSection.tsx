import { useState } from 'react';

export default function QuizSection({ questions }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);

    const currentQuestion = questions[currentQuestionIndex];
    const { question, correct_answer, incorrect_answers, type } = currentQuestion;

    // Shuffle the answers for 'multiple' type questions
    const shuffledAnswers =
        type === 'multiple'
            ? [...incorrect_answers, correct_answer].sort(() => Math.random() - 0.5)
            : ['True', 'False'];

    const handleAnswerClick = (answer) => {
        setSelectedAnswer(answer);

        // Check if the answer is correct and update score
        if (answer === correct_answer) {
            setScore(score + 1);
        }

        // Move to next question after a short delay
        setTimeout(() => {
            setSelectedAnswer(null);
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                // Quiz is finished
                alert(`Quiz complete! Your score: ${score + (answer === correct_answer ? 1 : 0)} / ${questions.length}`);
            }
        }, 1000);
    };

    return (
        <div className="flex flex-col items-center">
            {/* Display the current question */}
            <div className="text-2xl font-bold mb-4" dangerouslySetInnerHTML={{ __html: question }} />

            {/* Display the answer options */}
            <div className="flex flex-col gap-4 mb-6">
                {shuffledAnswers.map((answer, index) => (
                    <button
                        key={index}
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

            {/* Display current score */}
            <div className="text-lg font-medium">
                Score: {score} / {questions.length}
            </div>
        </div>
    );
}
