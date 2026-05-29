'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { attemptQuizAnswer } from '@/actions/score';
import type { PublicQuiz } from '@/lib/quiz';
import {
  CORRECT_POINTS_BY_LEVEL,
  MAX_QUIZ_ATTEMPTS,
  WRONG_ANSWER_PENALTY,
} from '@/lib/multiplayer-scoring';
import { Level } from '@prisma/client';

type MultiQuizClientProps = {
  quiz: PublicQuiz;
  roomCode: string;
  level: Level;
  attemptsRemaining: number;
  attemptsUsed: number;
};

type Option = { id: number; text: string };

export default function MultiQuizClient({
  quiz,
  roomCode,
  level,
  attemptsRemaining: initialRemaining,
  attemptsUsed: initialUsed,
}: MultiQuizClientProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<number[]>([]);
  const [isLoad, setIsLoad] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<Option[]>([]);
  const [attemptsRemaining, setAttemptsRemaining] = useState(initialRemaining);
  const [attemptsUsed, setAttemptsUsed] = useState(initialUsed);
  const [totalScore, setTotalScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const correctPoints = CORRECT_POINTS_BY_LEVEL[level];

  useEffect(() => {
    const optionsWithId = quiz.options.map((text, index) => ({ id: index, text }));
    setShuffledOptions([...optionsWithId].sort(() => Math.random() - 0.5));
  }, [quiz]);

  const handleSelect = (id: number) => {
    if (!selected.includes(id)) {
      setSelected([...selected, id]);
    }
  };

  const handleRemove = (id: number) => {
    setSelected(selected.filter((item) => item !== id));
  };

  const checkAnswer = async () => {
    if (isLoad || attemptsRemaining <= 0) return;
    setIsLoad(true);
    setFeedback(null);

    const result = await attemptQuizAnswer({
      quizId: quiz.id,
      roomCode,
      selected,
    });

    if (!result.success) {
      setFeedback(result.error ?? 'Something went wrong');
      setIsLoad(false);
      if (result.alreadySolved) {
        router.push(`/play/multi/${roomCode}/board`);
      }
      return;
    }

    setAttemptsUsed(result.attemptsUsed ?? attemptsUsed + 1);
    setAttemptsRemaining(result.attemptsRemaining ?? 0);
    setTotalScore(result.newTotalScore ?? null);

    if (result.correct) {
      setFeedback(`Correct! +${result.pointsChange} pts (Total: ${result.newTotalScore})`);
      setTimeout(() => router.push(`/play/multi/${roomCode}/board`), 1200);
      return;
    }

    setFeedback(
      `Incorrect. ${result.pointsChange} pts (Total: ${result.newTotalScore}). ${result.attemptsRemaining} attempt(s) left.`
    );
    setSelected([]);
    setIsLoad(false);

    if (result.completed) {
      setTimeout(() => router.push(`/play/multi/${roomCode}/board`), 1500);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto p-4">
      <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-500">
        <span>
          Reward: +{correctPoints} / Wrong: -{WRONG_ANSWER_PENALTY}
        </span>
        <span>
          Attempts: {attemptsUsed}/{MAX_QUIZ_ATTEMPTS}
        </span>
      </div>

      {feedback && (
        <div
          className={`text-center text-sm font-bold p-3 rounded-xl border-2 ${
            feedback.startsWith('Correct')
              ? 'bg-green-50 border-green-400 text-green-800'
              : 'bg-rose-50 border-rose-300 text-rose-800'
          }`}
        >
          {feedback}
          {totalScore !== null && !feedback.includes('Total') && (
            <span> Total: {totalScore}</span>
          )}
        </div>
      )}

      <h2 className="text-xl font-bold text-center mb-2">{quiz.question}</h2>

      <div className="min-h-[200px] p-4 border-2 border-dashed border-gray-300 rounded-xl flex flex-wrap gap-2 items-center justify-center bg-gray-50">
        {selected.length === 0 && (
          <span className="text-gray-400 text-sm">Make your answer here</span>
        )}
        {selected.map((id) => (
          <button
            key={id}
            onClick={() => handleRemove(id)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md active:scale-95 transition-transform"
          >
            {quiz.options[id]}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 justify-center mt-2">
        {shuffledOptions.map((opt) => {
          const isSelected = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              disabled={isSelected || isLoad || attemptsRemaining <= 0}
              onClick={() => handleSelect(opt.id)}
              className={`px-4 py-3 rounded-xl border-2 font-medium transition-all active:scale-95 
                ${
                  isSelected
                    ? 'bg-gray-200 border-gray-200 text-transparent'
                    : 'bg-white border-gray-300 shadow-sm hover:border-blue-400'
                }`}
            >
              {opt.text}
            </button>
          );
        })}
      </div>

      <button
        onClick={checkAnswer}
        disabled={
          selected.length !== quiz.options.length ||
          isLoad ||
          attemptsRemaining <= 0
        }
        className="mt-4 bg-green-500 text-white py-4 rounded-2xl font-bold text-lg disabled:bg-gray-300 shadow-lg active:translate-y-1 transition-all disabled:opacity-60"
      >
        {isLoad ? 'CHECKING...' : attemptsRemaining <= 0 ? 'NO ATTEMPTS LEFT' : 'SOLVE'}
      </button>

      <button
        onClick={() => router.push(`/play/multi/${roomCode}/board`)}
        className="text-sm font-bold text-slate-400 hover:text-slate-700"
      >
        ← Back to Board
      </button>
    </div>
  );
}
