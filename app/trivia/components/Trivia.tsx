'use client';
import { useEffect, useState } from 'react';
import { categories as categoriesListed } from "../data";
import QuizSection from './QuizSection';
import { Category } from '../types';

export default function Trivia() {
    const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined);
    const [questions, setQuestions] = useState([]);
    const [quizStarted, setQuizStarted] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
  
    useEffect(() => {
      const grabCategories = () => {
        return categoriesListed.map((cat) => {
          const lastQuizData = localStorage.getItem(`quiz_${cat.id}`);
          if (lastQuizData) {
            const { date, score } = JSON.parse(lastQuizData);
            const today = new Date().toLocaleDateString();
            if (date === today) {
              return { ...cat, score };
            } else {
              return { ...cat, score: undefined };
            }
          } else {
            return { ...cat, score: undefined };
          }
        });
      };
  
      setCategories(grabCategories());
    }, []);
  
    const buildApiUrl = () => {
      let url = `https://opentdb.com/api.php?amount=10`;
      if (selectedCategory && selectedCategory.id !== 8) {
        url += `&category=${selectedCategory.id}`;
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
  
    const handleQuizComplete = (id: number, score: number) => {
      const today = new Date().toLocaleDateString();
      localStorage.setItem(`quiz_${id}`, JSON.stringify({ date: today, score }));
      setCategories((prevCategories) => {
        const updatedCategories = [...prevCategories];
        const index = updatedCategories.findIndex(cat => cat.id === id);
        if (index !== -1) {
          updatedCategories[index].score = score; // Update the score in state
        }
        return updatedCategories;
      });
      setSelectedCategory(undefined);
      setQuizStarted(false);
    };

    return (
        <div className="w-full overflow-hidden">
            {!quizStarted ? (
                <div className='flex flex-col h-full p-4 sm:mx-auto max-w-2xl justify-evenly gap-4'>
                    <div className='flex flex-col gap-4 overflow-hidden'>
                        <div className="text-xl font-semibold w-full text-center">Choose a Category</div>
                        <div className="flex flex-wrap justify-center gap-4 overflow-auto">
                            {categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    className={`flex flex-col relative h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-lg shadow-md border transition ${
                                        selectedCategory?.id === cat.id
                                            ? 'bg-blue-500 text-white'
                                            : `${cat.score !== undefined && cat.score !== null ? 'bg-primary-foreground/20' : 'bg-primary/70 hover:bg-primary cursor-pointer'}`
                                    }`}
                                    onClick={cat.score !== undefined && cat.score !== null  ? undefined : () => setSelectedCategory(cat)}>
                                    <cat.img className="h-8 w-8" />
                                    <div className="text-sm">{cat.name}</div>
                                    {cat.score !== undefined && cat.score !== null  && 
                                    <div className={`absolute diagonal-fractions leading-none top-0 text-xl text-end w-full px-1 ${cat.score < 6 ? 'text-red-800' : 'text-green-800' }`}>
                                        {cat.score + '/10'}
                                    </div>}
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        type="button"
                        className={`text-white bg-gradient-to-r from-cyan-500 to-blue-500 font-medium rounded-lg text-lg px-6 py-3 transition ${
                            !selectedCategory
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800'
                        }`}
                        onClick={handleStartClick}
                        disabled={selectedCategory === undefined}>
                        Start
                    </button>
                </div>
            ) : (
                <QuizSection selectedCategory={selectedCategory!} questions={questions} onComplete={handleQuizComplete} />
            )}
        </div>
    );
}