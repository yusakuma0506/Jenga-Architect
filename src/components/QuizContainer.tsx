'use client';
import { useState } from 'react';
import QuizEngine from './QuizEngine';
import { Quiz } from '@prisma/client';

export default function QuizContainer({ quizzes }: { quizzes: Quiz[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex(prev => prev + 1);
  };

  return (
    <div>
      <QuizEngine 
        key={quizzes[currentIndex].id} 
        quiz={quizzes[currentIndex]} 
        onNext={handleNext} 
      />
    </div>
  );
}