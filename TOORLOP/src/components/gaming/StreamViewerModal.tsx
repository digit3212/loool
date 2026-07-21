
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, ArrowRight, Play, VolumeX, Volume2, Minimize2, Maximize2, Users, Send, Heart, Share2, Flag, 
  Facebook, Twitter, Phone, Copy, AlertTriangle, Loader2, Check, AlertCircle
} from 'lucide-react';
import { Stream, REACTION_EMOJIS } from '../../data/gamingData';
import { User } from '../../types';
import GamingShareModal from './GamingShareModal';

interface StreamViewerModalProps {
  stream: Stream;
  currentUser: User;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  user: string;
  text: string;
  color: string;
}

interface FloatingEmoji {
  id: number;
  char: string;
  left: number;
}

const StreamViewerModal: React.FC<StreamViewerModalProps> = ({ stream, currentUser, onClose }) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isStreamerFollowed, setIsStreamerFollowed] = useState(false);
  const [isStreamLiked, setIsStreamLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [streamFloatingEmojis, setStreamFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info' | 'error'} | null>(null);

  // --- Modals State ---
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isReportSubmitting, setIsReportSubmitting] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const streamContainerRef = useRef<HTMLDivElement>(null);
  const randomMessageInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize Chat Simulation
  useEffect(() => {
    setChatMessages([
        { id: '1', user: 'Gamer123', text: 'هذا البث رائع جداً! استمر 🔥', color: '#E91E63' },
        { id: '2', user: 'ProPlayer', text: 'يا له من لعب احترافي! 🚀', color: '#2196F3' },
        { id: '3', user: 'Watcher99', text: 'مرحباً بالجميع 👋', color: '#4CAF50' },
        { id: '4', user: 'FanBoy', text: 'أفضل ستريمر ❤️', color: '#FF9800' },
        { id: '5', user: 'NoobSlayer', text: 'GG WP', color: '#9C27B0' },
    ]);
    setIsStreamerFollowed(false);
    setIsStreamLiked(false);
    setChatInput('');
    setIsMuted(false);
    setStreamFloatingEmojis([]);
    setShowShareModal(false);
    setShowReportModal(false);

    // Simulate random incoming chat messages
    randomMessageInterval.current = setInterval(() => {
        const randomUsers = ['Speedy', 'Ghost', 'Ninja', 'PlayerOne', 'EpicGamer'];
        const randomTexts = ['واو!', 'لعبة قوية', '😂', '🔥🔥🔥', 'كيف فعلت ذلك؟', 'تحياتي من مصر', 'Hello from KSA'];
        const randomColors = ['#F44336', '#9C27B0', '#3F51B5', '#009688', '#FF5722'];
        
        const newMsg: ChatMessage = {
            id: Date.now().toString() + Math.random(),
            user: randomUsers[Math.floor(Math.random() * randomUsers.length)],
            text: randomTexts[Math.floor(Math.random() * randomTexts.length)],
            color: randomColors[Math.floor(Math.random() * randomColors.length)]
        };
        setChatMessages(prev => [...prev, newMsg]);
    }, 3000);

    return () => {
        if (randomMessageInterval.current) clearInterval(randomMessageInterval.current);
    };
  }, [stream.id]);

  // Scroll Chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const showNotification = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message: msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSendMessage = () => {
      if (!chatInput.trim()) return;
      
      const newMessage: ChatMessage = {
          id: Date.now().toString(),
          user: currentUser.name,
          text: chatInput,
          color: '#065F46' // User color
      };
      
      setChatMessages(prev => [...prev, newMessage]);
      setChatInput('');
  };

  const handleToggleFollowStreamer = () => {
      setIsStreamerFollowed(!isStreamerFollowed);
      if (!isStreamerFollowed) {
          showNotification(`تم متابعة ${stream.streamerName}`, 'success');
      } else {
          showNotification(`تم إلغاء متابعة ${stream.streamerName}`, 'info');
      }
  };

  const triggerStreamEmoji = (char: string) => {
      const newEmoji: FloatingEmoji = {
          id: Date.now() + Math.random(),
          char,
          left: Math.random() * 80 + 10 // Random position 10-90%
      };
      setStreamFloatingEmojis(prev => [...prev, newEmoji]);
      setTimeout(() => {
          setStreamFloatingEmojis(prev => prev.filter(e => e.id !== newEmoji.id));
      }, 2000);
  };

  const handleToggleLikeStream = (e?: any) => {
      e?.preventDefault();
      e?.stopPropagation();
      setIsStreamLiked(!isStreamLiked);
      if (!isStreamLiked) {
          showNotification('تم الإعجاب بالبث 💚', 'success');
          triggerStreamEmoji('💚');
      }
  };

  const handleShare = (e?: any) => {
      e?.stopPropagation?.();
      setShowShareModal(true);
  };

  const handleReport = (e?: any) => {
      e?.stopPropagation?.();
      setShowReportModal(true);
  };

  const handleSubmitReport = () => {
      if (!reportReason) return;
      setIsReportSubmitting(true);
      setTimeout(() => {
          setIsReportSubmitting(false);
          setShowReportModal(false);
          setReportReason('');
          showNotification('تم إرسال البلاغ بنجاح. شكراً لمساعدتك.', 'success');
      }, 1000);
  };

  const toggleFullscreen = (e?: any) => {
      e?.stopPropagation?.();
      if (!document.fullscreenElement) {
          streamContainerRef.current?.requestFullscreen().catch(err => {
              console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
          });
          setIsFullscreen(true);
      } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
            setIsFullscreen(false);
          }
      }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center animate-fadeIn">
       
       {notification && (
          <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg z-[10000] animate-bounce-in flex items-center gap-2 text-white ${notification.type === 'error' ? 'bg-red-600' : notification.type === 'info' ? 'bg-blue-600' : 'bg-gray-900'}`}>
            {notification.type === 'success' ? <Check className="w-5 h-5 text-green-400" /> : <AlertCircle className="w-5 h-5 text-white" />}
            {notification.message}
          </div>
       )}

       <div className="w-full h-full bg-black overflow-hidden relative">
          
          {/* Main Video Area */}
          <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center group" ref={streamContainerRef}>
             <button onClick={onClose} className="absolute top-6 right-6 z-50 p-2 bg-black/50 hover:bg-white/20 text-white rounded-full transition hover:rotate-90"><X className="w-6 h-6" /></button>

             {/* BACK TO GAMING BUTTON - Moved downwards for visibility */}
             <button 
                onClick={onClose}
                className="absolute top-14 right-20 z-50 bg-fb-blue hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 shadow-2xl transition-all duration-300 border border-white/10 hover:scale-105"
             >
                <ArrowRight className="w-5 h-5 rtl:rotate-180" /> العودة للألعاب
             </button>
             
             <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
                {streamFloatingEmojis.map(emoji => (
                    <div key={emoji.id} className="absolute bottom-20 text-4xl animate-float" style={{ left: `${emoji.left}%` }}>{emoji.char}</div>
                ))}
             </div>

             <div className="text-center w-full h-full relative">
                <img src={stream.thumbnail} alt="stream" className="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm" />
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <div className="w-20 h-20 mb-4 bg-red-600 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-red-600/30 cursor-pointer hover:scale-110 transition">
                       <Play className="w-8 h-8 text-white fill-current" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">{stream.title}</h2>
                    <p className="text-gray-200 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">بث مباشر بواسطة {stream.streamerName}</p>
                </div>
             </div>

             {/* Stream Overlay Controls */}
             <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 z-20">
                <div className="flex justify-between items-end">
                   <div className="flex items-center gap-4">
                      <button className="text-white hover:text-fb-blue transition transform hover:scale-110"><Play className="w-10 h-10 fill-current" /></button>
                      <button onClick={() => setIsMuted(!isMuted)} className="text-white hover:text-fb-blue transition">
                          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                      </button>
                      <div className="text-white">
                         <div className="font-bold flex items-center gap-2 mb-1">
                            <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse"></span> مباشر
                            <span className="text-sm font-normal text-gray-300 bg-white/10 px-2 py-0.5 rounded">00:45:20</span>
                         </div>
                         <h3 className="font-bold text-lg">{stream.title}</h3>
                      </div>
                   </div>
                   <div className="flex gap-4 text-white">
                      <button onClick={toggleFullscreen} title="ملء الشاشة" className="hover:text-fb-blue transition">
                          {isFullscreen ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
                      </button>
                   </div>
                </div>
             </div>
          </div>

          {/* Chat & Info Sidebar */}
          <div className="absolute top-0 left-0 h-full w-full md:w-[450px] bg-white dark:bg-gray-800 flex flex-col border-r dark:border-gray-700 z-[200] shadow-xl transform transition-transform duration-300">
             <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-3 mb-3">
                   <div className="relative">
                      <img src={stream.streamerAvatar} className="w-12 h-12 rounded-full border-2 border-red-500 object-cover" alt="streamer" />
                      <span className="absolute bottom-0 right-0 bg-red-500 text-white text-[9px] px-1 rounded-sm font-bold shadow-sm">LIVE</span>
                   </div>
                   <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 dark:text-white truncate">{stream.streamerName}</h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Users className="w-3 h-3" /> {stream.viewers} مشاهد
                      </span>
                   </div>
                   <button 
                     onClick={handleToggleFollowStreamer}
                     className={`px-4 py-1.5 rounded-full text-xs font-bold transition shadow-sm ${isStreamerFollowed ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white' : 'bg-fb-blue text-white hover:bg-blue-700'}`}
                   >
                     {isStreamerFollowed ? 'أتابع' : 'متابعة'}
                   </button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                    {stream.tags.map(tag => (
                        <span key={tag} className="text-[10px] bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                </div>
             </div>

             <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900/50">
                <div className="text-center text-xs text-gray-400 my-2 bg-gray-200 dark:bg-gray-800 py-1 rounded">مرحباً بك في المحادثة!</div>
                {chatMessages.map(msg => (
                   <div key={msg.id} className="flex items-start gap-2 text-sm animate-fadeIn">
                      <span className="font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap text-xs" style={{color: msg.color}}>{msg.user}:</span>
                      <span className="text-gray-600 dark:text-gray-400 text-xs">{msg.text}</span>
                   </div>
                ))}
                <div ref={chatEndRef} />
             </div>

             <div className="p-3 border-t dark:border-gray-700 bg-white dark:bg-gray-800 relative z-10 pointer-events-auto">
                <div className="flex justify-center gap-3 mb-3 overflow-x-auto no-scrollbar pb-1">
                    {REACTION_EMOJIS.map(emoji => (
                        <button key={emoji} onClick={() => triggerStreamEmoji(emoji)} className="text-xl hover:scale-125 transition active:scale-95 cursor-pointer bg-gray-100 dark:bg-gray-700 rounded-full w-8 h-8 flex-shrink-0 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 shadow-sm">{emoji}</button>
                    ))}
                </div>

                <div className="relative flex items-center gap-2">
                   <input 
                     type="text" 
                     placeholder="إرسال رسالة..." 
                     className="w-full bg-gray-100 dark:bg-gray-700 rounded-full py-2.5 pr-4 pl-10 text-sm outline-none focus:ring-2 focus:ring-fb-blue dark:text-white transition" 
                     value={chatInput}
                     onChange={(e) => setChatInput(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                   />
                   <button 
                     onClick={handleSendMessage}
                     disabled={!chatInput.trim()}
                     className="absolute left-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-fb-blue text-white rounded-full hover:bg-blue-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                      <Send className="w-3.5 h-3.5 rotate-180" />
                   </button>
                </div>
                <div className="flex justify-end gap-2 mt-2 relative z-50">
                    <button 
                      type="button"
                      onClick={(e) => handleToggleLikeStream(e)}
                      onMouseDown={(e) => e.stopPropagation()}
                      className={`p-2 rounded-full transition-all duration-200 active:scale-90 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer relative z-50 ${isStreamLiked ? 'text-green-600 bg-green-50' : 'text-gray-400'}`}
                      title="أعجبني"
                    >
                      <Heart className={`w-6 h-6 ${isStreamLiked ? 'fill-current' : ''}`} />
                    </button>
                    <button 
                      type="button"
                      onClick={(e) => handleShare(e)}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="p-2 rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200 active:scale-90 cursor-pointer relative z-50" 
                      title="مشاركة"
                    >
                      <Share2 className="w-6 h-6" />
                    </button>
                    <button 
                      type="button"
                      onClick={(e) => handleReport(e)}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 active:scale-90 cursor-pointer relative z-50" 
                      title="إبلاغ"
                    >
                      <Flag className="w-6 h-6" />
                    </button>
                </div>
             </div>
          </div>

          {/* SOPHISTICATED SHARE MODAL */}
          {showShareModal && createPortal(
              <GamingShareModal 
                item={{
                    id: stream.id,
                    title: stream.title,
                    thumbnail: stream.thumbnail,
                    type: 'stream'
                }} 
                onClose={() => setShowShareModal(false)} 
              />,
              document.body
          )}

          {/* Report Modal */}
          {showReportModal && (
              <div className="fixed inset-0 z-[10000] bg-black/60 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-scaleIn border border-gray-200 dark:border-gray-700">
                      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50">
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                              <AlertTriangle className="w-5 h-5 text-red-500" />
                              إبلاغ عن البث
                          </h3>
                          <button onClick={() => setShowReportModal(false)} className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-1 transition">
                              <X className="w-5 h-5" />
                          </button>
                      </div>
                      <div className="p-6 space-y-3">
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">يرجى تحديد سبب الإبلاغ:</p>
                          {['محتوى غير لائق', 'عنف أو مشاهد دموية', 'خطاب كراهية', 'معلومات مضللة', 'سبام أو احتيال'].map((reason) => (
                              <label key={reason} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                  <input 
                                      type="radio" 
                                      name="reportReason" 
                                      value={reason} 
                                      checked={reportReason === reason}
                                      onChange={(e) => setReportReason(e.target.value)}
                                      className="text-fb-blue focus:ring-fb-blue"
                                  />
                                  <span className="text-gray-700 dark:text-gray-200 text-sm font-medium">{reason}</span>
                              </label>
                          ))}
                      </div>
                      <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex justify-end gap-2">
                          <button onClick={() => setShowReportModal(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition text-sm">إلغاء</button>
                          <button 
                            onClick={handleSubmitReport} 
                            disabled={!reportReason || isReportSubmitting}
                            className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition shadow-sm disabled:opacity-50 flex items-center gap-2 text-sm"
                          >
                              {isReportSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                              إرسال
                          </button>
                      </div>
                  </div>
              </div>
          )}

       </div>
    </div>
  );
};

export default StreamViewerModal;
