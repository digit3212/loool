
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Gamepad2, Play, Heart, Share2, Search, Users, Video, Star, Zap, LogOut, Check, AlertCircle, Bookmark,
  Facebook, Twitter, Phone, Copy, X, CheckCircle
} from 'lucide-react';
import { User } from '../types';
import { 
  CATEGORIES, 
  MOCK_GAMES, 
  MOCK_STREAMS, 
  Game, 
  Stream 
} from '../data/gamingData';
import GameModal from './gaming/GameModal';
import StreamViewerModal from './gaming/StreamViewerModal';
import GamingShareModal from './gaming/GamingShareModal';
import { useLanguage } from '../context/LanguageContext';

interface GamingProps {
  currentUser: User;
  onBack?: () => void;
}

const Gaming: React.FC<GamingProps> = ({ currentUser, onBack }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'play' | 'video' | 'saved'>('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null);
  const [followedGames, setFollowedGames] = useState<string[]>([]);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info' | 'error'} | null>(null);
  const { dir, language } = useLanguage();
  
  // Advanced Share Modal State
  const [showShareModal, setShowShareModal] = useState(false);
  const [itemToShare, setItemToShare] = useState<{id: string, title: string, image?: string, thumbnail?: string, type: 'game' | 'stream'} | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Filter Logic
  const filteredGames = MOCK_GAMES.filter(g => {
    const matchesSearch = g.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || g.category === CATEGORIES.find(c => c.id === activeCategory)?.name;
    const matchesSaved = activeTab === 'saved' ? followedGames.includes(g.id) : true;
    return matchesSearch && matchesCategory && matchesSaved;
  });

  const filteredStreams = MOCK_STREAMS.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.streamerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showNotification = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message: msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleFollowGame = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (followedGames.includes(id)) {
      setFollowedGames(prev => prev.filter(g => g !== id));
      showNotification('تم إلغاء متابعة اللعبة', 'info');
    } else {
      setFollowedGames(prev => [...prev, id]);
      showNotification('تمت متابعة اللعبة بنجاح', 'success');
    }
  };

  // Improved Share Handlers to open the new modal
  const handleShareGame = (game: Game, e: React.MouseEvent) => {
      e.stopPropagation();
      setItemToShare({
          id: game.id,
          title: game.title,
          image: game.image,
          type: 'game'
      });
      setShowShareModal(true);
  };

  const handleShareStream = (stream: Stream, e: React.MouseEvent) => {
      e.stopPropagation();
      setItemToShare({
          id: stream.id,
          title: stream.title,
          thumbnail: stream.thumbnail,
          type: 'stream'
      });
      setShowShareModal(true);
  };

  return (
    <>
    <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-md min-h-[calc(100vh-64px)] flex transition-colors duration-300 animate-fadeIn" dir={dir}>
      
      <style>{`
        @keyframes floatUp {
            0% { transform: translateY(0) scale(0.5); opacity: 0; }
            10% { opacity: 1; transform: translateY(-20px) scale(1.2); }
            100% { transform: translateY(-300px) scale(1); opacity: 0; }
        }
        .animate-float {
            animation: floatUp 2s ease-out forwards;
        }
      `}</style>

      {/* Sidebar - Cover with glass logic */}
      <div className="w-80 hidden lg:flex flex-col sticky top-16 h-[calc(100vh-64px)] overflow-y-auto p-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border-l border-white/20 dark:border-gray-700/50 z-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
          <Gamepad2 className="w-8 h-8 text-fb-blue" /> الألعاب
        </h2>
        
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-300 group-focus-within:text-fb-blue transition-colors" />
          <input 
            type="text" 
            placeholder="بحث عن ألعاب وبثوث..." 
            className="w-full bg-white/40 dark:bg-gray-700/40 backdrop-blur-sm rounded-full py-2.5 pr-10 pl-4 outline-none text-sm focus:ring-2 focus:ring-fb-blue transition dark:text-white dark:placeholder-gray-400 border border-white/20 dark:border-gray-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Navigation */}
        <div className="space-y-1 mb-6 flex-1">
          <button 
            onClick={() => setActiveTab('home')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition backdrop-blur-sm ${activeTab === 'home' ? 'bg-fb-blue text-white hover:bg-[#1D4ED8]' : 'text-gray-700 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-gray-700/40'}`}
          >
            <div className={`p-2 rounded-full ${activeTab === 'home' ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}><Gamepad2 className="w-5 h-5" /></div>
            الصفحة الرئيسية
          </button>
          <button 
            onClick={() => setActiveTab('play')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition backdrop-blur-sm ${activeTab === 'play' ? 'bg-fb-blue text-white hover:bg-[#1D4ED8]' : 'text-gray-700 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-gray-700/40'}`}
          >
            <div className={`p-2 rounded-full ${activeTab === 'play' ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}><Zap className="w-5 h-5" /></div>
            ألعاب فورية
          </button>
          <button 
            onClick={() => setActiveTab('video')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition backdrop-blur-sm ${activeTab === 'video' ? 'bg-fb-blue text-white hover:bg-[#1D4ED8]' : 'text-gray-700 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-gray-700/40'}`}
          >
            <div className={`p-2 rounded-full ${activeTab === 'video' ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}><Video className="w-5 h-5" /></div>
            بث مباشر
          </button>
          <button 
            onClick={() => setActiveTab('saved')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition backdrop-blur-sm ${activeTab === 'saved' ? 'bg-fb-blue text-white hover:bg-[#1D4ED8]' : 'text-gray-700 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-gray-700/40'}`}
          >
            <div className={`p-2 rounded-full ${activeTab === 'saved' ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}><Bookmark className="w-5 h-5" /></div>
            ألعاب محفوظة
          </button>
        </div>
        
        {/* Back to Main Menu Button */}
        {onBack && (
            <div className="mt-auto pt-4 border-t border-white/20 dark:border-gray-700">
                <button 
                    onClick={onBack}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl font-bold text-red-600 dark:text-red-400 hover:bg-red-50/20 dark:hover:bg-red-900/20 transition backdrop-blur-sm shadow-sm"
                >
                    <LogOut className="w-5 h-5 rtl:rotate-180" />
                    العودة للقائمة الرئيسية
                </button>
            </div>
        )}

        {/* Categories Section */}
        <div className="mt-4 border-t border-white/20 dark:border-gray-700 pt-4 mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3 px-2">الفئات</h3>
            <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map(cat => (
                <button 
                    key={cat.id} 
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition duration-200 border backdrop-blur-sm ${
                        activeCategory === cat.id 
                        ? 'bg-fb-blue text-white border hover:bg-[#1D4ED8]' 
                        : 'bg-white/20 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border-white/10 dark:border-gray-600 hover:bg-white/40 dark:hover:bg-gray-700'
                    }`}
                >
                    <cat.icon className={`w-3.5 h-3.5 ${activeCategory === cat.id ? 'text-white' : 'text-fb-blue'}`} />
                    <span className="truncate">{cat.name}</span>
                </button>
            ))}
            </div>
        </div>
     </div>
        
      {/* Main Content - Transparent Glass Background white/40 */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto h-full relative bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border-r border-white/10 dark:border-gray-700/50 transition-all duration-300">
        
        {/* Featured Hero */}
        {activeTab === 'home' && !searchTerm && activeCategory === 'all' && (
          <div className="relative rounded-2xl overflow-hidden mb-8 h-64 md:h-80 shadow-lg group cursor-pointer border border-white/20 dark:border-gray-700">
            <img src="https://picsum.photos/1200/400?random=999" alt="Featured" className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
              <div className="absolute bottom-6 right-6 text-white max-w-lg">
                <span className="bg-red-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full mb-3 inline-block animate-pulse shadow-md border border-white/10">مباشر الآن</span>
                <h2 className="text-3xl font-extrabold mb-2 drop-shadow-md">نهائيات البطولة الكبرى</h2>
                <p className="text-gray-200 mb-4 line-clamp-2 drop-shadow-sm font-medium">شاهد أفضل اللاعبين يتنافسون على اللقب في معركة ملحمية لا تفوت!</p>
                <button 
                    onClick={() => setActiveTab('video')}
                    className="bg-fb-blue hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 transition shadow-lg transform hover:scale-105 backdrop-blur-md border border-white/10"
                >
                  <Play className="w-5 h-5 fill-current" /> مشاهدة البث
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Section: Live Streams */}
        {(activeTab === 'home' || activeTab === 'video') && filteredStreams.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4 px-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Video className="w-6 h-6 text-red-500" /> مباشر الآن
              </h3>
              <button onClick={() => setActiveTab('video')} className="text-fb-blue text-sm font-bold bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 dark:border-gray-700 hover:bg-white/60 dark:hover:bg-gray-700 transition shadow-sm">عرض الكل</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredStreams.map(stream => (
                <div key={stream.id} className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group border border-white/30 dark:border-gray-700/50" onClick={() => setSelectedStream(stream)}>
                  <div className="relative aspect-video overflow-hidden">
                    <img src={stream.thumbnail} alt={stream.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                    <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md backdrop-blur-md border border-white/20">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> مباشر
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-md border border-white/10">
                      {stream.viewers} مشاهد
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                      <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30 shadow-2xl scale-75 group-hover:scale-100 transition duration-300">
                        <Play className="w-8 h-8 text-white fill-current" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 flex gap-3">
                    <img src={stream.streamerAvatar} alt={stream.streamerName} className="w-10 h-10 rounded-full border-2 border-fb-blue object-cover shadow-sm flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 dark:text-white truncate mb-0.5 group-hover:text-fb-blue transition">{stream.title}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">{stream.streamerName}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-fb-blue bg-blue-50/50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full font-bold border border-blue-100 dark:border-blue-900/40">{stream.gameName}</span>
                        <button 
                            onClick={(e) => handleShareStream(stream, e)}
                            className="mr-auto p-1.5 text-gray-400 hover:text-fb-blue hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                            title="مشاركة"
                        >
                            <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section: Instant Games */}
        {(activeTab === 'home' || activeTab === 'play') && filteredGames.some(g => g.isInstant) && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4 px-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-500" /> ألعاب فورية
              </h3>
              <button onClick={() => setActiveTab('play')} className="text-fb-blue text-sm font-bold bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 dark:border-gray-700 hover:bg-white/60 dark:hover:bg-gray-700 transition shadow-sm">عرض الكل</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredGames.filter(g => g.isInstant).map(game => (
                <div key={game.id} className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md rounded-2xl p-3 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer relative group border border-white/30 dark:border-gray-700/50" onClick={() => setSelectedGame(game)}>
                  <div className="aspect-square rounded-xl overflow-hidden mb-3 relative">
                    <img src={game.image} alt={game.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                    {game.isPlayable && (
                        <div className="absolute top-2 right-2 bg-green-600/90 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-md backdrop-blur-md border border-white/20">
                            حقيقية
                        </div>
                    )}
                    <div className="absolute top-2 left-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button 
                          onClick={(e) => toggleFollowGame(game.id, e)}
                          className={`p-2 rounded-full backdrop-blur-md shadow-md transition ${followedGames.includes(game.id) ? 'bg-emerald-600 text-white' : 'bg-black/30 text-white hover:bg-white hover:text-emerald-600'}`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${followedGames.includes(game.id) ? 'fill-current' : ''}`} />
                        </button>
                        <button 
                          onClick={(e) => handleShareGame(game, e)}
                          className="p-2 rounded-full backdrop-blur-md shadow-md transition bg-black/30 text-white hover:bg-white hover:text-fb-blue"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-center mb-1 truncate text-[14px] px-1">{game.title}</h4>
                  <p className="text-[11px] text-center text-gray-500 dark:text-gray-400 mb-3 font-medium">{game.category}</p>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedGame(game); }}
                    className="w-full bg-fb-blue text-white font-bold py-2 rounded-xl text-sm transition-all shadow-sm hover:shadow-lg hover:bg-blue-700 border border-white/10"
                  >
                    لعب الآن
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section: Suggested Games */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 px-1">
            {activeTab === 'saved' ? <Bookmark className="w-6 h-6 text-fb-blue" /> : <Star className="w-6 h-6 text-orange-500" />} 
            {activeTab === 'saved' ? 'ألعابك المحفوظة' : (activeCategory === 'all' ? 'مقترح لك' : `ألعاب ${CATEGORIES.find(c => c.id === activeCategory)?.name}`)}
          </h3>
          {filteredGames.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredGames.map(game => (
                <div key={game.id} className="flex items-center gap-5 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md p-4 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-white/30 dark:border-gray-700/50" onClick={() => setSelectedGame(game)}>
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <img src={game.image} alt={game.title} className="w-full h-full rounded-xl object-cover shadow-sm border border-white/20" />
                      {game.isPlayable && <div className="absolute -top-2 -right-2 bg-green-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-white shadow-sm">Real</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg hover:text-fb-blue transition flex items-center gap-2">
                        <span className="truncate">{game.title}</span>
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium">
                        <span>{game.category}</span>
                        <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {game.players}</span>
                    </div>
                    <div className="flex gap-3">
                        <button className="bg-fb-blue text-white px-5 py-1.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-md border border-white/10">
                        {game.isInstant ? 'لعب' : 'متابعة'}
                        </button>
                        <button 
                            onClick={(e) => handleShareGame(game, e)}
                            className="bg-white/40 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-xl hover:bg-white/60 dark:hover:bg-gray-600 transition border border-white/20 dark:border-gray-600"
                        >
                        <Share2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => toggleFollowGame(game.id, e)}
                          className={`px-3 py-1.5 rounded-xl transition-all duration-300 border ${followedGames.includes(game.id) ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-white/40 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 border-white/20 dark:border-gray-600 hover:bg-white/60'}`}
                        >
                          <Heart className={`w-4 h-4 ${followedGames.includes(game.id) ? 'fill-current text-green-700' : ''}`} />
                        </button>
                    </div>
                    </div>
                </div>
                ))}
            </div>
          ) : (
              <div className="text-center py-20 text-gray-500 dark:text-gray-400 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl border border-dashed border-white/30 dark:border-gray-700">
                  <Gamepad2 className="w-16 h-16 mx-auto mb-3 opacity-20" />
                  <p className="font-bold">{activeTab === 'saved' ? 'لا توجد ألعاب محفوظة.' : 'لا توجد ألعاب في هذه الفئة حالياً.'}</p>
              </div>
          )}
        </div>

      </div>
    </div>

      {selectedGame && (
        <GameModal 
          game={selectedGame}
          onClose={() => setSelectedGame(null)}
        />
      )}

      {selectedStream && (
        <StreamViewerModal 
          stream={selectedStream}
          currentUser={currentUser}
          onClose={() => setSelectedStream(null)}
        />
      )}

      {/* Advanced Share Modal for Gaming rendered via Portal */}
      {showShareModal && itemToShare && createPortal(
          <GamingShareModal 
            item={itemToShare} 
            onClose={() => setShowShareModal(false)} 
          />,
          document.body
      )}

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-[100000] animate-bounce-in">
            <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-white backdrop-blur-md border border-white/10 ${notification.type === 'success' ? 'bg-emerald-600' : 'bg-blue-600'}`}>
                {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <span className="font-medium text-sm">{notification.message}</span>
                <button onClick={() => setNotification(null)} className="mr-2 text-white/80 hover:text-white transition">
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
      )}
    </>
  );
};

export default Gaming;
