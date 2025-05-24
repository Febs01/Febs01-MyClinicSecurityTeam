// Service Worker for Security Department Management System
const CACHE_NAME = 'security-management-system-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/user-management.html',
  '/css/styles.css',
  '/css/login.css',
  '/css/logo.css',
  '/js/app.js',
  '/js/auth.js',
  '/js/pdf-export.js',
  '/js/email-notification.js',
  '/js/user-management.js',
  '/js/mobile-app.js',
  '/js/logo-integration.js',
  '/lib/jspdf.umd.min.js',
  '/css/bootstrap.min.css',
  '/js/bootstrap.min.js',
  '/assets/company_logo.jpg'
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip email API requests
  if (event.request.url.includes('/send-email')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Background sync for offline data
self.addEventListener('sync', event => {
  if (event.tag === 'sync-reports') {
    event.waitUntil(syncReports());
  } else if (event.tag === 'sync-inspections') {
    event.waitUntil(syncInspections());
  }
});

// Function to sync reports when back online
async function syncReports() {
  const pendingReports = await getDataFromIDB('pendingReports');
  if (!pendingReports || pendingReports.length === 0) return;

  // In a real implementation, this would send the reports to the server
  console.log(`Syncing ${pendingReports.length} reports`);
  
  // Clear pending reports after sync
  await clearDataFromIDB('pendingReports');
  
  // Show notification
  self.registration.showNotification('Security Management System', {
    body: `${pendingReports.length} reports have been synchronized`,
    icon: '/assets/company_logo.jpg'
  });
}

// Function to sync inspections when back online
async function syncInspections() {
  const pendingInspections = await getDataFromIDB('pendingInspections');
  if (!pendingInspections || pendingInspections.length === 0) return;

  // In a real implementation, this would send the inspections to the server
  console.log(`Syncing ${pendingInspections.length} inspections`);
  
  // Clear pending inspections after sync
  await clearDataFromIDB('pendingInspections');
  
  // Show notification
  self.registration.showNotification('Security Management System', {
    body: `${pendingInspections.length} inspections have been synchronized`,
    icon: '/assets/company_logo.jpg'
  });
}

// Helper functions for IndexedDB
function getDataFromIDB(storeName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SecurityManagementSystem', 1);
    
    request.onerror = event => {
      reject('Error opening IndexedDB');
    };
    
    request.onsuccess = event => {
      const db = event.target.result;
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result);
      };
      
      getAllRequest.onerror = () => {
        reject('Error getting data from IndexedDB');
      };
    };
    
    request.onupgradeneeded = event => {
      const db = event.target.result;
      db.createObjectStore('pendingReports', { keyPath: 'id' });
      db.createObjectStore('pendingInspections', { keyPath: 'id' });
    };
  });
}

function clearDataFromIDB(storeName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SecurityManagementSystem', 1);
    
    request.onerror = event => {
      reject('Error opening IndexedDB');
    };
    
    request.onsuccess = event => {
      const db = event.target.result;
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const clearRequest = store.clear();
      
      clearRequest.onsuccess = () => {
        resolve();
      };
      
      clearRequest.onerror = () => {
        reject('Error clearing data from IndexedDB');
      };
    };
  });
}
