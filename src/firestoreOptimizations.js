// Method 1: Firestore offline persistence and query caching
async function setupFirestorePersistence() {
    const db = firebase.firestore();
    // Enable offline persistence
    await db.enablePersistence();

    const citiesRef = db.collection('cities');
    // Get the value of cities from Firestore
    const snapshot = await citiesRef.get();
    // Cache the data in local storage
    snapshot.forEach(doc => {
        localStorage.setItem(doc.id, JSON.stringify(doc.data()));
    });
}

// Method 2: Timestamp-based incremental data fetching with local storage cache
async function fetchDataWithPagination(lastTimestamp) {
    const db = firebase.firestore();
    const query = db.collection('news')
        .orderBy('timestamp')
        .startAfter(lastTimestamp)
        .limit(10);

    const snapshot = await query.get();
    const newTimestamp = snapshot.docs[snapshot.docs.length - 1]?.data().timestamp;
    const newsData = snapshot.docs.map(doc => doc.data());
    // Cache the new data in local storage
    newsData.forEach(news => {
        localStorage.setItem(news.id, JSON.stringify(news));
    });
    return newTimestamp;
}

// Minimum initial call to fetch data
const today = new Date();
const lastFetchedTimestamp = localStorage.getItem('lastFetchedTimestamp') || today;
fetchDataWithPagination(lastFetchedTimestamp);