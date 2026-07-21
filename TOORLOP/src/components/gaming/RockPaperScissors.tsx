
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface GameProps {
  onBack?: () => void;
}

const RockPaperScissors: React.FC<GameProps> = ({ onBack }) => {
  const [playerChoice, setPlayerChoice] = useState<string | null>(null);
  const [computerChoice, setComputerChoice] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [score, setScore] = useState({ player: 0, computer: 0 });

  const choices = [
    { id: 'rock', label: 'حجرة', icon: '✊' },
    { id: 'paper', label: 'ورقة', icon: '✋' },
    { id: 'scissors', label: 'مقص', icon: '✌️' }
  ];

  const playGame = (choice: string) => {
    const computer = choices[Math.floor(Math.random() * choices.length)].id;
    setPlayerChoice(choice);
    setComputerChoice(computer);
    determineWinner(choice, computer);
  };

  const determineWinner = (player: string, computer: string) => {
    if (player === computer) {
      setResult('تعادل!');
    } else if (
      (player === 'rock' && computer === 'scissors') ||
      (player === 'paper' && computer === 'rock') ||
      (player === 'scissors' && computer === 'paper')
    ) {
      setResult('أنت فزت! 🎉');
      setScore(s => ({ ...s, player: s.player + 1 }));
    } else {
      setResult('الكمبيوتر فاز! 🤖');
      setScore(s => ({ ...s, computer: s.computer + 1 }));
    }
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
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
      <h3 className="text-3xl font-bold mb-8 text-fb-blue">حجرة ورقة مقص</h3>
      
      <div className="flex justify-between w-full max-w-md px-10 mb-10">
        <div className="text-center">
          <span className="block text-2xl font-bold">{score.player}</span>
          <span className="text-gray-400">أنت</span>
        </div>
        <div className="text-center">
          <span className="block text-2xl font-bold">{score.computer}</span>
          <span className="text-gray-400">الكمبيوتر</span>
        </div>
      </div>

      {playerChoice && computerChoice ? (
        <div className="text-center animate-fadeIn">
          <div className="flex justify-center items-center gap-10 mb-6">
            <div className="text-center">
              <div className="text-6xl mb-2">{choices.find(c => c.id === playerChoice)?.icon}</div>
              <p className="text-sm text-gray-400">اختيارك</p>
            </div>
            <div className="text-2xl font-bold text-gray-600">VS</div>
            <div className="text-center">
              <div className="text-6xl mb-2">{choices.find(c => c.id === computerChoice)?.icon}</div>
              <p className="text-sm text-gray-400">الكمبيوتر</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-6 text-yellow-400">{result}</h2>
          <button onClick={resetGame} className="bg-fb-blue px-8 py-2 rounded-full font-bold hover:bg-blue-700 transition">
            لعب مرة أخرى
          </button>
        </div>
      ) : (
        <div className="flex gap-6">
          {choices.map(choice => (
            <button 
              key={choice.id} 
              onClick={() => playGame(choice.id)}
              className="w-24 h-24 bg-gray-800 rounded-full flex flex-col items-center justify-center hover:bg-gray-700 hover:scale-110 transition shadow-lg border-4 border-transparent hover:border-fb-blue"
            >
              <span className="text-4xl mb-1">{choice.icon}</span>
              <span className="text-xs font-bold">{choice.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RockPaperScissors;
