
import React, { useState } from 'react';
import { RefreshCw, ArrowRight } from 'lucide-react';

interface GameProps {
  onBack?: () => void;
}

const TicTacToeGame: React.FC<GameProps> = ({ onBack }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  
  const calculateWinner = (squares: any[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(Boolean);

  const handleClick = (i: number) => {
    if (winner || board[i]) return;
    const newBoard = [...board];
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
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
      <h3 className="text-3xl font-bold mb-6 text-fb-blue drop-shadow-lg">
        {winner ? `الفائز: ${winner} 🎉` : isDraw ? 'تعادل! 🤝' : `الدور على: ${xIsNext ? 'X' : 'O'}`}
      </h3>
      <div className="grid grid-cols-3 gap-3 bg-gray-800 p-4 rounded-xl shadow-2xl">
        {board.map((square, i) => (
          <button
            key={i}
            className={`w-20 h-20 sm:w-24 sm:h-24 text-4xl sm:text-5xl font-bold flex items-center justify-center rounded-lg transition-all duration-200 
              ${square === 'X' ? 'text-blue-400 bg-gray-700' : square === 'O' ? 'text-red-400 bg-gray-700' : 'bg-gray-600 hover:bg-gray-500'}`}
            onClick={() => handleClick(i)}
          >
            {square}
          </button>
        ))}
      </div>
      <button 
        onClick={resetGame}
        className="mt-8 flex items-center gap-2 bg-fb-blue px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition shadow-lg"
      >
        <RefreshCw className="w-5 h-5" /> لعبة جديدة
      </button>
    </div>
  );
};

export default TicTacToeGame;
