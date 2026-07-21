
import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface GameProps {
  onBack?: () => void;
}

const MemoryGame: React.FC<GameProps> = ({ onBack }) => {
  const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
  const [cards, setCards] = useState<{id: number, emoji: string, isFlipped: boolean, isMatched: boolean}[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      }));
    setCards(shuffled);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
  };

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);
    
    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [firstIndex, secondIndex] = newFlipped;
      if (cards[firstIndex].emoji === cards[secondIndex].emoji) {
        setMatchedPairs(p => p + 1);
        setCards(prev => prev.map((c, i) => 
          i === firstIndex || i === secondIndex ? { ...c, isMatched: true } : c
        ));
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map((c, i) => 
            i === firstIndex || i === secondIndex ? { ...c, isFlipped: false } : c
          ));
          setFlippedCards([]);
        }, 1000);
      }
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
      <div className="flex justify-between w-full max-w-md mb-6 px-4">
        <span className="font-bold text-xl">الحركات: {moves}</span>
        {matchedPairs === emojis.length && <span className="text-green-400 font-bold text-xl animate-bounce">مبروك! 🎉</span>}
        <button onClick={resetGame} className="text-sm bg-gray-700 px-3 py-1 rounded hover:bg-gray-600 transition">إعادة</button>
      </div>

      <div className="grid grid-cols-4 gap-3 bg-gray-800 p-4 rounded-xl shadow-xl">
        {cards.map((card, index) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(index)}
            className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-3xl sm:text-4xl rounded-lg cursor-pointer transition-all duration-300 transform perspective-1000
              ${card.isFlipped || card.isMatched ? 'bg-white rotate-y-180' : 'bg-fb-blue hover:bg-blue-600'}
            `}
          >
            {(card.isFlipped || card.isMatched) ? card.emoji : '?'}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemoryGame;
