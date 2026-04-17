// firestore-optimization.js

// Enable offline persistence for Firestore
firebase.firestore().enablePersistence()
  .then(() => {
    console.log('Firestore persistence enabled.');
  })
  .catch((err) => {
    console.error('Error enabling persistence:', err);
  });

// Timestamp-based caching function
function cacheWithTimestamp(docId, data) {
  const timestamp = new Date().toISOString();
  localStorage.setItem(docId, JSON.stringify({ data, timestamp }));
}

function getCachedData(docId) {
  const cached = localStorage.getItem(docId);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    console.log(`Cached data retrieved for ${docId} at ${timestamp}`);
    return data;
  }
  console.log(`No cached data found for ${docId}.`);
  return null;
}

// Example usage
// cacheWithTimestamp('doc1', { field: 'value' }); // To cache data
// const data = getCachedData('doc1'); // To retrieve cached data
