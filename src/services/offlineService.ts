/**
 * Offline Service
 * Handles storing and synchronizing data when the application is offline
 */

// IndexedDB database name and version
const DB_NAME = 'mti-portal-offline';
const DB_VERSION = 1;

// Store names
const STORES = {
  PENDING_ACTIONS: 'pendingActions',
  CACHED_DATA: 'cachedData',
};

/**
 * Open the offline database
 */
export const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create stores if they don't exist
      if (!db.objectStoreNames.contains(STORES.PENDING_ACTIONS)) {
        db.createObjectStore(STORES.PENDING_ACTIONS, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(STORES.CACHED_DATA)) {
        db.createObjectStore(STORES.CACHED_DATA, { keyPath: 'key' });
      }
    };
    
    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };
    
    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

/**
 * Queue an action to be performed when the app is back online
 * @param action The action to queue
 */
export const queueAction = async (action: {
  id: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
  timestamp: number;
  type: string;
}): Promise<void> => {
  try {
    const db = await openDatabase();
    const transaction = db.transaction(STORES.PENDING_ACTIONS, 'readwrite');
    const store = transaction.objectStore(STORES.PENDING_ACTIONS);
    
    await new Promise<void>((resolve, reject) => {
      const request = store.add(action);
      
      request.onsuccess = () => resolve();
      request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
    
    // If the browser supports background sync, register for sync
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('sync-pending-actions');
    }
    
  } catch (error) {
    console.error('Failed to queue offline action:', error);
    throw error;
  }
};

/**
 * Get all pending actions that need to be synchronized
 */
export const getPendingActions = async (): Promise<any[]> => {
  try {
    const db = await openDatabase();
    const transaction = db.transaction(STORES.PENDING_ACTIONS, 'readonly');
    const store = transaction.objectStore(STORES.PENDING_ACTIONS);
    
    return new Promise<any[]>((resolve, reject) => {
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
    
  } catch (error) {
    console.error('Failed to get pending actions:', error);
    return [];
  }
};

/**
 * Remove a pending action after it has been successfully processed
 */
export const removePendingAction = async (id: string): Promise<void> => {
  try {
    const db = await openDatabase();
    const transaction = db.transaction(STORES.PENDING_ACTIONS, 'readwrite');
    const store = transaction.objectStore(STORES.PENDING_ACTIONS);
    
    await new Promise<void>((resolve, reject) => {
      const request = store.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
    
  } catch (error) {
    console.error('Failed to remove pending action:', error);
    throw error;
  }
};

/**
 * Save data to the offline cache
 */
export const cacheData = async (key: string, data: any): Promise<void> => {
  try {
    const db = await openDatabase();
    const transaction = db.transaction(STORES.CACHED_DATA, 'readwrite');
    const store = transaction.objectStore(STORES.CACHED_DATA);
    
    await new Promise<void>((resolve, reject) => {
      const request = store.put({
        key,
        data,
        timestamp: Date.now(),
      });
      
      request.onsuccess = () => resolve();
      request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
    
  } catch (error) {
    console.error('Failed to cache data:', error);
    throw error;
  }
};

/**
 * Get data from the offline cache
 */
export const getCachedData = async<T>(key: string): Promise<T | null> => {
  try {
    const db = await openDatabase();
    const transaction = db.transaction(STORES.CACHED_DATA, 'readonly');
    const store = transaction.objectStore(STORES.CACHED_DATA);
    
    return new Promise<T | null>((resolve, reject) => {
      const request = store.get(key);
      
      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result.data as T);
        } else {
          resolve(null);
        }
      };
      
      request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
    
  } catch (error) {
    console.error('Failed to get cached data:', error);
    return null;
  }
};

/**
 * Clear expired cached data (older than specified time)
 */
export const clearExpiredCache = async (maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<void> => {
  try {
    const db = await openDatabase();
    const transaction = db.transaction(STORES.CACHED_DATA, 'readwrite');
    const store = transaction.objectStore(STORES.CACHED_DATA);
    
    const now = Date.now();
    const items = await new Promise<any[]>((resolve, reject) => {
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
    
    // Delete expired items
    const deletePromises = items
      .filter(item => (now - item.timestamp) > maxAge)
      .map(item => {
        return new Promise<void>((resolve, reject) => {
          const request = store.delete(item.key);
          
          request.onsuccess = () => resolve();
          request.onerror = (event) => reject((event.target as IDBRequest).error);
        });
      });
    
    await Promise.all(deletePromises);
    
  } catch (error) {
    console.error('Failed to clear expired cache:', error);
  }
};

/**
 * Check if the user is currently online
 */
export const isOnline = (): boolean => {
  return navigator.onLine;
};

/**
 * Register online/offline event listeners
 */
export const registerConnectivityListeners = (
  onOnline: () => void,
  onOffline: () => void
): () => void => {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  
  // Return a cleanup function
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
};

/**
 * Process all pending actions
 */
export const synchronizeOfflineActions = async (): Promise<{
  success: number;
  failed: number;
}> => {
  if (!isOnline()) {
    return { success: 0, failed: 0 };
  }
  
  let successCount = 0;
  let failedCount = 0;
  
  try {
    const pendingActions = await getPendingActions();
    
    for (const action of pendingActions) {
      try {
        const response = await fetch(action.url, {
          method: action.method,
          headers: action.headers,
          body: action.body,
        });
        
        if (response.ok) {
          await removePendingAction(action.id);
          successCount++;
        } else {
          failedCount++;
          console.error('Failed to process action:', await response.text());
        }
      } catch (error) {
        failedCount++;
        console.error('Error processing offline action:', error);
      }
    }
  } catch (error) {
    console.error('Error synchronizing offline actions:', error);
  }
  
  return { success: successCount, failed: failedCount };
};

/**
 * Initialize offline functionality
 */
export const initializeOfflineSupport = async (): Promise<void> => {
  // Register service worker for offline support
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/serviceWorker.js');
      console.log('Service Worker registered with scope:', registration.scope);
      
      // Clear expired cache on startup
      await clearExpiredCache();
      
      // Listen for messages from the service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SYNC_COMPLETE') {
          console.log('Action synchronized successfully:', event.data.action);
          // You could dispatch an event to the app to show a notification
        }
      });
      
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
  
  // Register connectivity listeners
  registerConnectivityListeners(
    // Online callback
    async () => {
      console.log('App is online. Synchronizing data...');
      const result = await synchronizeOfflineActions();
      console.log(`Synchronized ${result.success} actions, ${result.failed} failed`);
    },
    // Offline callback
    () => {
      console.log('App is offline. Actions will be queued for later.');
    }
  );
};

/**
 * Create a fetch wrapper that handles offline scenarios
 */
export const offlineFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  // If we're online, try a regular fetch
  if (isOnline()) {
    try {
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      // Network error, continue to offline handling
      console.error('Network error while fetching:', error);
    }
  }
  
  // We're offline or fetch failed
  
  // If this is a GET request, try to get from cache
  if (!options.method || options.method === 'GET') {
    const cacheKey = `fetch:${url}`;
    const cachedData = await getCachedData(cacheKey);
    
    if (cachedData) {
      // Return cached data with offline header
      return new Response(JSON.stringify(cachedData), {
        headers: {
          'Content-Type': 'application/json',
          'X-Offline-Data': 'true'
        },
        status: 200
      });
    }
    
    // No cached data available
    return new Response(JSON.stringify({
      status: 'error',
      message: 'You are offline and no cached data is available',
      offline: true
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 503
    });
  }
  
  // For non-GET requests, queue for later processing
  const actionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  await queueAction({
    id: actionId,
    url,
    method: options.method || 'GET',
    headers: options.headers ? Object.fromEntries(new Headers(options.headers).entries()) : {},
    body: options.body ? options.body.toString() : undefined,
    timestamp: Date.now(),
    type: 'fetch'
  });
  
  // Return a response indicating the action is queued
  return new Response(JSON.stringify({
    status: 'queued',
    message: 'You are offline. This action has been queued and will be processed when you are back online.',
    actionId,
    offline: true
  }), {
    headers: { 'Content-Type': 'application/json' },
    status: 202
  });
};
