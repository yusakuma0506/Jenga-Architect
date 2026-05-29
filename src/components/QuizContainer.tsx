'use client';

import { useState } from 'react';
import QuizEngine from './QuizEngine';
import type { PublicQuiz } from '@/lib/quiz';

export default function QuizContainer({ quizzes }: { quizzes: PublicQuiz[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (quizzes.length === 0) {
    return <div className="text-center p-10 font-bold">No quizzes available.</div>;
  }

  if (currentIndex >= quizzes.length) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-black mb-2">Session Complete!</h2>
        <p className="text-slate-500">You finished all {quizzes.length} questions.</p>
      </div>
    );
  }

  const handleCorrect = async () => {
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div>
      <p className="text-center text-sm text-slate-400 mb-4 font-bold">
        Question {currentIndex + 1} / {quizzes.length}
      </p>
      <QuizEngine
        key={quizzes[currentIndex].id}
        quiz={quizzes[currentIndex]}
        onCorrect={handleCorrect}
      />
    </div>
  );
}
