import { IconType } from "react-icons";

export interface Question{
    category: string;
    correct_answer: string;
    difficulty: string;
    incorrect_answers: string[];
    question: string;
    type: string;
}

export interface Category{
    id: number;
    name: string;
    img: IconType;
    score?: number;
}