
/**
 * Aggressively removes heavy base64 strings from an object to save space.
 * This preserves the "record" (text, IDs, timestamps) while shedding the 
 * multi-megabyte image payloads that cause QuotaExceededError.
 */
const aggressiveShrink = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(item => aggressiveShrink(item));
  } else if (typeof data === 'object' && data !== null) {
    const newObj: any = { ...data };
    // Keys likely to contain heavy base64 strings
    const heavyKeys = ['image', 'mediaUrl', 'url', 'coverUrl', 'avatar', 'coverPhoto', 'img', 'video'];
    
    for (const key of heavyKeys) {
      if (typeof newObj[key] === 'string' && (newObj[key].length > 1024 || newObj[key].startsWith('data:'))) {
        // Remove heavy base64 data to save LocalStorage space
        newObj[key] = undefined; 
      }
    }
    
    // Recurse into nested objects to find more media to strip
    for (const key in newObj) {
      if (typeof newObj[key] === 'object') {
        newObj[key] = aggressiveShrink(newObj[key]);
      }
    }
    return newObj;
  }
  return data;
};

/**
 * Safe wrapper for localStorage.setItem that handles quota limits and 
 * ensures the application never crashes due to storage failures.
 */
export const safeSetItem = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (e: any) {
    // Determine if this is a Quota Exceeded error
    const isQuotaError = 
      (e instanceof DOMException && (
        e.code === 22 || 
        e.code === 1014 || 
        e.name === 'QuotaExceededError' || 
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED'
      )) || 
      (e && e.message && (
        e.message.toLowerCase().includes('quota') || 
        e.message.toLowerCase().includes('limit') ||
        e.message.toLowerCase().includes('exceeded')
      ));

    if (isQuotaError) {
      console.warn(`LocalStorage quota exceeded for "${key}". Initiating recovery logic...`);
      
      try {
        // 1. First recovery attempt: Clear less critical bulk data (like chat history)
        Object.keys(localStorage)
          .filter(k => k.startsWith('chat_'))
          .forEach(k => localStorage.removeItem(k));

        // Try saving original data again after cleanup
        localStorage.setItem(key, value);
      } catch (retryError) {
        try {
          // 2. Second recovery attempt: Strip all heavy images/videos from the payload
          const parsed = JSON.parse(value);
          const shrunken = aggressiveShrink(parsed);
          const shrunkenValue = JSON.stringify(shrunken);
          
          localStorage.setItem(key, shrunkenValue);
          console.info(`Saved light-weight version of "${key}" (media stripped) to fit quota.`);
        } catch (finalError) {
          // 3. Absolute failure: Do not re-throw. Just log it.
          // This prevents the ErrorBoundary from crashing the whole UI.
          console.error(`LocalStorage is criticaly full. Recovery failed for "${key}". Data discarded.`);
        }
      }
    } else {
      // Log other non-quota errors (e.g. security block) without crashing
      console.error(`Failed to access LocalStorage for "${key}":`, e);
    }
  }
};

/**
 * Safely retrieve and parse data from LocalStorage with fallback.
 */
export const safeGetItem = (key: string, fallback: any = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return fallback;
    
    // Attempt JSON parse if it looks like an object/array
    if (item.startsWith('[') || item.startsWith('{') || item === 'true' || item === 'false') {
      return JSON.parse(item);
    }
    return item;
  } catch (e) {
    console.error(`Error reading "${key}" from LocalStorage:`, e);
    return fallback;
  }
};
