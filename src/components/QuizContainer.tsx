'use client';
import { useState } from 'react';
import QuizEngine from './QuizEngine';

export default function QuizContainer({ quizzes }: { quizzes: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex(prev => prev + 1);
  };

  return (
    <div>
      {/* 自分(QuizContainer)ではなく、QuizEngineを呼ぶ！ */}
      <QuizEngine 
        key={quizzes[currentIndex].id} 
        quiz={quizzes[currentIndex]} 
        onNext={handleNext} 
      />
    </div>
  );
}