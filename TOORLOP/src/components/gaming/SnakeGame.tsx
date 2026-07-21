
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Volume2, RefreshCw, ArrowRight } from 'lucide-react';

interface GameProps {
  onBack?: () => void;
}

const SnakeGame: React.FC<GameProps> = ({ onBack }) => {
  const [snake, setSnake] = useState([[10, 10]]);
  const [food, setFood] = useState([15, 15]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(150);
  
  const directionRef = useRef([0, -1]); // Start moving up
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const boardSize = 20;

  const generateFood = useCallback(() => {
    let newFood;
    do {
      newFood = [
        Math.floor(Math.random() * boardSize),
        Math.floor(Math.random() * boardSize)
      ];
    } while (snake.some(s => s[0] === newFood[0] && s[1] === newFood[1]));
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake([[10, 10]]);
    setFood(generateFood());
    directionRef.current = [0, -1];
    setScore(0);
    setSpeed(150);
    setGameOver(false);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const [dx, dy] = directionRef.current;
      switch (e.key) {
        case 'ArrowUp': if (dy !== 1) directionRef.current = [0, -1]; break;
        case 'ArrowDown': if (dy !== -1) directionRef.current = [0, 1]; break;
        case 'ArrowLeft': if (dx !== 1) directionRef.current = [-1, 0]; break;
        case 'ArrowRight': if (dx !== -1) directionRef.current = [1, 0]; break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (gameOver || isPaused) return;

    gameLoopRef.current = setInterval(() => {
      setSnake(prev => {
        const head = prev[0];
        const [dx, dy] = directionRef.current;
        const newHead = [head[0] + dx, head[1] + dy];

        // Wall Collision
        if (
          newHead[0] < 0 || newHead[0] >= boardSize ||
          newHead[1] < 0 || newHead[1] >= boardSize ||
          prev.some(s => s[0] === newHead[0] && s[1] === newHead[1])
        ) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [newHead, ...prev];
        
        // Food Collision
        if (newHead[0] === food[0] && newHead[1] === food[1]) {
          setScore(s => s + 1);
          setFood(generateFood());
          setSpeed(s => Math.max(50, s - 2)); // Increase speed
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameOver, isPaused, food, speed, generateFood]);

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
      <div className="flex justify-between w-full max-w-[300px] mb-4 text-xl font-bold px-2">
        <span>النتيجة: {score}</span>
        {gameOver ? <span className="text-red-500">انتهت اللعبة!</span> : <span className="text-green-400">العب الآن</span>}
      </div>
      
      <div 
        className="grid bg-gray-800 border-4 border-gray-700 rounded-lg shadow-2xl relative"
        style={{
          gridTemplateColumns: `repeat(${boardSize}, 15px)`,
          gridTemplateRows: `repeat(${boardSize}, 15px)`,
        }}
      >
        {Array.from({ length: boardSize * boardSize }).map((_, i) => {
          const x = i % boardSize;
          const y = Math.floor(i / boardSize);
          const isSnake = snake.some(s => s[0] === x && s[1] === y);
          const isFood = food[0] === x && food[1] === y;
          const isHead = snake[0][0] === x && snake[0][1] === y;
          
          return (
            <div 
              key={i}
              className={`w-full h-full border border-gray-800/10 transition-colors duration-100
                ${isHead ? 'bg-green-400 rounded-sm z-10' : isSnake ? 'bg-green-600 rounded-sm' : isFood ? 'bg-red-500 rounded-full scale-75 animate-pulse' : 'bg-gray-900'}
              `}
            />
          );
        })}
        
        {gameOver && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center flex-col z-20">
                <h3 className="text-2xl font-bold mb-2 text-white">انتهت اللعبة</h3>
                <p className="text-gray-300 mb-4">نتيجتك: {score}</p>
                <button onClick={resetGame} className="bg-fb-blue px-4 py-2 rounded-lg font-bold hover:bg-blue-600 transition">
                    إعادة المحاولة
                </button>
            </div>
        )}
      </div>

      <div className="mt-6 flex gap-4">
        <button onClick={() => setIsPaused(!isPaused)} disabled={gameOver} className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-full font-bold hover:bg-gray-600 transition disabled:opacity-50">
          {isPaused ? <Play className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          {isPaused ? 'استئناف' : 'إيقاف مؤقت'}
        </button>
        <button onClick={resetGame} className="flex items-center gap-2 bg-fb-blue px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition shadow-lg">
          <RefreshCw className="w-5 h-5" /> {gameOver ? 'لعبة جديدة' : 'إعادة'}
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-4">استخدم الأسهم للتحكم في الثعبان</p>
    </div>
  );
};

export default SnakeGame;
