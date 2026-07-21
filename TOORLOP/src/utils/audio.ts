
/**
 * Centralized Audio Utility for Tourloop
 * Handles UI sound effects for various user interactions.
 */

export type AudioAction = 
  | 'like' 
  | 'react' 
  | 'comment' 
  | 'post_success' 
  | 'upload_start' 
  | 'notification' 
  | 'message_sent' 
  | 'message_received';

const AUDIO_SOURCES: Record<AudioAction, string> = {
  // Using high-quality standard UI sound URLs
  like: 'https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3',
  react: 'https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3',
  comment: 'https://assets.mixkit.co/active_storage/sfx/1111/1111-preview.mp3',
  post_success: 'https://assets.mixkit.co/active_storage/sfx/1487/1487-preview.mp3',
  upload_start: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  notification: 'https://assets.mixkit.co/active_storage/sfx/2357/2357-preview.mp3',
  message_sent: 'https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3',
  message_received: 'https://assets.mixkit.co/active_storage/sfx/2359/2359-preview.mp3',
};

/**
 * Plays a UI sound effect based on the provided action type.
 * @param type - The interaction type that triggered the sound.
 * @param volume - Volume level between 0 and 1 (default 0.5).
 */
export const playAudio = (type: AudioAction, volume: number = 0.5): void => {
  try {
    const audioUrl = AUDIO_SOURCES[type];
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audio.volume = volume;
    
    // Use play() with a promise catch to handle browser autoplay restrictions
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        // Intercepting autoplay block errors silently
        console.debug(`Audio playback prevented for ${type}:`, error.message);
      });
    }
  } catch (error) {
    console.error('Audio utility error:', error);
  }
};

/**
 * Preloads all sound effects to ensure zero latency when the user interacts.
 */
export const preloadSounds = (): void => {
  Object.values(AUDIO_SOURCES).forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'audio';
    link.href = url;
    document.head.appendChild(link);
  });
};
