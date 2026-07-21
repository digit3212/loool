
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Maximize2, Minimize2, Share2, Star, Users, ArrowRight, Gamepad2, Play, Check, AlertCircle 
} from 'lucide-react';
import { Game } from '../../data/gamingData';
import TicTacToeGame from './TicTacToeGame';
import SnakeGame from './SnakeGame';
import MemoryGame from './MemoryGame';
import RockPaperScissors from './RockPaperScissors';
import MathQuiz from './MathQuiz';
import GamingShareModal from './GamingShareModal';

interface GameModalProps {
  game: Game;
  onClose: () => void;
}

const GameModal: React.FC<GameModalProps> = ({ game, onClose }) => {
  const [isPlayingGame, setIsPlayingGame] = useState(false);
  const [gameLoadingProgress, setGameLoadingProgress] = useState(0);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info' | 'error'} | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameLoadInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Game Loading Simulation
  useEffect(() => {
      // Only simulate loading for NON-playable games (the mock ones)
      if (game && isPlayingGame && !game.isPlayable) {
          setGameLoadingProgress(0);
          gameLoadInterval.current = setInterval(() => {
              setGameLoadingProgress(prev => {
                  if (prev >= 100) {
                      if (gameLoadInterval.current) clearInterval(gameLoadInterval.current);
                      return 100;
                  }
                  return prev + 10;
              });
          }, 200);
      } else if (!isPlayingGame) {
          setGameLoadingProgress(0);
      }
      return () => {
          if (gameLoadInterval.current) clearInterval(gameLoadInterval.current);
      };
  }, [game, isPlayingGame]);

  const showNotification = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message: msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handlePlayGame = (e?: any) => {
      e?.stopPropagation?.();
      setIsPlayingGame(true);
  };

  const handleCloseGame = (e?: any) => {
      e?.stopPropagation?.();
      // If playing, go back to details, else close modal
      if (isPlayingGame) {
          setIsPlayingGame(false);
      } else {
          onClose();
      }
  };

  const toggleGameFullscreen = (e?: any) => {
    e?.stopPropagation?.();
    if (!document.fullscreenElement) {
      gameContainerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleReport = () => {
    showNotification('تم إرسال البلاغ عن اللعبة', 'success');
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm">
      
      {notification && (
          <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg z-[10000] animate-bounce-in flex items-center gap-2 text-white ${notification.type === 'error' ? 'bg-red-600' : notification.type === 'info' ? 'bg-blue-600' : 'bg-gray-900'}`}>
            {notification.type === 'success' ? <Check className="w-5 h-5 text-green-400" /> : <AlertCircle className="w-5 h-5 text-white" />}
            {notification.message}
          </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden relative animate-scaleIn">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <button 
                 onClick={onClose}
                 className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-3 py-1.5 rounded-full font-bold flex items-center gap-2 transition text-sm mr-2"
               >
                   <ArrowRight className="w-4 h-4 rtl:rotate-180" /> العودة للألعاب
               </button>
            <img src={game.image} className="w-12 h-12 rounded-lg object-cover shadow-sm" alt="icon" />
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">{game.title}</h3>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Users className="w-3 h-3" /> {game.players} لاعب
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition" onClick={toggleGameFullscreen}><Maximize2 className="w-5 h-5 text-gray-600 dark:text-gray-300" /></button>
            <button onClick={handleShare} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"><Share2 className="w-5 h-5 text-gray-600 dark:text-gray-300" /></button>
            <button onClick={onClose} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition text-gray-600 dark:text-gray-300 hover:text-red-500"><X className="w-6 h-6" /></button>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex-1 bg-black relative flex items-center justify-center group overflow-hidden" ref={gameContainerRef}>
          {/* If game is playable, render actual component. Else use simulation */}
          {game.isPlayable && isPlayingGame ? (
              <div className="w-full h-full bg-gray-900 overflow-auto relative">
                  {/* Back Button within Game Area (Z-Index increased) */}
                  <div className="absolute top-4 left-4 z-[50]">
                       <button 
                         onClick={handleCloseGame}
                         className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md px-3 py-1.5 rounded-full font-bold flex items-center gap-2 transition border border-white/20 shadow-lg text-sm"
                       >
                           <ArrowRight className="w-4 h-4 rtl:rotate-180" /> خروج
                       </button>
                  </div>

                  {game.id === 'tic-tac-toe' && <TicTacToeGame onBack={() => handleCloseGame()} />}
                  {game.id === 'snake' && <SnakeGame onBack={() => handleCloseGame()} />}
                  {game.id === 'memory' && <MemoryGame onBack={() => handleCloseGame()} />}
                  {game.id === 'rock-paper-scissors' && <RockPaperScissors onBack={() => handleCloseGame()} />}
                  {game.id === 'math-quiz' && <MathQuiz onBack={() => handleCloseGame()} />}
              </div>
          ) : isPlayingGame ? (
              // Original Simulation Logic for Commercial Games
              <div className="w-full h-full flex flex-col items-center justify-center text-white bg-gray-900">
                  {gameLoadingProgress < 100 ? (
                      <div className="text-center">
                          <div className="w-16 h-16 border-4 border-fb-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                          <h3 className="text-xl font-bold">جاري تحميل اللعبة...</h3>
                          <div className="w-64 h-2 bg-gray-700 rounded-full mt-4 overflow-hidden">
                              <div className="h-full bg-fb-blue transition-all duration-200" style={{ width: `${gameLoadingProgress}%` }}></div>
                          </div>
                      </div>
                  ) : (
                      <div className="text-center animate-fadeIn">
                          <h2 className="text-4xl font-bold mb-4 text-fb-blue">{game.title}</h2>
                          <p className="text-xl text-gray-300 mb-8">اللعبة جاهزة! (محاكاة)</p>
                          <Gamepad2 className="w-32 h-32 text-gray-700 mx-auto animate-bounce" />
                      </div>
                  )}
              </div>
          ) : (
              // Pre-Play Screen (Shared)
              <div className="text-center text-white animate-pulse relative z-10">
                <div className="w-24 h-24 mx-auto mb-6 bg-fb-blue rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50">
                <Gamepad2 className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-bold mb-2">{game.title}</h2>
                <p className="text-gray-400">استعد للمرح!</p>
            </div>
          )}
          
          {/* Background Image Effect (Only when NOT playing) */}
          {!isPlayingGame && (
              <img src={game.image} className="absolute inset-0 w-full h-full object-cover opacity-20 blur-md" alt="bg" />
          )}

          {/* Controls Overlay (Only when NOT playing) */}
          {!isPlayingGame && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-20">
                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full font-bold border border-white/20 transition">
                    كتم الصوت
                </button>
                <button 
                    onClick={handlePlayGame}
                    className="bg-fb-blue hover:bg-blue-600 text-white px-8 py-2 rounded-full font-bold shadow-lg transition transform hover:scale-105 flex items-center gap-2"
                >
                    <Play className="w-5 h-5 fill-current" /> بدء اللعب
                </button>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300">
           <div className="flex justify-between items-center">
              <div className="flex gap-6 items-center">
                 <span className="flex items-center gap-1 font-bold text-gray-800 dark:text-white"><Star className="w-4 h-4 text-yellow-500 fill-current" /> {game.rating}/5</span>
                 <span>فئة: {game.category}</span>
                 {game.description && <span className="text-gray-500 hidden sm:inline">- {game.description}</span>}
              </div>
              <button onClick={handleReport} className="text-fb-blue hover:underline font-medium">إبلاغ عن مشكلة</button>
           </div>
        </div>
      </div>

      {/* Advanced Share Modal for Gaming rendered via Portal */}
      {showShareModal && createPortal(
          <GamingShareModal 
            item={{
                id: game.id,
                title: game.title,
                image: game.image,
                type: 'game'
            }} 
            onClose={() => setShowShareModal(false)} 
          />,
          document.body
      )}
    </div>
  );
};

export default GameModal;
