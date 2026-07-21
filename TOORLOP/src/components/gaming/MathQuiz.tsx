
import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface GameProps {
  onBack?: () => void;
}

const MathQuiz: React.FC<GameProps> = ({ onBack }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setGameOver(true);
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const generateQuestion = () => {
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    setQuestion(`${a} ${op} ${b}`);
    // Calculate answer
    if (op === '+') setAnswer(a + b);
    if (op === '-') setAnswer(a - b);
    if (op === '*') setAnswer(a * b);
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsActive(true);
    setGameOver(false);
    setUserAnswer('');
    generateQuestion();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(userAnswer) === answer) {
      setScore(s => s + 10);
      setTimeLeft(t => t + 2); // Bonus time
      setUserAnswer('');
      generateQuestion();
    } else {
      setTimeLeft(t => Math.max(0, t - 5)); // Penalty
      setUserAnswer('');
      // Shake animation effect could be added here
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-white bg-gray-900 w-full relative">
      {onBack && (
        <div className="absolute top-4 left-4 z-50">
          <button 
            onClick={onBack}
            className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md px-3 py-1.5 rounded-full font-bold flex items-center gap-2 transition border border-white/20 shadow-lg text-sm"
          >
              <ArrowRight className="w-4 h-4 rtl:rotate-180" /> خروج
          </button>
        </div>
      )}
      {!isActive && !gameOver ? (
        <div className="text-center">
          <h3 className="text-4xl font-bold mb-4 text-fb-blue">تحدي الرياضيات</h3>
          <p className="text-gray-300 mb-8">حل أكبر عدد من المسائل في 30 ثانية!</p>
          <button onClick={startGame} className="bg-green-500 hover:bg-green-600 px-10 py-3 rounded-full font-bold text-xl transition shadow-lg transform hover:scale-105">
            ابدأ اللعب
          </button>
        </div>
      ) : gameOver ? (
        <div className="text-center">
          <h3 className="text-4xl font-bold mb-2 text-red-500">انتهى الوقت!</h3>
          <p className="text-2xl text-white mb-8">النتيجة النهائية: <span className="font-bold text-yellow-400">{score}</span></p>
          <button onClick={startGame} className="bg-fb-blue px-8 py-2 rounded-full font-bold hover:bg-blue-700 transition">
            إعادة المحاولة
          </button>
        </div>
      ) : (
        <div className="text-center w-full max-w-sm">
          <div className="flex justify-between mb-8 text-xl font-bold">
            <div className="bg-gray-800 px-4 py-2 rounded-lg text-yellow-400">⏳ {timeLeft}ث</div>
            <div className="bg-gray-800 px-4 py-2 rounded-lg text-green-400">⭐ {score}</div>
          </div>
          
          <div className="bg-white text-gray-900 text-5xl font-bold py-10 rounded-xl mb-6 shadow-2xl">
            {question}
          </div>

          <form onSubmit={handleSubmit}>
            <input 
              type="number" 
              autoFocus
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full bg-gray-800 border-2 border-gray-600 rounded-xl py-4 px-6 text-3xl text-center text-white outline-none focus:border-fb-blue transition"
              placeholder="?"
            />
          </form>
          <p className="text-gray-500 mt-4 text-sm">اضغط Enter للإجابة</p>
        </div>
      )}
    </div>
  );
};

export default MathQuiz;
