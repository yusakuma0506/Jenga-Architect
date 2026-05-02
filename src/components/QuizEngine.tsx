'use client';

import {useState, useEffect} from 'react';

interface QuizProps{
    quiz:{
        question: string;
        options: string[];
        answer: number[]
    };
    onNext: () => void;
}

export default function QuizEngine ({quiz, onNext}: QuizProps){
    const [selected, setSelected] = useState<number[]>([]);
    const [isLoad, setIsLoad] = useState(false);
    const [shuffledOptions, setShuffledOptions] = useState<{id:number, text:string}[]>([]);

    useEffect(()=>{
        const optionsWithId = quiz.options.map((text, index)=>({id: index, text: text}))
        setShuffledOptions([...optionsWithId].sort(()=> Math.random()- 0.5));

    },[quiz]);

    const handleSelect = (id: number)=>{
        if(!selected.includes(id)){
            setSelected([...selected, id]);
        }
    };

    const handleRemove = (id: number) =>{
        setSelected(selected.filter(item => item !== id))
    }

    const checkAnswer =() =>{
        setIsLoad(true);
        const isCorrect = JSON.stringify(selected) ===JSON.stringify(quiz.answer)
        if(isCorrect){
            alert("Correct");
            onNext();
        }else{
            alert("Incorrect");
            setSelected([]);
            setIsLoad(false);
        }
    };

    return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold text-center mb-4">{quiz.question}</h2>

      <div className="min-h-[200px] p-4 border-2 border-dashed border-gray-300 rounded-xl flex flex-wrap gap-2 items-center justify-center bg-gray-50">
        {selected.length === 0 && <span className="text-gray-400 text-sm">Make your answer here</span>}
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

      <div className="flex flex-wrap gap-3 justify-center mt-4">
        {shuffledOptions.map((opt) => {
          const isSelected = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              disabled={isSelected}
              onClick={() => handleSelect(opt.id)}
              className={`px-4 py-3 rounded-xl border-2 font-medium transition-all active:scale-95 
                ${isSelected 
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
        disabled={selected.length !== quiz.options.length || isLoad}
        className="mt-8 bg-green-500 text-white py-4 rounded-2xl font-bold text-lg disabled:bg-gray-300 shadow-lg active:translate-y-1 transition-all disabled:opacity-60"
      >
        {isLoad ? 'CHECKING...' : 'SOLVE'}
      </button>
    </div>
  );
}