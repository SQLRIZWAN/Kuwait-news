const {
  useState,
  useEffect,
  useContext,
  createContext,
  useCallback,
  useMemo,
  useRef
} = React;
const {
  createRoot
} = ReactDOM;

// ==========================================
// FIREBASE CONFIGURATION & INITIALIZATION
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyDLRqQ8WRohNDWz_6UgafI7Kn2f8U0KL3c",
  authDomain: "kwt-news.firebaseapp.com",
  databaseURL: "https://kwt-news-default-rtdb.firebaseio.com",
  projectId: "kwt-news",
  storageBucket: "kwt-news.firebasestorage.app",
  messagingSenderId: "604704031845",
  appId: "1:604704031845:web:b835af9ab1872ddd1d728c",
  measurementId: "G-J161YE3FDP"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
// Direct WebSocket — fastest connection. No auto-detect overhead.
// enablePersistence: Firestore caches data in IndexedDB so repeat visits
// load news INSTANTLY from device — no server round-trip needed.
try {
  db.enablePersistence({
    synchronizeTabs: false
  }).catch(() => {});
} catch (e) {}

// Firebase Messaging — lazy init after app loads (not critical for news reading)
let messaging = null;
// Messaging is loaded separately after app starts to not block news loading

// Cloudinary Configuration
const CLOUDINARY_CONFIG = {
  cloudName: 'debp1kjtm',
  uploadPreset: 'sql_admin',
  uploadUrl: 'https://api.cloudinary.com/v1_1/debp1kjtm/image/upload'
};

// ==========================================
// I18N CONFIGURATION
// ==========================================
const resources = {
  en: {
    translation: {
      home: 'Home',
      kuwait: 'Kuwait',
      world: 'World',
      search: 'Search news...',
      login: 'Login',
      logout: 'Logout',
      profile: 'Profile',
      saved: 'Saved News',
      liked: 'Liked Posts',
      comments: 'Comments',
      share: 'Share',
      readMore: 'Read More',
      breakingNews: 'Breaking News',
      trending: 'Trending',
      latest: 'Latest News',
      advertisement: 'Advertisement',
      loadMore: 'Load More',
      noResults: 'No news found',
      installApp: 'Add to Home Screen',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
      language: 'Language',
      notifications: 'Notifications',
      markAllRead: 'Mark all as read',
      ago: 'ago',
      hours: 'hours',
      minutes: 'minutes',
      days: 'days',
      justNow: 'Just now',
      views: 'views',
      likes: 'likes',
      reply: 'Reply',
      report: 'Report',
      delete: 'Delete',
      edit: 'Edit',
      cancel: 'Cancel',
      save: 'Save',
      post: 'Post',
      writeComment: 'Write a comment...',
      loginToComment: 'Login to comment',
      shareVia: 'Share via',
      copyLink: 'Copy Link',
      linkCopied: 'Link copied to clipboard!',
      breaking: 'BREAKING',
      sponsored: 'Sponsored',
      followUs: 'Follow Us',
      aboutUs: 'About Us',
      contact: 'Contact',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      copyright: '© 2026 KWT News. All rights reserved. Domain reserved 2017.',
      emailUs: 'kwtnews.com@gmail.com',
      noCommentsYet: 'No comments yet. Be the first!',
      loginToLike: 'Please login to like',
      loginToSave: 'Please login to save',
      removedFromSaved: 'Removed from saved',
      savedToProfile: '✅ Saved to your profile',
      youveReadAll: "✨ You've read all the news!",
      translating: 'Translating...',
      allNewsLoaded: 'All news loaded',
      replyingTo: 'Replying to',
      deleteComment: 'Delete this comment?',
      failedComment: 'Failed to post comment. Try again.',
      savedLabel: 'Saved',
      shareLabel: 'Share'
    }
  },
  ar: {
    translation: {
      home: 'الرئيسية',
      kuwait: 'الكويت',
      world: 'العالم',
      search: 'البحث في الأخبار...',
      login: 'تسجيل الدخول',
      logout: 'تسجيل الخروج',
      profile: 'الملف الشخصي',
      saved: 'الأخبار المحفوظة',
      liked: 'المنشورات المفضلة',
      comments: 'التعليقات',
      share: 'مشاركة',
      readMore: 'اقرأ المزيد',
      breakingNews: 'خبر عاجل',
      trending: 'الأكثر تداولاً',
      latest: 'آخر الأخبار',
      advertisement: 'إعلان',
      loadMore: 'تحميل المزيد',
      noResults: 'لم يتم العثور على أخبار',
      installApp: 'أضف إلى الشاشة الرئيسية',
      darkMode: 'الوضع الداكن',
      lightMode: 'الوضع الفاتح',
      language: 'اللغة',
      notifications: 'الإشعارات',
      markAllRead: 'تحديد الكل كمقروء',
      ago: 'منذ',
      hours: 'ساعات',
      minutes: 'دقائق',
      days: 'أيام',
      justNow: 'الآن',
      views: 'مشاهدات',
      likes: 'إعجابات',
      reply: 'رد',
      report: 'إبلاغ',
      delete: 'حذف',
      edit: 'تعديل',
      cancel: 'إلغاء',
      save: 'حفظ',
      post: 'نشر',
      writeComment: 'اكتب تعليقاً...',
      loginToComment: 'سجل الدخول للتعليق',
      shareVia: 'مشاركة عبر',
      copyLink: 'نسخ الرابط',
      linkCopied: 'تم نسخ الرابط!',
      breaking: 'عاجل',
      sponsored: 'إعلان',
      followUs: 'تابعنا',
      aboutUs: 'من نحن',
      contact: 'اتصل بنا',
      privacy: 'سياسة الخصوصية',
      terms: 'شروط الخدمة',
      copyright: '© 2026 KWT News. جميع الحقوق محفوظة.',
      emailUs: 'kwtnews.com@gmail.com',
      noCommentsYet: 'لا توجد تعليقات بعد. كن الأول!',
      loginToLike: 'سجل الدخول للإعجاب',
      loginToSave: 'سجل الدخول للحفظ',
      removedFromSaved: 'تمت الإزالة من المحفوظات',
      savedToProfile: '✅ تم الحفظ في ملفك الشخصي',
      youveReadAll: '✨ لقد قرأت جميع الأخبار!',
      translating: 'جارٍ الترجمة...',
      allNewsLoaded: 'تم تحميل جميع الأخبار',
      replyingTo: 'ردًا على',
      deleteComment: 'حذف هذا التعليق؟',
      failedComment: 'فشل نشر التعليق. حاول مرة أخرى.',
      savedLabel: 'محفوظ',
      shareLabel: 'مشاركة'
    }
  },
  ur: {
    translation: {
      home: 'ہوم',
      kuwait: 'کویت',
      world: 'دنیا',
      search: 'خبریں تلاش کریں...',
      login: 'لاگ ان',
      logout: 'لاگ آؤٹ',
      profile: 'پروفائل',
      saved: 'محفوظ شدہ خبریں',
      liked: 'پسندیدہ پوسٹس',
      comments: 'تبصرے',
      share: 'شیئر',
      readMore: 'مزید پڑھیں',
      breakingNews: 'بریکنگ نیوز',
      trending: 'ٹرینڈنگ',
      latest: 'تازہ ترین',
      advertisement: 'اشتہار',
      loadMore: 'مزید لوڈ کریں',
      noResults: 'کوئی خبر نہیں ملی',
      installApp: 'ہوم اسکرین پر شامل کریں',
      darkMode: 'ڈارک موڈ',
      lightMode: 'لائٹ موڈ',
      language: 'زبان',
      notifications: 'نوٹیفکیشنز',
      markAllRead: 'سب پڑھا ہوا نشان زد کریں',
      ago: 'پہلے',
      hours: 'گھنٹے',
      minutes: 'منٹ',
      days: 'دن',
      justNow: 'ابھی',
      views: 'دیکھے گئے',
      likes: 'لائکس',
      reply: 'جواب',
      report: 'رپورٹ',
      delete: 'حذف',
      edit: 'ترمیم',
      cancel: 'منسوخ',
      save: 'محفوظ',
      post: 'پوسٹ',
      writeComment: 'تبصرہ لکھیں...',
      loginToComment: 'تبصرہ کرنے کے لیے لاگ ان کریں',
      shareVia: 'کے ذریعے شیئر',
      copyLink: 'لنک کاپی کریں',
      linkCopied: 'لنک کاپی ہو گیا!',
      breaking: 'بریکنگ',
      sponsored: 'تعاون یافتہ',
      followUs: 'ہمیں فالو کریں',
      aboutUs: 'ہمارے بارے میں',
      contact: 'رابطہ',
      privacy: 'پرائیویسی پالیسی',
      terms: 'شرائط و ضوابط',
      copyright: '© 2026 KWT News. جملہ حقوق محفوظ ہیں۔',
      emailUs: 'kwtnews.com@gmail.com',
      noCommentsYet: 'ابھی تک کوئی تبصرہ نہیں۔ پہلے بنیں!',
      loginToLike: 'لائک کرنے کے لیے لاگ ان کریں',
      loginToSave: 'محفوظ کرنے کے لیے لاگ ان کریں',
      removedFromSaved: 'محفوظ شدہ سے ہٹا دیا گیا',
      savedToProfile: '✅ آپ کے پروفائل میں محفوظ ہو گیا',
      youveReadAll: '✨ آپ نے تمام خبریں پڑھ لی ہیں!',
      translating: 'ترجمہ ہو رہا ہے...',
      allNewsLoaded: 'تمام خبریں لوڈ ہو گئیں',
      replyingTo: 'جواب دے رہے ہیں',
      deleteComment: 'یہ تبصرہ حذف کریں؟',
      failedComment: 'تبصرہ پوسٹ کرنے میں ناکامی۔ دوبارہ کوشش کریں۔',
      savedLabel: 'محفوظ',
      shareLabel: 'شیئر'
    }
  }
};
i18next.use(i18nextBrowserLanguageDetector).init({
  resources,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});
const {
  useTranslation,
  initReactI18next
} = ReactI18next;
initReactI18next.init(i18next);

// ==========================================
// CONTEXT PROVIDERS
// ==========================================
const ThemeContext = createContext();
const AuthContext = createContext();
const LanguageContext = createContext();
const NotificationContext = createContext();

// Theme Provider
const ThemeProvider = ({
  children
}) => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches || false;
    }
    return false;
  });
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);
  const toggleTheme = () => setIsDark(prev => !prev);
  return /*#__PURE__*/React.createElement(ThemeContext.Provider, {
    value: {
      isDark,
      toggleTheme
    }
  }, children);
};

// Auth Provider
const AuthProvider = ({
  children
}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Auth timeout — don't block UI forever
    const timeout = setTimeout(() => setLoading(false), 5000);
    const unsubscribe = auth.onAuthStateChanged(user => {
      clearTimeout(timeout);
      setUser(user);
      setLoading(false);
    }, () => {
      clearTimeout(timeout);
      setLoading(false);
    });
    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);
  const loginWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      await auth.signInWithPopup(provider);
    } catch (error) {
      console.error('Google login error:', error);
    }
  };
  const loginWithApple = async () => {
    const provider = new firebase.auth.OAuthProvider('apple.com');
    try {
      await auth.signInWithPopup(provider);
    } catch (error) {
      console.error('Apple login error:', error);
    }
  };
  const loginWithEmail = async (email, password) => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      throw error;
    }
  };
  const registerWithEmail = async (email, password, displayName) => {
    try {
      const {
        user
      } = await auth.createUserWithEmailAndPassword(email, password);
      await user.updateProfile({
        displayName
      });
      await db.collection('users').doc(user.uid).set({
        email,
        displayName,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        savedPosts: [],
        likedPosts: [],
        interests: []
      });
    } catch (error) {
      throw error;
    }
  };
  const logout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  return /*#__PURE__*/React.createElement(AuthContext.Provider, {
    value: {
      user,
      loading,
      loginWithGoogle,
      loginWithApple,
      loginWithEmail,
      registerWithEmail,
      logout
    }
  }, children);
};

// Language Provider
const LanguageProvider = ({
  children
}) => {
  const {
    i18n
  } = useTranslation();
  const [currentLang, setCurrentLang] = useState(() => {
    try {
      return localStorage.getItem('language') || 'en';
    } catch (e) {
      return 'en';
    }
  });
  const changeLanguage = lang => {
    i18n.changeLanguage(lang);
    setCurrentLang(lang);
    const isRTL = ['ar', 'ur'].includes(lang);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    try {
      localStorage.setItem('language', lang);
    } catch (e) {}
    if (lang === 'en') {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
    } else {
      document.cookie = `googtrans=/en/${lang}; path=/`;
      document.cookie = `googtrans=/en/${lang}; path=/; domain=${window.location.hostname}`;
    }
    setTimeout(() => window.location.reload(), 80);
  };
  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'en';
    i18n.changeLanguage(savedLang);
    setCurrentLang(savedLang);
    document.documentElement.dir = ['ar', 'ur'].includes(savedLang) ? 'rtl' : 'ltr';
    document.documentElement.lang = savedLang;
    // After React renders all Firestore content, re-trigger Google Translate
    if (savedLang !== 'en') {
      const timer = setTimeout(() => {
        try {
          if (typeof window.doGTranslate === 'function') {
            window.doGTranslate(`en|${savedLang}`);
          } else {
            const sel = document.querySelector('.goog-te-combo');
            if (sel) {
              sel.value = savedLang;
              sel.dispatchEvent(new Event('change'));
            }
          }
        } catch (e) {}
      }, 2800); // Wait for Firestore content to load into DOM
      return () => clearTimeout(timer);
    }
  }, []);
  return /*#__PURE__*/React.createElement(LanguageContext.Provider, {
    value: {
      currentLang,
      changeLanguage
    }
  }, children);
};

// Notification Provider
const NotificationProvider = ({
  children
}) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const shownIds = useRef(new Set());

  // Real-time Firestore notifications
  useEffect(() => {
    const unsub = db.collection('notifications').where('active', '==', true).orderBy('timestamp', 'desc').limit(20).onSnapshot(snap => {
      snap.docChanges().forEach(change => {
        if (change.type === 'added') {
          const data = change.doc.data();
          const id = change.doc.id;
          if (!shownIds.current.has(id)) {
            shownIds.current.add(id);
            const age = Date.now() - (data.timestamp?.toMillis?.() || 0);
            if (age < 60000) {
              addNotification({
                message: data.message || data.title || 'New notification',
                type: data.type || 'info'
              });
            }
          }
        }
      });
    }, () => {});
    return () => unsub();
  }, []);
  const addNotification = notification => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [{
      id,
      ...notification
    }, ...prev]);
    if (!notification.read) setUnreadCount(prev => prev + 1);
    setTimeout(() => removeNotification(id), 5000);
  };
  const removeNotification = id => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  const markAllAsRead = () => {
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({
      ...n,
      read: true
    })));
  };
  return /*#__PURE__*/React.createElement(NotificationContext.Provider, {
    value: {
      notifications,
      unreadCount,
      addNotification,
      removeNotification,
      markAllAsRead
    }
  }, children);
};

// ==========================================
// CUSTOM HOOKS
// ==========================================
const useTheme = () => useContext(ThemeContext);
const useAuth = () => useContext(AuthContext);
const useLanguage = () => useContext(LanguageContext);
const useNotifications = () => useContext(NotificationContext);

// FIX 18: Focus trap hook — safely traps Tab key inside modal (no auto-focus to avoid disruption)
const useFocusTrap = containerRef => {
  useEffect(() => {
    try {
      if (!containerRef || !containerRef.current) return;
      const el = containerRef.current;
      const getFocusable = () => Array.from(el.querySelectorAll("button:not([disabled]), [href], input:not([disabled]), select, textarea"));
      const handleTab = e => {
        if (e.key !== 'Tab') return;
        const focusable = getFocusable();
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };
      el.addEventListener('keydown', handleTab);
      return () => el.removeEventListener('keydown', handleTab);
    } catch (e) {/* silent fail — accessibility enhancement only */}
  }, []);
};

// Categories that are HIDDEN from the home feed — they have their own dedicated pages
const SPECIAL_CATEGORIES = ['kuwait-jobs', 'kuwait-offers', 'funny-news-meme'];

// localStorage cache helpers for instant news display
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes — longer TTL = more cache hits
const getCachedNews = key => {
  try {
    const raw = localStorage.getItem('kwt_cache_' + key);
    if (!raw) return null;
    const {
      data,
      ts
    } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) return null;
    // Re-hydrate timestamps (stored as ISO strings)
    return data.map(n => ({
      ...n,
      timestamp: n.timestamp ? new Date(n.timestamp) : null
    }));
  } catch (e) {
    return null;
  }
};
const setCachedNews = (key, data) => {
  try {
    localStorage.setItem('kwt_cache_' + key, JSON.stringify({
      ts: Date.now(),
      data: data.map(n => ({
        ...n,
        timestamp: n.timestamp instanceof Date ? n.timestamp.toISOString() : n.timestamp
      }))
    }));
  } catch (e) {}
};

// Real-time news hook — instant display via localStorage cache
const useNews = (category = 'all', limit = 20, refreshKey = 0) => {
  const cacheKey = category;
  // Pre-populate from cache so news shows instantly (before Firebase responds)
  const [news, setNews] = useState(() => getCachedNews(cacheKey) || []);
  const [loading, setLoading] = useState(() => !getCachedNews(cacheKey));
  const [hasMore, setHasMore] = useState(true);
  const lastDocRef = useRef(null);
  const mounted = useRef(true);
  const prevCategory = useRef(category);
  useEffect(() => {
    mounted.current = true;
    const categoryChanged = prevCategory.current !== category;
    prevCategory.current = category;
    if (categoryChanged) {
      const cached = getCachedNews(category);
      if (cached && cached.length > 0) {
        setNews(cached);
        setLoading(false);
      } else {
        setLoading(true);
        setNews([]);
      }
    }
    setHasMore(true);
    lastDocRef.current = null;
    const timeout = setTimeout(() => {
      if (mounted.current) setLoading(false);
    }, 1500);

    // category queries use only orderBy (no composite index needed)
    // category-specific: filter client-side after fetching by timestamp
    let query;
    if (category === 'all') {
      query = db.collection('news').orderBy('timestamp', 'desc').limit(limit);
    } else {
      // No .where() + .orderBy() combo — that needs a composite index.
      // Instead: fetch recent news and filter by category client-side.
      // 2x multiplier (was 5x) — enough to fill screen without over-fetching
      query = db.collection('news').orderBy('timestamp', 'desc').limit(limit * 2);
    }
    const fetchLimit = limit;
    const unsubscribe = query.onSnapshot(snapshot => {
      clearTimeout(timeout);
      if (!mounted.current) return;
      let newsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      })).filter(n => !n.hidden && (n.status === 'published' || n.status === 'active' || n.status === 'Active' || !n.status));

      // Filter by category client-side (avoids Firestore composite index requirement)
      if (category === 'all') {
        newsData = newsData.filter(n => !SPECIAL_CATEGORIES.includes(n.category));
      } else {
        newsData = newsData.filter(n => n.category === category);
      }
      lastDocRef.current = snapshot.docs[snapshot.docs.length - 1] || null;
      // Use functional update: never replace existing news with empty list
      setNews(prev => newsData.length > 0 ? newsData : prev);
      if (newsData.length > 0) {
        setCachedNews(category, newsData);
        setHasMore(newsData.length >= fetchLimit);
      }
      setLoading(false);
    }, error => {
      clearTimeout(timeout);
      if (!mounted.current) return;
      console.error('News fetch error:', error);
      // On error, still show cached news if available
      const cached = getCachedNews(category);
      if (cached && cached.length > 0) setNews(cached);
      setLoading(false);
    });
    return () => {
      // FIX 17: Explicitly mark unmounted BEFORE calling unsubscribe so
      // any in-flight snapshot callback won't call setNews on unmounted hook
      mounted.current = false;
      clearTimeout(timeout);
      unsubscribe();
      lastDocRef.current = null;
    };
  }, [category, limit, refreshKey]);
  const loadMore = async () => {
    if (!lastDocRef.current) return;
    try {
      // Always use simple orderBy — no composite index needed
      const query = db.collection('news').orderBy('timestamp', 'desc').startAfter(lastDocRef.current).limit(limit * (category === 'all' ? 1 : 2));
      const snapshot = await query.get();
      let newNews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      })).filter(n => !n.hidden && (n.status === 'published' || n.status === 'active' || n.status === 'Active' || !n.status));
      if (category === 'all') {
        newNews = newNews.filter(n => !SPECIAL_CATEGORIES.includes(n.category));
      } else {
        newNews = newNews.filter(n => n.category === category);
      }
      lastDocRef.current = snapshot.docs[snapshot.docs.length - 1] || lastDocRef.current;
      if (newNews.length > 0) setNews(prev => [...prev, ...newNews]);
      setHasMore(newNews.length >= limit);
    } catch (err) {
      console.error('Load more error:', err);
    }
  };
  return {
    news,
    loading,
    hasMore,
    loadMore
  };
};

// ==========================================
// UTILITY COMPONENTS
// ==========================================

// SVG Logo Component
const Logo = () => /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexShrink: 0
  }
}, /*#__PURE__*/React.createElement("img", {
  src: "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNTAwIDUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0ibWFpbkdyYWRpZW50IiB4MT0iMCUiIHkxPSIxMDAlIiB4Mj0iMTAwJSIgeTI9IjAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzBkM2I2NiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iIzFhNWY3YSIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMyZWE4NTQiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgoKICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNSwgNDApIj4KICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMxMCwgMjYwKSI+CiAgICAgIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSI2NSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ1cmwoI21haW5HcmFkaWVudCkiIHN0cm9rZS13aWR0aD0iNiIvPgogICAgICA8bGluZSB4MT0iLTYwIiB5MT0iLTIyIiB4Mj0iNjAiIHkyPSItMjIiIHN0cm9rZT0idXJsKCNtYWluR3JhZGllbnQpIiBzdHJva2Utd2lkdGg9IjQiLz4KICAgICAgPGxpbmUgeDE9Ii02NSIgeTE9IjAiIHgyPSI2NSIgeTI9IjAiIHN0cm9rZT0idXJsKCNtYWluR3JhZGllbnQpIiBzdHJva2Utd2lkdGg9IjQiLz4KICAgICAgPGxpbmUgeDE9Ii02MCIgeTE9IjIyIiB4Mj0iNjAiIHkyPSIyMiIgc3Ryb2tlPSJ1cmwoI21haW5HcmFkaWVudCkiIHN0cm9rZS13aWR0aD0iNCIvPgogICAgICA8ZWxsaXBzZSBjeD0iMCIgY3k9IjAiIHJ4PSIyMiIgcnk9IjY1IiBmaWxsPSJub25lIiBzdHJva2U9InVybCgjbWFpbkdyYWRpZW50KSIgc3Ryb2tlLXdpZHRoPSI0Ii8+CiAgICAgIDxlbGxpcHNlIGN4PSIwIiBjeT0iMCIgcng9IjQ0IiByeT0iNjUiIGZpbGw9Im5vbmUiIHN0cm9rZT0idXJsKCNtYWluR3JhZGllbnQpIiBzdHJva2Utd2lkdGg9IjQiLz4KICAgICAgPGxpbmUgeDE9IjAiIHkxPSItNjUiIHgyPSIwIiB5Mj0iNjUiIHN0cm9rZT0idXJsKCNtYWluR3JhZGllbnQpIiBzdHJva2Utd2lkdGg9IjQiLz4KICAgIDwvZz4KCiAgICA8cGF0aCBkPSJNIDIxMCAzMjAgTCAyNjAgMzIwIEwgMjM1IDkwIFoiIGZpbGw9InVybCgjbWFpbkdyYWRpZW50KSIvPgogICAgPGNpcmNsZSBjeD0iMjM1IiBjeT0iMjI1IiByPSIzNCIgZmlsbD0idXJsKCNtYWluR3JhZGllbnQpIi8+CiAgICA8cmVjdCB4PSIyMDAiIHk9IjIyMSIgd2lkdGg9IjcwIiBoZWlnaHQ9IjgiIHJ4PSIyIiBmaWxsPSJ1cmwoI21haW5HcmFkaWVudCkiLz4KICAgIDxjaXJjbGUgY3g9IjIzNSIgY3k9IjE0NSIgcj0iMTkiIGZpbGw9InVybCgjbWFpbkdyYWRpZW50KSIvPgoKICAgIDxwYXRoIGQ9Ik0gMTc1IDMyMCBMIDE5NSAzMjAgTCAxODUgMTUwIFoiIGZpbGw9InVybCgjbWFpbkdyYWRpZW50KSIvPgoKICAgIDxwYXRoIGQ9Ik0gMTMwIDMyMCBMIDE1NSAzMjAgTCAxNDIuNSAxNDAgWiIgZmlsbD0idXJsKCNtYWluR3JhZGllbnQpIi8+CiAgICA8Y2lyY2xlIGN4PSIxNDIuNSIgY3k9IjIzMCIgcj0iMjMiIGZpbGw9InVybCgjbWFpbkdyYWRpZW50KSIvPgoKICAgIDxjaXJjbGUgY3g9IjI2NSIgY3k9IjE3MCIgcj0iMTIiIGZpbGw9InVybCgjbWFpbkdyYWRpZW50KSIvPgogICAgPHBhdGggZD0iTSAyODIgMTQ1IEEgMzUgMzUgMCAwIDEgMzE1IDE3OCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ1cmwoI21haW5HcmFkaWVudCkiIHN0cm9rZS13aWR0aD0iMTAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgogICAgPHBhdGggZD0iTSAyOTggMTE1IEEgNjUgNjUgMCAwIDEgMzQ1IDE2MiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ1cmwoI21haW5HcmFkaWVudCkiIHN0cm9rZS13aWR0aD0iMTAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgogICAgPHBhdGggZD0iTSAzMTQgODUgQSA5NSA5NSAwIDAgMSAzNzUgMTQ2IiBmaWxsPSJub25lIiBzdHJva2U9InVybCgjbWFpbkdyYWRpZW50KSIgc3Ryb2tlLXdpZHRoPSIxMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CgogICAgPHBhdGggZD0iTSA5MCAzMjUgUSAyNDAgMjkwIDM5MCAzMjUgUSAyNDAgMzEwIDkwIDMyNSBaIiBmaWxsPSJ1cmwoI21haW5HcmFkaWVudCkiLz4KICA8L2c+Cjwvc3ZnPgo=",
  alt: "KWT News",
  style: {
    width: '40px',
    height: '40px',
    flexShrink: 0,
    borderRadius: '10px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.35)',
    objectFit: 'cover'
  }
}), /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: '1',
    flexShrink: 0
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    fontFamily: 'Inter, Arial, sans-serif',
    fontWeight: 800,
    fontSize: '17px',
    letterSpacing: '0.05em',
    color: 'white',
    whiteSpace: 'nowrap',
    lineHeight: '1.2'
  }
}, "KWT NEWS"), /*#__PURE__*/React.createElement("span", {
  style: {
    fontFamily: 'Inter, Arial, sans-serif',
    fontWeight: 400,
    fontSize: '10px',
    color: '#F5A623',
    whiteSpace: 'nowrap',
    lineHeight: '1.3'
  }
}, "kwtnews.com")));

// Time Ago Component
const TimeAgo = ({
  date
}) => {
  const {
    t
  } = useTranslation();
  const getTimeAgo = date => {
    if (!date) return '';
    const seconds = Math.floor((new Date() - date) / 1000);
    // FIX 19: Guard against future/wrong device clock — clamp to 0
    if (seconds < 0) return t('justNow');
    if (seconds < 5) return t('justNow');
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + 'y ' + t('ago');
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + 'mo ' + t('ago');
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' ' + t('days') + ' ' + t('ago');
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' ' + t('hours') + ' ' + t('ago');
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' ' + t('minutes') + ' ' + t('ago');
    return t('justNow');
  };
  return /*#__PURE__*/React.createElement("span", null, getTimeAgo(date));
};

// Toast Notification — no fixed positioning here, parent handles placement
const Toast = ({
  message,
  type = 'success',
  onClose
}) => {
  const [exiting, setExiting] = React.useState(false);
  const bgMap = {
    success: 'rgba(16,185,129,0.95)',
    error: 'rgba(239,68,68,0.95)',
    info: 'rgba(245,166,35,0.95)',
    warning: 'rgba(234,179,8,0.95)'
  };
  const iconMap = {
    success: '✅',
    error: '⚠️',
    info: 'ℹ️',
    warning: '🔔'
  };
  const handleClose = () => {
    setExiting(true);
    setTimeout(onClose, 280);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: `toast-premium ${exiting ? 'exiting' : ''}`,
    style: {
      background: bgMap[type] || bgMap.info,
      color: 'white',
      pointerEvents: 'all'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '16px',
      flexShrink: 0
    }
  }, iconMap[type] || '📢'), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: '13px',
      flex: 1,
      lineHeight: 1.4
    }
  }, message), /*#__PURE__*/React.createElement("button", {
    onClick: handleClose,
    style: {
      background: 'rgba(255,255,255,0.25)',
      border: 'none',
      borderRadius: '50%',
      width: '22px',
      height: '22px',
      cursor: 'pointer',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "11",
    height: "11",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "3"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  }))));
};

// Loading Skeleton
const NewsCardSkeleton = () => /*#__PURE__*/React.createElement("div", {
  className: "skeleton-card bg-light-card dark:bg-dark-card mb-6 border border-gray-100 dark:border-gray-700/60",
  style: {
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
  }
}, /*#__PURE__*/React.createElement("div", {
  className: "skeleton-img skeleton"
}), /*#__PURE__*/React.createElement("div", {
  className: "p-4 space-y-3"
}, /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'flex',
    gap: '8px',
    marginBottom: '4px'
  }
}, /*#__PURE__*/React.createElement("div", {
  className: "skeleton rounded-full",
  style: {
    height: '16px',
    width: '60px'
  }
}), /*#__PURE__*/React.createElement("div", {
  className: "skeleton rounded-full",
  style: {
    height: '16px',
    width: '80px'
  }
})), /*#__PURE__*/React.createElement("div", {
  className: "skeleton rounded-lg",
  style: {
    height: '22px',
    width: '100%'
  }
}), /*#__PURE__*/React.createElement("div", {
  className: "skeleton rounded-lg",
  style: {
    height: '22px',
    width: '85%'
  }
}), /*#__PURE__*/React.createElement("div", {
  className: "skeleton rounded-lg",
  style: {
    height: '14px',
    width: '70%'
  }
}), /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'flex',
    gap: '8px',
    paddingTop: '8px',
    borderTop: '1px solid rgba(0,0,0,0.05)'
  }
}, /*#__PURE__*/React.createElement("div", {
  className: "skeleton rounded-xl",
  style: {
    height: '40px',
    width: '60px'
  }
}), /*#__PURE__*/React.createElement("div", {
  className: "skeleton rounded-xl",
  style: {
    height: '40px',
    width: '60px'
  }
}), /*#__PURE__*/React.createElement("div", {
  className: "skeleton rounded-xl",
  style: {
    height: '40px',
    width: '60px'
  }
}), /*#__PURE__*/React.createElement("div", {
  className: "skeleton rounded-xl",
  style: {
    height: '40px',
    width: '60px'
  }
}))));

// ==========================================
// MAIN COMPONENTS
// ==========================================

// ==========================================
// SAVED NEWS MODAL
// ==========================================
const SavedNewsModal = ({
  onClose,
  onReadMore
}) => {
  const {
    user
  } = useAuth();
  const {
    t
  } = useTranslation();
  const [savedNews, setSavedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, []);
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const unsub = db.collection('users').doc(user.uid).onSnapshot(async snap => {
      if (!snap.exists) {
        setLoading(false);
        return;
      }
      const ids = snap.data().savedPosts || [];
      if (ids.length === 0) {
        setSavedNews([]);
        setLoading(false);
        return;
      }
      try {
        const chunks = [];
        for (let i = 0; i < ids.length; i += 10) chunks.push(ids.slice(i, i + 10));
        const results = await Promise.all(chunks.map(chunk => db.collection('news').where(firebase.firestore.FieldPath.documentId(), 'in', chunk).get()));
        const items = results.flatMap(s => s.docs.map(d => ({
          id: d.id,
          ...d.data(),
          timestamp: d.data().timestamp?.toDate()
        })));
        setSavedNews(items);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, [user?.uid]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 320,
      display: 'flex',
      flexDirection: 'column'
    },
    className: "bg-white dark:bg-gray-900"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 16px',
      borderBottom: '1px solid',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flexShrink: 0,
      background: '#0A1628'
    },
    className: "border-gray-800"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      padding: '6px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.1)',
      border: 'none',
      cursor: 'pointer',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "15 18 9 12 15 6"
  }))), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontWeight: 700,
      fontSize: '16px',
      color: 'white',
      flex: 1
    }
  }, "\uD83D\uDD16 ", t('saved')), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '12px',
      color: '#F5A623',
      fontWeight: 600
    }
  }, savedNews.length, " items")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '16px'
    },
    className: "hide-scrollbar"
  }, loading ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '48px',
      color: '#9ca3af'
    }
  }, "Loading...") : savedNews.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '64px 20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '48px',
      marginBottom: '12px'
    }
  }, "\uD83D\uDD16"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 700,
      fontSize: '16px',
      marginBottom: '6px'
    },
    className: "text-gray-800 dark:text-white"
  }, "No saved articles"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '13px',
      color: '#9ca3af'
    }
  }, "Save articles to read them later")) : savedNews.map(item => /*#__PURE__*/React.createElement("div", {
    key: item.id,
    onClick: () => {
      onReadMore(item);
      onClose();
    },
    style: {
      display: 'flex',
      gap: '12px',
      padding: '12px',
      borderRadius: '12px',
      cursor: 'pointer',
      marginBottom: '10px',
      border: '1px solid'
    },
    className: "bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-accent transition-colors"
  }, /*#__PURE__*/React.createElement("img", {
    src: item.imageUrl || 'https://via.placeholder.com/80x60?text=KWT',
    alt: item.title,
    style: {
      width: '80px',
      height: '60px',
      objectFit: 'cover',
      borderRadius: '8px',
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '10px',
      fontWeight: 700,
      color: '#F5A623',
      textTransform: 'uppercase'
    }
  }, item.category || 'News'), /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: '13px',
      fontWeight: 600,
      lineHeight: 1.4,
      marginTop: '3px',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    },
    className: "text-gray-900 dark:text-white"
  }, item.title), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '11px',
      color: '#9ca3af',
      marginTop: '4px',
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement(TimeAgo, {
    date: item.timestamp
  })))))));
};

// ==========================================
// LIKED NEWS MODAL
// ==========================================
const LikedNewsModal = ({
  onClose,
  onReadMore
}) => {
  const {
    user
  } = useAuth();
  const {
    t
  } = useTranslation();
  const [likedNews, setLikedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, []);
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const unsub = db.collection('users').doc(user.uid).onSnapshot(async snap => {
      if (!snap.exists) {
        setLoading(false);
        return;
      }
      const ids = snap.data().likedPosts || [];
      if (ids.length === 0) {
        setLikedNews([]);
        setLoading(false);
        return;
      }
      try {
        const chunks = [];
        for (let i = 0; i < ids.length; i += 10) chunks.push(ids.slice(i, i + 10));
        const results = await Promise.all(chunks.map(chunk => db.collection('news').where(firebase.firestore.FieldPath.documentId(), 'in', chunk).get()));
        const items = results.flatMap(s => s.docs.map(d => ({
          id: d.id,
          ...d.data(),
          timestamp: d.data().timestamp?.toDate()
        })));
        setLikedNews(items);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, [user?.uid]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 320,
      display: 'flex',
      flexDirection: 'column'
    },
    className: "bg-white dark:bg-gray-900"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 16px',
      borderBottom: '1px solid',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flexShrink: 0,
      background: '#0A1628'
    },
    className: "border-gray-800"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      padding: '6px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.1)',
      border: 'none',
      cursor: 'pointer',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "15 18 9 12 15 6"
  }))), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontWeight: 700,
      fontSize: '16px',
      color: 'white',
      flex: 1
    }
  }, "\u2764\uFE0F ", t('liked')), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '12px',
      color: '#F5A623',
      fontWeight: 600
    }
  }, likedNews.length, " items")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '16px'
    },
    className: "hide-scrollbar"
  }, loading ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '48px',
      color: '#9ca3af'
    }
  }, "Loading...") : likedNews.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '64px 20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '48px',
      marginBottom: '12px'
    }
  }, "\u2764\uFE0F"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 700,
      fontSize: '16px',
      marginBottom: '6px'
    },
    className: "text-gray-800 dark:text-white"
  }, "No liked articles"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '13px',
      color: '#9ca3af'
    }
  }, "Like articles to see them here")) : likedNews.map(item => /*#__PURE__*/React.createElement("div", {
    key: item.id,
    onClick: () => {
      onReadMore(item);
      onClose();
    },
    style: {
      display: 'flex',
      gap: '12px',
      padding: '12px',
      borderRadius: '12px',
      cursor: 'pointer',
      marginBottom: '10px',
      border: '1px solid'
    },
    className: "bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-accent transition-colors"
  }, /*#__PURE__*/React.createElement("img", {
    src: item.imageUrl || 'https://via.placeholder.com/80x60?text=KWT',
    alt: item.title,
    style: {
      width: '80px',
      height: '60px',
      objectFit: 'cover',
      borderRadius: '8px',
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '10px',
      fontWeight: 700,
      color: '#F5A623',
      textTransform: 'uppercase'
    }
  }, item.category || 'News'), /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: '13px',
      fontWeight: 600,
      lineHeight: 1.4,
      marginTop: '3px',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    },
    className: "text-gray-900 dark:text-white"
  }, item.title), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '11px',
      color: '#9ca3af',
      marginTop: '4px',
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement(TimeAgo, {
    date: item.timestamp
  })))))));
};

// ==========================================
// SETTINGS MODAL
// ==========================================
const SettingsModal = ({
  onClose
}) => {
  const {
    isDark,
    toggleTheme
  } = useTheme();
  const {
    currentLang,
    changeLanguage
  } = useLanguage();
  const {
    user,
    logout
  } = useAuth();
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, []);
  const languages = [{
    code: 'en',
    name: 'English',
    flag: '🇺🇸'
  }, {
    code: 'ar',
    name: 'العربية',
    flag: '🇰🇼'
  }, {
    code: 'ur',
    name: 'اردو',
    flag: '🇵🇰'
  }, {
    code: 'hi',
    name: 'हिंदी',
    flag: '🇮🇳'
  }, {
    code: 'fr',
    name: 'Français',
    flag: '🇫🇷'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 320,
      display: 'flex',
      flexDirection: 'column'
    },
    className: "bg-white dark:bg-gray-900"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flexShrink: 0,
      background: '#0A1628'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      padding: '6px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.1)',
      border: 'none',
      cursor: 'pointer',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "15 18 9 12 15 6"
  }))), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontWeight: 700,
      fontSize: '16px',
      color: 'white'
    }
  }, "\u2699\uFE0F Settings")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '20px'
    },
    className: "hide-scrollbar"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: '24px'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '11px',
      fontWeight: 700,
      color: '#9ca3af',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      marginBottom: '12px'
    }
  }, "Appearance"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px',
      borderRadius: '12px',
      border: '1px solid'
    },
    className: "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '20px'
    }
  }, isDark ? '🌙' : '☀️'), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: '14px'
    },
    className: "text-gray-800 dark:text-white"
  }, isDark ? 'Dark Mode' : 'Light Mode')), /*#__PURE__*/React.createElement("div", {
    onClick: toggleTheme,
    style: {
      width: '44px',
      height: '24px',
      borderRadius: '12px',
      background: isDark ? '#F5A623' : '#d1d5db',
      cursor: 'pointer',
      position: 'relative',
      transition: 'background 0.25s'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '3px',
      left: isDark ? '23px' : '3px',
      width: '18px',
      height: '18px',
      borderRadius: '50%',
      background: 'white',
      transition: 'left 0.25s',
      boxShadow: '0 1px 4px rgba(0,0,0,0.25)'
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: '24px'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '11px',
      fontWeight: 700,
      color: '#9ca3af',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      marginBottom: '12px'
    }
  }, "Language"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1px solid'
    },
    className: "border-gray-200 dark:border-gray-700"
  }, languages.map(lang => /*#__PURE__*/React.createElement("button", {
    key: lang.code,
    onClick: () => changeLanguage(lang.code),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      border: 'none',
      cursor: 'pointer',
      textAlign: 'left',
      fontWeight: currentLang === lang.code ? 700 : 400,
      background: currentLang === lang.code ? 'rgba(245,166,35,0.08)' : 'transparent',
      color: currentLang === lang.code ? '#F5A623' : 'inherit'
    },
    className: "text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '20px'
    }
  }, lang.flag), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, lang.name), currentLang === lang.code && /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#F5A623",
    strokeWidth: "3"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "20 6 9 17 4 12"
  })))))), user && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '11px',
      fontWeight: 700,
      color: '#9ca3af',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      marginBottom: '12px'
    }
  }, "Account"), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px',
      borderRadius: '12px',
      border: '1px solid',
      marginBottom: '12px'
    },
    className: "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'U')}&background=F5A623&color=0A1628`,
    style: {
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      border: '2px solid #F5A623'
    },
    alt: "avatar"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 700,
      fontSize: '14px'
    },
    className: "text-gray-900 dark:text-white"
  }, user.displayName || 'User'), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '12px',
      color: '#9ca3af'
    }
  }, user.email)))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      logout();
      onClose();
    },
    style: {
      width: '100%',
      padding: '12px',
      borderRadius: '12px',
      border: '1.5px solid #ef4444',
      background: 'transparent',
      color: '#ef4444',
      fontWeight: 700,
      fontSize: '14px',
      cursor: 'pointer'
    }
  }, "Sign Out"))));
};

// ==========================================
// SEARCH MODAL — Firestore search with keyword highlight
// ==========================================
const HighlightText = ({
  text,
  query
}) => {
  if (!query || !text) return /*#__PURE__*/React.createElement("span", null, text);
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return /*#__PURE__*/React.createElement("span", null, text);
  return /*#__PURE__*/React.createElement("span", null, text.slice(0, idx), /*#__PURE__*/React.createElement("mark", {
    style: {
      background: 'rgba(245,166,35,0.35)',
      color: 'inherit',
      borderRadius: '2px',
      padding: '0 1px'
    }
  }, text.slice(idx, idx + query.length)), text.slice(idx + query.length));
};
const SearchModal = ({
  onClose,
  onSelectNews
}) => {
  const {
    t
  } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const modalRef = useRef(null); // FIX 18: focus trap
  useFocusTrap(modalRef);
  useEffect(() => {
    inputRef.current?.focus();
    const onKey = e => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, []);

  // FIX 5: Proper debounce — cancel previous timer immediately, track mounted state
  useEffect(() => {
    let cancelled = false;
    clearTimeout(timerRef.current);
    const q = query.trim().toLowerCase();
    if (q.length < 2) {
      setResults([]);
      setSearched(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    timerRef.current = setTimeout(async () => {
      if (cancelled) return; // stale closure guard
      try {
        const snap = await db.collection('news').orderBy('timestamp', 'desc').limit(60).get();
        if (cancelled) return;
        const found = snap.docs.map(d => ({
          id: d.id,
          ...d.data(),
          timestamp: d.data().timestamp?.toDate()
        })).filter(n => !n.hidden && (n.status === 'published' || n.status === 'active' || n.status === 'Active' || !n.status)).filter(n => {
          const title = (n.title || '').toLowerCase();
          const summary = (n.summary || '').toLowerCase();
          const content = (n.content || '').toLowerCase();
          return title.includes(q) || summary.includes(q) || content.includes(q);
        }).slice(0, 20);
        setResults(found);
      } catch (e) {
        if (!cancelled) {
          console.error('Search error:', e);
          setResults([]);
        }
      }
      if (!cancelled) {
        setLoading(false);
        setSearched(true);
      }
    }, 400);
    // FIX 5: Cleanup cancels both timer AND any in-flight fetch result
    return () => {
      cancelled = true;
      clearTimeout(timerRef.current);
    };
  }, [query]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 190,
      background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(3px)'
    },
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 195,
      display: 'flex',
      flexDirection: 'column',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      pointerEvents: 'all',
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '12px 12px 0',
      display: 'flex',
      flexDirection: 'column',
      maxHeight: '100vh'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "kwt-search-wrap",
    style: {
      background: '#0f1f3d',
      borderRadius: '16px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
      border: '1px solid rgba(255,255,255,0.12)',
      overflow: 'hidden',
      flexShrink: 0,
      transition: 'border-color 0.18s ease, box-shadow 0.18s ease'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      padding: '14px 16px',
      gap: '12px'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,0.45)",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "8"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "21",
    y1: "21",
    x2: "16.65",
    y2: "16.65"
  })), /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    type: "text",
    placeholder: t('search'),
    value: query,
    onChange: e => setQuery(e.target.value),
    style: {
      background: 'transparent',
      border: 'none',
      outline: 'none',
      boxShadow: 'none',
      color: 'white',
      fontSize: '15px',
      flex: 1,
      fontFamily: 'inherit'
    },
    className: "kwt-search-input placeholder-gray-500"
  }), query ? /*#__PURE__*/React.createElement("button", {
    onClick: () => setQuery(''),
    style: {
      color: 'rgba(255,255,255,0.4)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      flexShrink: 0,
      padding: '4px'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  }))) : /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      color: 'rgba(255,255,255,0.35)',
      background: 'rgba(255,255,255,0.08)',
      border: 'none',
      cursor: 'pointer',
      padding: '4px 8px',
      borderRadius: '6px',
      fontSize: '10px',
      letterSpacing: '0.05em',
      flexShrink: 0
    }
  }, "ESC"))), (loading || results.length > 0 || searched) && /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#0f1f3d',
      borderRadius: '16px',
      border: '1px solid rgba(255,255,255,0.1)',
      marginTop: '6px',
      overflow: 'hidden',
      flexShrink: 0,
      maxHeight: '70vh',
      overflowY: 'auto'
    },
    className: "hide-scrollbar"
  }, loading ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-block',
      width: '20px',
      height: '20px',
      border: '2px solid rgba(255,255,255,0.1)',
      borderTopColor: '#F5A623',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite'
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'rgba(255,255,255,0.4)',
      fontSize: '12px',
      marginTop: '8px'
    }
  }, "Searching Firestore\u2026")) : results.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '24px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '28px',
      marginBottom: '6px'
    }
  }, "\uD83D\uDD0D"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'rgba(255,255,255,0.4)',
      fontSize: '13px'
    }
  }, t('noResults'), " for \"", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#F5A623'
    }
  }, query), "\"")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 14px',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '11px',
      color: 'rgba(255,255,255,0.35)',
      fontWeight: 500
    }
  }, results.length, " result", results.length !== 1 ? 's' : '', " for \"", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#F5A623'
    }
  }, query), "\"")), results.map(item => /*#__PURE__*/React.createElement("button", {
    key: item.id,
    onClick: () => onSelectNews(item),
    style: {
      width: '100%',
      display: 'flex',
      gap: '10px',
      alignItems: 'flex-start',
      padding: '11px 14px',
      border: 'none',
      cursor: 'pointer',
      background: 'transparent',
      textAlign: 'left',
      borderBottom: '1px solid rgba(255,255,255,0.05)'
    },
    className: "hover:bg-white/5 transition-colors"
  }, item.imageUrl && /*#__PURE__*/React.createElement("img", {
    src: item.imageUrl,
    alt: "",
    style: {
      width: '52px',
      height: '40px',
      borderRadius: '8px',
      objectFit: 'cover',
      flexShrink: 0,
      border: '1px solid rgba(255,255,255,0.08)'
    },
    loading: "lazy"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '13px',
      fontWeight: 600,
      color: 'white',
      lineHeight: 1.4,
      marginBottom: '3px',
      overflow: 'hidden',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical'
    }
  }, /*#__PURE__*/React.createElement(HighlightText, {
    text: item.title,
    query: query
  })), item.summary && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '11px',
      color: 'rgba(255,255,255,0.4)',
      lineHeight: 1.4,
      overflow: 'hidden',
      display: '-webkit-box',
      WebkitLineClamp: 1,
      WebkitBoxOrient: 'vertical'
    }
  }, /*#__PURE__*/React.createElement(HighlightText, {
    text: item.summary,
    query: query
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '10px',
      color: '#F5A623',
      marginTop: '3px',
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement(TimeAgo, {
    date: item.timestamp
  }))))))), !query && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'rgba(255,255,255,0.2)',
      fontSize: '12px'
    }
  }, "Type at least 2 characters to search Firestore")))), /*#__PURE__*/React.createElement("style", null, `@keyframes spin { to { transform: rotate(360deg); } }`));
};

// ==========================================
// STATIC PAGE MODAL (About, Contact, Privacy, Terms)
// ==========================================
const StaticPageModal = ({
  page,
  onClose
}) => {
  const pages = {
    about: {
      title: 'About Us',
      icon: 'ℹ️',
      content: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
        style: {
          fontSize: '15px',
          lineHeight: 1.8,
          marginBottom: '16px'
        }
      }, "KWT News is Kuwait's trusted real-time news platform. We deliver breaking news, local Kuwait stories, world events, job listings, and lifestyle content \u2014 all in one place."), /*#__PURE__*/React.createElement("p", {
        style: {
          fontSize: '15px',
          lineHeight: 1.8,
          marginBottom: '16px'
        }
      }, "Our mission is to keep the Kuwait community informed, connected, and empowered with accurate, fast, and multilingual news coverage in 10+ languages."), /*#__PURE__*/React.createElement("p", {
        style: {
          fontSize: '15px',
          lineHeight: 1.8,
          marginBottom: '16px'
        }
      }, "Founded in Kuwait, our editorial team works around the clock to bring you the most relevant stories from Kuwait and around the world."), /*#__PURE__*/React.createElement("div", {
        style: {
          background: 'rgba(245,166,35,0.08)',
          border: '1px solid rgba(245,166,35,0.2)',
          borderRadius: '12px',
          padding: '16px',
          marginTop: '20px'
        }
      }, /*#__PURE__*/React.createElement("p", {
        style: {
          fontWeight: 700,
          fontSize: '14px',
          marginBottom: '8px',
          color: '#F5A623'
        }
      }, "\uD83C\uDF10 Visit us"), /*#__PURE__*/React.createElement("p", {
        style: {
          fontSize: '14px'
        }
      }, "kwtnews.com"), /*#__PURE__*/React.createElement("p", {
        style: {
          fontSize: '14px',
          marginTop: '4px'
        }
      }, "\uD83D\uDCE7 kwtnews.com@gmail.com")))
    },
    contact: {
      title: 'Contact Us',
      icon: '📬',
      content: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
        style: {
          fontSize: '15px',
          lineHeight: 1.8,
          marginBottom: '20px'
        }
      }, "We'd love to hear from you! Reach out to us through any of the following channels:"), [{
        icon: '📧',
        label: 'Email',
        value: 'kwtnews.com@gmail.com',
        href: 'mailto:kwtnews.com@gmail.com'
      }, {
        icon: '✉️',
        label: 'X / Twitter',
        value: '@kwtnews_com',
        href: 'https://twitter.com/kwtnews_com'
      }, {
        icon: '📸',
        label: 'Instagram',
        value: '@kwtnews_com',
        href: 'https://instagram.com/kwtnews_com'
      }, {
        icon: '📢',
        label: 'Telegram',
        value: '@kwtnews_com',
        href: 'https://t.me/kwtnews_com'
      }, {
        icon: '🎵',
        label: 'TikTok',
        value: '@kwtnews.com',
        href: 'https://tiktok.com/@kwtnews.com'
      }].map(c => /*#__PURE__*/React.createElement("a", {
        key: c.href,
        href: c.href,
        target: c.href.startsWith('mailto') ? undefined : '_blank',
        rel: "noopener noreferrer",
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          padding: '14px',
          borderRadius: '12px',
          marginBottom: '8px',
          textDecoration: 'none',
          background: 'rgba(0,0,0,0.03)',
          border: '1px solid rgba(0,0,0,0.06)'
        },
        className: "dark:bg-gray-800/40 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: '22px',
          flexShrink: 0
        }
      }, c.icon), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
        style: {
          fontSize: '12px',
          color: '#9ca3af',
          marginBottom: '2px'
        }
      }, c.label), /*#__PURE__*/React.createElement("p", {
        style: {
          fontSize: '14px',
          fontWeight: 600
        },
        className: "text-gray-800 dark:text-gray-200"
      }, c.value)), /*#__PURE__*/React.createElement("svg", {
        style: {
          marginLeft: 'auto',
          flexShrink: 0
        },
        xmlns: "http://www.w3.org/2000/svg",
        width: "14",
        height: "14",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2.5",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: "text-gray-400"
      }, /*#__PURE__*/React.createElement("polyline", {
        points: "9 18 15 12 9 6"
      })))), /*#__PURE__*/React.createElement("p", {
        style: {
          fontSize: '13px',
          color: '#9ca3af',
          marginTop: '16px',
          textAlign: 'center'
        }
      }, "For advertising inquiries, please email us at", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "kwtnews.com@gmail.com")))
    },
    privacy: {
      title: 'Privacy Policy',
      icon: '🔒',
      content: /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: '14px',
          lineHeight: 1.8,
          color: 'inherit'
        }
      }, /*#__PURE__*/React.createElement("p", {
        style: {
          marginBottom: '16px',
          color: '#9ca3af',
          fontSize: '12px'
        }
      }, "Last updated: January 2026"), [{
        h: '1. Information We Collect',
        p: 'We collect information you provide when creating an account (name, email, profile photo). We also collect usage data such as articles read, liked posts, and preferences to improve your experience.'
      }, {
        h: '2. How We Use Your Information',
        p: 'Your information is used to personalize your news feed, remember your preferences, enable notifications, and improve our services. We do not sell your personal data to third parties.'
      }, {
        h: '3. Data Storage',
        p: 'Your data is securely stored using Google Firebase services. We implement appropriate security measures to protect your information against unauthorized access.'
      }, {
        h: '4. Cookies & Local Storage',
        p: 'We use browser local storage and session storage to save preferences such as your selected language, theme (dark/light mode), liked posts, and notification settings.'
      }, {
        h: '5. Third-Party Services',
        p: 'KWT News uses Firebase (Google) for authentication and database services. We may display third-party advertisements. These services have their own privacy policies.'
      }, {
        h: '6. Your Rights',
        p: 'You may request deletion of your account and associated data at any time by contacting us at kwtnews.com@gmail.com. You can also clear local data by clearing your browser cache.'
      }, {
        h: '7. Changes to This Policy',
        p: 'We may update this Privacy Policy periodically. Continued use of our service constitutes acceptance of the updated policy.'
      }, {
        h: '8. Contact',
        p: 'For privacy-related inquiries, contact us at kwtnews.com@gmail.com.'
      }].map(s => /*#__PURE__*/React.createElement("div", {
        key: s.h,
        style: {
          marginBottom: '18px'
        }
      }, /*#__PURE__*/React.createElement("p", {
        style: {
          fontWeight: 700,
          fontSize: '14px',
          marginBottom: '6px'
        },
        className: "text-gray-900 dark:text-white"
      }, s.h), /*#__PURE__*/React.createElement("p", {
        className: "text-gray-600 dark:text-gray-400"
      }, s.p))))
    },
    terms: {
      title: 'Terms & Conditions',
      icon: '📋',
      content: /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: '14px',
          lineHeight: 1.8
        }
      }, /*#__PURE__*/React.createElement("p", {
        style: {
          marginBottom: '16px',
          color: '#9ca3af',
          fontSize: '12px'
        }
      }, "Last updated: January 2026"), [{
        h: '1. Acceptance of Terms',
        p: 'By accessing and using KWT News, you accept and agree to be bound by these Terms and Conditions. If you do not agree, please do not use our service.'
      }, {
        h: '2. Use of Service',
        p: 'KWT News is provided for personal, non-commercial use. You may not reproduce, distribute, or commercially exploit any content without prior written permission.'
      }, {
        h: '3. User Accounts',
        p: 'You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate information and notify us of any unauthorized use of your account.'
      }, {
        h: '4. Content Policy',
        p: 'Users must not post comments that are abusive, defamatory, or illegal. We reserve the right to remove any content and suspend accounts that violate our community standards.'
      }, {
        h: '5. Intellectual Property',
        p: 'All content on KWT News, including articles, images, and videos, is protected by copyright. KWT News and its logo are trademarks of kwtnews.com.'
      }, {
        h: '6. Disclaimer',
        p: 'News content is provided for informational purposes only. KWT News strives for accuracy but does not guarantee the completeness or reliability of any information.'
      }, {
        h: '7. Limitation of Liability',
        p: 'KWT News shall not be liable for any indirect, incidental, or consequential damages arising from use of our service.'
      }, {
        h: '8. Changes to Terms',
        p: 'We reserve the right to modify these terms at any time. Continued use of our service after changes constitutes acceptance of the new terms.'
      }, {
        h: '9. Contact',
        p: 'Questions about these terms can be sent to kwtnews.com@gmail.com.'
      }].map(s => /*#__PURE__*/React.createElement("div", {
        key: s.h,
        style: {
          marginBottom: '18px'
        }
      }, /*#__PURE__*/React.createElement("p", {
        style: {
          fontWeight: 700,
          fontSize: '14px',
          marginBottom: '6px'
        },
        className: "text-gray-900 dark:text-white"
      }, s.h), /*#__PURE__*/React.createElement("p", {
        className: "text-gray-600 dark:text-gray-400"
      }, s.p))))
    }
  };
  const pg = pages[page];
  if (!pg) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 600,
      display: 'flex',
      flexDirection: 'column'
    },
    onClick: e => {
      if (e.target === e.currentTarget) onClose();
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      animation: 'modalUp 0.22s cubic-bezier(0.25,0.46,0.45,0.94)'
    },
    className: "bg-white dark:bg-gray-900"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 18px 14px',
      paddingTop: 'calc(16px + env(safe-area-inset-top))',
      flexShrink: 0
    },
    className: "border-b border-gray-100 dark:border-gray-800"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '22px'
    }
  }, pg.icon), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontWeight: 800,
      fontSize: '18px',
      margin: 0
    },
    className: "text-gray-900 dark:text-white"
  }, pg.title)), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    className: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-colors"
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowY: 'auto',
      flex: 1,
      padding: '20px 18px 32px'
    },
    className: "text-gray-700 dark:text-gray-300"
  }, pg.content)));
};

// ==========================================
// HEADER COMPONENT
// ==========================================
const Header = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onReadMore
}) => {
  const {
    t
  } = useTranslation();
  const {
    isDark,
    toggleTheme
  } = useTheme();
  const {
    user,
    logout
  } = useAuth();
  const {
    currentLang,
    changeLanguage
  } = useLanguage();
  const {
    unreadCount
  } = useNotifications();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [showLikedModal, setShowLikedModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  // notifEnabled: sync with actual browser permission so it never auto-resets
  const [notifEnabled, setNotifEnabled] = useState(() => {
    if (typeof Notification === 'undefined') return false;
    if (Notification.permission === 'granted') return true;
    try {
      return localStorage.getItem('kwtNotifEnabled') === 'true';
    } catch (e) {
      return false;
    }
  });

  // Keep notifEnabled in sync if permission changes externally
  useEffect(() => {
    if (typeof Notification === 'undefined') return;
    if (Notification.permission === 'granted') {
      setNotifEnabled(true);
      try {
        localStorage.setItem('kwtNotifEnabled', 'true');
      } catch (e) {}
    } else if (Notification.permission === 'denied') {
      setNotifEnabled(false);
      try {
        localStorage.setItem('kwtNotifEnabled', 'false');
      } catch (e) {}
    }
  }, []);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [activePage, setActivePage] = useState(null);
  const handleLogoutRequest = () => {
    setLogoutConfirm(true);
  };
  const handleLogoutConfirmed = () => {
    logout();
    setDrawerOpen(false);
    setLogoutConfirm(false);
  };
  const handleNotifToggle = async () => {
    if (typeof Notification === 'undefined') return;
    if (notifEnabled) {
      // Turn off
      setNotifEnabled(false);
      try {
        localStorage.setItem('kwtNotifEnabled', 'false');
      } catch (e) {}
      return;
    }
    // Turn on: request permission
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotifEnabled(true);
        try {
          localStorage.setItem('kwtNotifEnabled', 'true');
        } catch (e) {}
        new Notification('KWT News 🗞️', {
          body: 'Breaking news alerts enabled!',
          icon: '/icon-192.png',
          tag: 'kwt-welcome'
        });
      } else {
        setNotifEnabled(false);
        try {
          localStorage.setItem('kwtNotifEnabled', 'false');
        } catch (e) {}
      }
    } catch (err) {
      console.error('Notification toggle error:', err);
    }
  };
  const languages = [{
    code: 'en',
    name: 'English',
    flag: '🇺🇸'
  }, {
    code: 'ar',
    name: 'العربية',
    flag: '🇰🇼'
  }, {
    code: 'ur',
    name: 'اردو',
    flag: '🇵🇰'
  }, {
    code: 'hi',
    name: 'हिंदी',
    flag: '🇮🇳'
  }, {
    code: 'fr',
    name: 'Français',
    flag: '🇫🇷'
  }, {
    code: 'bn',
    name: 'বাংলা',
    flag: '🇧🇩'
  }, {
    code: 'ml',
    name: 'മലയാളം',
    flag: '🇮🇳'
  }, {
    code: 'ta',
    name: 'தமிழ்',
    flag: '🇮🇳'
  }, {
    code: 'tl',
    name: 'Filipino',
    flag: '🇵🇭'
  }, {
    code: 'te',
    name: 'తెలుగు',
    flag: '🇮🇳'
  }];
  const tabs = [{
    id: 'all',
    label: t('home'),
    icon: '🏠'
  }, {
    id: 'kuwait',
    label: t('kuwait'),
    icon: '🇰🇼'
  }, {
    id: 'world',
    label: t('world'),
    icon: '🌍'
  }, {
    id: 'kuwait-jobs',
    label: 'Kuwait Jobs',
    icon: '💼'
  }, {
    id: 'kuwait-offers',
    label: 'Kuwait Offers',
    icon: '🛍️'
  }, {
    id: 'funny-news-meme',
    label: 'Funny & Memes',
    icon: '😂'
  }];
  const trendingTopics = ['#KuwaitWeather', '#GoldPrice', '#FootballNews', '#BreakingKWT', '#WorldNews'];
  return /*#__PURE__*/React.createElement(React.Fragment, null, drawerOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(2px)'
    },
    onClick: () => setDrawerOpen(false)
  }), /*#__PURE__*/React.createElement("div", {
    className: "drawer-panel",
    style: {
      position: 'relative',
      width: '300px',
      maxWidth: '85vw',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1,
      animation: 'drawerSlideIn 0.28s cubic-bezier(0.25,0.46,0.45,0.94)',
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '18px 16px 12px',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Logo, null), /*#__PURE__*/React.createElement("button", {
    onClick: () => setDrawerOpen(false),
    style: {
      padding: '7px',
      borderRadius: '8px',
      background: 'rgba(255,255,255,0.06)',
      border: 'none',
      cursor: 'pointer',
      color: 'rgba(255,255,255,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '1px',
      background: 'rgba(255,255,255,0.07)',
      margin: '0 16px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 16px 12px'
    }
  }, user ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: user.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.displayName || 'U') + '&background=F5A623&color=0A1628',
    style: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      border: '2px solid rgba(245,166,35,0.55)',
      flexShrink: 0,
      objectFit: 'cover'
    },
    alt: "avatar"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 700,
      fontSize: '13px',
      color: 'rgba(255,255,255,0.88)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      lineHeight: 1.3
    }
  }, user.displayName || 'User'), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '11px',
      color: 'rgba(255,255,255,0.35)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      marginTop: '2px'
    }
  }, user.email)), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setShowSettingsModal(true);
      setDrawerOpen(false);
    },
    style: {
      padding: '7px',
      borderRadius: '8px',
      background: 'rgba(255,255,255,0.06)',
      border: 'none',
      cursor: 'pointer',
      color: 'rgba(255,255,255,0.5)',
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
  })))) : /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setShowUserMenu(true);
      setDrawerOpen(false);
    },
    style: {
      width: '100%',
      padding: '11px',
      background: '#F5A623',
      color: '#0A1628',
      fontWeight: 700,
      fontSize: '13px',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "7",
    r: "4"
  })), t('login'), " / Sign Up")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '1px',
      background: 'rgba(255,255,255,0.07)',
      margin: '0 16px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 16px'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '10px',
      fontWeight: 700,
      color: 'rgba(255,255,255,0.25)',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      marginBottom: '6px',
      paddingLeft: '4px'
    }
  }, "Categories"), tabs.map(tab => /*#__PURE__*/React.createElement("button", {
    key: tab.id,
    onClick: () => {
      setActiveTab(tab.id);
      setDrawerOpen(false);
    },
    style: {
      width: '100%',
      padding: '9px 10px',
      borderRadius: '9px',
      textAlign: 'left',
      fontWeight: activeTab === tab.id ? 700 : 400,
      fontSize: '13px',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '2px',
      background: activeTab === tab.id ? 'rgba(245,166,35,0.12)' : 'transparent',
      color: activeTab === tab.id ? '#F5A623' : 'rgba(255,255,255,0.72)'
    },
    className: activeTab !== tab.id ? 'hover:bg-white/5 transition-colors' : ''
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '14px',
      flexShrink: 0,
      width: '20px',
      textAlign: 'center'
    }
  }, tab.icon), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, tab.label), activeTab === tab.id && /*#__PURE__*/React.createElement("div", {
    style: {
      width: '5px',
      height: '5px',
      borderRadius: '50%',
      background: '#F5A623',
      flexShrink: 0
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '1px',
      background: 'rgba(255,255,255,0.07)',
      margin: '0 16px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 16px'
    }
  }, [{
    id: 'about',
    icon: 'ℹ️',
    label: 'About Us'
  }, {
    id: 'contact',
    icon: '📬',
    label: 'Contact Us'
  }, {
    id: 'privacy',
    icon: '🔒',
    label: 'Privacy Policy'
  }, {
    id: 'terms',
    icon: '📋',
    label: 'Terms & Conditions'
  }].map(pg => /*#__PURE__*/React.createElement("button", {
    key: pg.id,
    onClick: () => {
      setActivePage(pg.id);
      setDrawerOpen(false);
    },
    style: {
      width: '100%',
      padding: '9px 10px',
      borderRadius: '9px',
      textAlign: 'left',
      fontWeight: 400,
      fontSize: '13px',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '2px',
      background: 'transparent',
      color: 'rgba(255,255,255,0.72)'
    },
    className: "hover:bg-white/5 transition-colors"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '14px',
      flexShrink: 0,
      width: '20px',
      textAlign: 'center'
    }
  }, pg.icon), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, pg.label), /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,0.3)",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "9 18 15 12 9 6"
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '1px',
      background: 'rgba(255,255,255,0.07)',
      margin: '0 16px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 12px',
      background: 'rgba(255,255,255,0.04)',
      borderRadius: '10px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '15px'
    }
  }, "\uD83D\uDD14"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '13px',
      color: 'rgba(255,255,255,0.8)',
      fontWeight: 500
    }
  }, "Breaking Alerts"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '10px',
      color: 'rgba(255,255,255,0.28)',
      marginTop: '1px'
    }
  }, notifEnabled ? 'ON' : 'OFF'))), /*#__PURE__*/React.createElement("div", {
    onClick: handleNotifToggle,
    style: {
      width: '38px',
      height: '21px',
      borderRadius: '11px',
      background: notifEnabled ? '#F5A623' : 'rgba(255,255,255,0.12)',
      cursor: 'pointer',
      position: 'relative',
      transition: 'background 0.25s',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '3px',
      left: notifEnabled ? '19px' : '3px',
      width: '15px',
      height: '15px',
      borderRadius: '50%',
      background: 'white',
      transition: 'left 0.25s',
      boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 16px 12px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase());
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || !!window.navigator.standalone;
      setDrawerOpen(false);
      if (isStandalone) {
        setTimeout(() => alert('KWT News is already installed on your device!'), 300);
      } else if (window.kwtInstallReady && window.installPWA) {
        setTimeout(() => window.installPWA(), 300);
      } else if (isIOS) {
        setTimeout(() => alert('To install: tap the Share icon (\u{1F4E4}) at the bottom of Safari \u2192 "Add to Home Screen"'), 300);
      } else {
        setTimeout(() => {
          const el = document.getElementById('install-prompt');
          if (el) el.classList.add('show');else alert('Open KWT News in Chrome or Edge to install it.');
        }, 300);
      }
    },
    style: {
      width: '100%',
      padding: '11px 14px',
      background: 'linear-gradient(135deg,rgba(245,166,35,0.12),rgba(245,166,35,0.06))',
      border: '1px solid rgba(245,166,35,0.25)',
      borderRadius: '12px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '34px',
      height: '34px',
      borderRadius: '9px',
      background: 'rgba(245,166,35,0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#F5A623",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "7 10 12 15 17 10"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "15",
    x2: "12",
    y2: "3"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '13px',
      color: 'rgba(255,255,255,0.9)',
      fontWeight: 700,
      margin: 0,
      lineHeight: 1.3
    }
  }, "Install App"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '10px',
      color: 'rgba(255,255,255,0.35)',
      margin: 0,
      marginTop: '2px'
    }
  }, "Add KWT News to home screen")), /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(245,166,35,0.55)",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "9 18 15 12 9 6"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 16px 24px',
      marginTop: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '1px',
      background: 'rgba(255,255,255,0.07)',
      marginBottom: '16px'
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '10px',
      fontWeight: 700,
      color: 'rgba(255,255,255,0.25)',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      marginBottom: '10px',
      textAlign: 'center'
    }
  }, "Follow Us"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '8px',
      marginBottom: '14px',
      justifyContent: 'center',
      flexWrap: 'wrap'
    }
  }, [{
    href: 'https://twitter.com/kwtnews_com',
    label: '@kwtnews_com',
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "13",
      height: "13",
      fill: "currentColor",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
    }))
  }, {
    href: 'https://instagram.com/kwtnews_com',
    label: '@kwtnews_com',
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "13",
      height: "13",
      fill: "currentColor",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
    }))
  }, {
    href: 'https://youtube.com/@kwtnews_com',
    label: '@kwtnews_com',
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "13",
      height: "13",
      fill: "currentColor",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
    }))
  }, {
    href: 'https://tiktok.com/@kwtnews.com',
    label: 'kwtnews.com',
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "13",
      height: "13",
      fill: "currentColor",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"
    }))
  }, {
    href: 'https://t.me/kwtnews_com',
    label: 'kwtnews_com',
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "13",
      height: "13",
      fill: "currentColor",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
    }))
  }, {
    href: 'mailto:kwtnews.com@gmail.com',
    label: 'Email',
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "13",
      height: "13",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "22,6 12,13 2,6"
    }))
  }].map(s => /*#__PURE__*/React.createElement("div", {
    key: s.href,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '3px'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: s.href,
    target: s.href.startsWith('mailto') ? undefined : '_blank',
    rel: "noopener noreferrer",
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '34px',
      height: '34px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.08)',
      color: 'rgba(255,255,255,0.55)',
      textDecoration: 'none'
    },
    className: "hover:bg-white/15 hover:text-white transition-colors"
  }, s.icon), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '8px',
      color: 'rgba(255,255,255,0.25)',
      userSelect: 'none'
    }
  }, s.label)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginBottom: '8px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setActivePage('contact');
      setDrawerOpen(false);
    },
    style: {
      fontSize: '10px',
      color: 'rgba(255,255,255,0.25)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0
    }
  }, t('contact')), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'rgba(255,255,255,0.15)',
      fontSize: '10px'
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setActivePage('privacy');
      setDrawerOpen(false);
    },
    style: {
      fontSize: '10px',
      color: 'rgba(255,255,255,0.25)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0
    }
  }, t('privacy')), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'rgba(255,255,255,0.15)',
      fontSize: '10px'
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("a", {
    href: "mailto:kwtnews.com@gmail.com",
    style: {
      fontSize: '10px',
      color: 'rgba(255,255,255,0.25)',
      textDecoration: 'none'
    }
  }, "Report")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '9px',
      color: 'rgba(255,255,255,0.15)',
      textAlign: 'center'
    }
  }, "\xA9 2026 kwtnews.com")))), logoutConfirm && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 500,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.65)',
      backdropFilter: 'blur(6px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      borderRadius: '20px',
      padding: '28px 24px',
      width: '300px',
      maxWidth: '88vw',
      boxShadow: '0 24px 72px rgba(0,0,0,0.5)',
      textAlign: 'center'
    },
    className: "dark:bg-gray-900"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '44px',
      marginBottom: '12px'
    }
  }, "\uD83D\uDC4B"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 800,
      fontSize: '17px',
      marginBottom: '6px'
    },
    className: "text-gray-900 dark:text-white"
  }, "Log out?"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '13px',
      color: '#9ca3af',
      marginBottom: '24px',
      lineHeight: 1.5
    }
  }, "Are you sure you want to sign out?"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setLogoutConfirm(false),
    style: {
      flex: 1,
      padding: '11px',
      borderRadius: '12px',
      border: '1.5px solid #e5e7eb',
      background: 'transparent',
      fontWeight: 600,
      fontSize: '13px',
      cursor: 'pointer'
    },
    className: "text-gray-700 dark:text-gray-300 dark:border-gray-700"
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    onClick: handleLogoutConfirmed,
    style: {
      flex: 1,
      padding: '11px',
      borderRadius: '12px',
      border: 'none',
      background: '#ef4444',
      color: 'white',
      fontWeight: 700,
      fontSize: '13px',
      cursor: 'pointer'
    }
  }, "Log Out")))), searchOpen && /*#__PURE__*/React.createElement(SearchModal, {
    onClose: () => setSearchOpen(false),
    onSelectNews: item => {
      setSearchOpen(false);
      onReadMore && onReadMore(item);
    }
  }), activePage && /*#__PURE__*/React.createElement(StaticPageModal, {
    page: activePage,
    onClose: () => setActivePage(null)
  }), /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 40,
      background: '#0A1628',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      maxWidth: '1280px',
      margin: '0 auto',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "/",
    style: {
      textDecoration: 'none',
      flexShrink: 0
    },
    className: "hover:opacity-90 transition-opacity"
  }, /*#__PURE__*/React.createElement(Logo, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '2px',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setSearchOpen(true),
    style: {
      padding: '8px',
      borderRadius: '8px',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: 'white',
      display: 'flex',
      alignItems: 'center'
    },
    className: "hover:bg-white/10 transition-colors",
    "aria-label": "Search"
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "8"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "21",
    y1: "21",
    x2: "16.65",
    y2: "16.65"
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: toggleTheme,
    style: {
      padding: '8px',
      borderRadius: '8px',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: 'white',
      display: 'flex',
      alignItems: 'center'
    },
    className: "hover:bg-white/10 transition-colors",
    "aria-label": "Toggle theme"
  }, isDark ? /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "5"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "1",
    x2: "12",
    y2: "3"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "21",
    x2: "12",
    y2: "23"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "4.22",
    y1: "4.22",
    x2: "5.64",
    y2: "5.64"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "18.36",
    y1: "18.36",
    x2: "19.78",
    y2: "19.78"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "1",
    y1: "12",
    x2: "3",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "21",
    y1: "12",
    x2: "23",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "4.22",
    y1: "19.78",
    x2: "5.64",
    y2: "18.36"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "18.36",
    y1: "5.64",
    x2: "19.78",
    y2: "4.22"
  })) : /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowLangMenu(!showLangMenu),
    style: {
      padding: '6px 10px',
      borderRadius: '8px',
      background: 'rgba(255,255,255,0.08)',
      border: '1px solid rgba(255,255,255,0.12)',
      cursor: 'pointer',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      fontSize: '12px',
      fontWeight: 600
    },
    className: "hover:bg-white/15 transition-colors",
    title: t('language')
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '14px'
    }
  }, languages.find(l => l.code === currentLang)?.flag || '🇺🇸'), /*#__PURE__*/React.createElement("span", {
    style: {
      letterSpacing: '0.03em'
    }
  }, (currentLang || 'en').toUpperCase())), showLangMenu && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 40
    },
    onClick: () => setShowLangMenu(false)
  }), /*#__PURE__*/React.createElement("div", {
    className: "lang-dropdown dark:bg-gray-800",
    style: {
      position: 'absolute',
      right: 0,
      top: '100%',
      marginTop: '8px',
      width: '220px',
      zIndex: 50,
      borderRadius: '14px',
      boxShadow: '0 16px 48px rgba(0,0,0,0.25)',
      border: '1px solid rgba(0,0,0,0.12)',
      overflow: 'hidden',
      background: '#ffffff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 14px',
      borderBottom: '1px solid rgba(0,0,0,0.06)',
      background: '#0A1628'
    },
    className: "dark:border-gray-700"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '11px',
      fontWeight: 700,
      color: '#F5A623',
      textTransform: 'uppercase',
      letterSpacing: '0.08em'
    }
  }, "\uD83C\uDF10 Language"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowLangMenu(false),
    style: {
      padding: '3px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.1)',
      border: 'none',
      cursor: 'pointer',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  })))), languages.map(lang => /*#__PURE__*/React.createElement("button", {
    key: lang.code,
    onClick: () => {
      changeLanguage(lang.code);
      setShowLangMenu(false);
    },
    style: {
      width: '100%',
      padding: '10px 14px',
      textAlign: 'left',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '13px',
      border: 'none',
      cursor: 'pointer',
      background: currentLang === lang.code ? 'rgba(245,166,35,0.08)' : 'transparent',
      color: currentLang === lang.code ? '#F5A623' : '#1a1a1a',
      fontWeight: currentLang === lang.code ? 700 : 400
    },
    className: "hover:bg-gray-100 transition-colors"
  }, /*#__PURE__*/React.createElement("span", null, lang.flag), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, lang.name), currentLang === lang.code && /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#F5A623",
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "20 6 9 17 4 12"
  }))))))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setDrawerOpen(true),
    style: {
      padding: '8px',
      marginLeft: '4px',
      borderRadius: '8px',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0
    },
    className: "hover:bg-white/10 transition-colors",
    "aria-label": "Open menu"
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "22",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "12",
    x2: "21",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "6",
    x2: "21",
    y2: "6"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "18",
    x2: "21",
    y2: "18"
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid rgba(255,255,255,0.06)',
      overflowX: 'auto',
      scrollbarWidth: 'none',
      WebkitOverflowScrolling: 'touch'
    },
    className: "hide-scrollbar"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '0',
      padding: '0 12px',
      maxWidth: '1280px',
      margin: '0 auto',
      minWidth: 'max-content'
    }
  }, tabs.map(tab => /*#__PURE__*/React.createElement("button", {
    key: tab.id,
    onClick: () => setActiveTab(tab.id),
    style: {
      padding: '10px 14px',
      fontSize: '12px',
      fontWeight: activeTab === tab.id ? 700 : 500,
      border: 'none',
      cursor: 'pointer',
      background: 'transparent',
      color: activeTab === tab.id ? '#F5A623' : 'rgba(255,255,255,0.55)',
      position: 'relative',
      transition: 'all 0.2s',
      whiteSpace: 'nowrap',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      letterSpacing: '0.01em'
    },
    className: activeTab !== tab.id ? 'hover:text-white transition-colors' : ''
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '13px'
    }
  }, tab.icon), tab.label, activeTab === tab.id && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: '12px',
      right: '12px',
      height: '1.5px',
      background: '#FF0000',
      borderRadius: '2px 2px 0 0'
    }
  })))))), showUserMenu && !user && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 150,
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)'
    },
    onClick: () => setShowUserMenu(false)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%,-50%)',
      width: '340px',
      maxWidth: '90vw',
      zIndex: 160,
      borderRadius: '20px',
      boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
      overflow: 'hidden',
      background: '#ffffff'
    },
    className: "dark:bg-gray-900"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 20px',
      background: 'linear-gradient(135deg,#0A1628,#1a2744)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(Logo, null), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowUserMenu(false),
    style: {
      padding: '6px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.1)',
      border: 'none',
      cursor: 'pointer',
      color: 'white',
      display: 'flex',
      alignItems: 'center'
    },
    className: "hover:bg-white/20 transition-colors"
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  })))), /*#__PURE__*/React.createElement(LoginModal, {
    onClose: () => setShowUserMenu(false)
  }))), showSavedModal && /*#__PURE__*/React.createElement(SavedNewsModal, {
    onClose: () => setShowSavedModal(false),
    onReadMore: onReadMore || (() => {})
  }), showLikedModal && /*#__PURE__*/React.createElement(LikedNewsModal, {
    onClose: () => setShowLikedModal(false),
    onReadMore: onReadMore || (() => {})
  }), showSettingsModal && /*#__PURE__*/React.createElement(SettingsModal, {
    onClose: () => setShowSettingsModal(false)
  }));
};

// Login Modal Component
const LoginModal = ({
  onClose
}) => {
  const {
    loginWithEmail,
    registerWithEmail
  } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const clearState = () => {
    setError('');
    setSuccess('');
  };
  const switchMode = m => {
    setMode(m);
    clearState();
    setPassword('');
    setConfirm('');
  };

  // Friendly Firebase error messages
  const friendlyError = code => {
    const map = {
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/invalid-credential': 'Invalid email or password.',
      'auth/email-already-in-use': 'This email is already registered. Please login.',
      'auth/weak-password': 'Password must be at least 6 characters.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/popup-closed-by-user': 'Sign-in popup was closed.'
    };
    return map[code] || 'Something went wrong. Please try again.';
  };
  const handleSubmit = async e => {
    e.preventDefault();
    clearState();
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    if (mode === 'register') {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPass) {
        setError('Passwords do not match.');
        return;
      }
    }
    setLoading(true);
    try {
      if (mode === 'login') {
        await loginWithEmail(email.trim(), password);
      } else {
        await registerWithEmail(email.trim(), password, name.trim());
      }
      onClose();
    } catch (err) {
      const code = err.code || '';
      setError(friendlyError(code));
    } finally {
      setLoading(false);
    }
  };
  const handleForgot = async e => {
    e.preventDefault();
    clearState();
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      await auth.sendPasswordResetEmail(email.trim());
      setSuccess('✅ Reset link sent! Check your email inbox (and spam folder).');
    } catch (err) {
      const code = err.code || '';
      setError(friendlyError(code));
    } finally {
      setLoading(false);
    }
  };
  const inp = {
    width: '100%',
    padding: '11px 14px',
    borderRadius: '10px',
    border: '1.5px solid #e5e7eb',
    background: '#f9fafb',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
    color: '#111827'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '22px 20px 24px',
      maxHeight: '82vh',
      overflowY: 'auto'
    },
    className: "hide-scrollbar"
  }, mode !== 'forgot' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      borderRadius: '10px',
      background: '#f3f4f6',
      padding: '3px',
      gap: '3px',
      marginBottom: '18px'
    }
  }, [['login', 'Login'], ['register', 'Create Account']].map(([m, label]) => /*#__PURE__*/React.createElement("button", {
    key: m,
    type: "button",
    onClick: () => switchMode(m),
    style: {
      flex: 1,
      padding: '8px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: 700,
      transition: 'all 0.15s',
      background: mode === m ? '#fff' : 'transparent',
      color: mode === m ? '#0A1628' : '#6b7280',
      boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.1)' : 'none'
    }
  }, label))), mode === 'forgot' && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: '16px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => switchMode('login'),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '12px',
      color: '#6b7280',
      padding: 0,
      marginBottom: '10px'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "15 18 9 12 15 6"
  })), "Back to Login"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 800,
      fontSize: '16px',
      margin: '0 0 4px',
      color: '#111827'
    }
  }, "Reset Password"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '12px',
      color: '#6b7280',
      lineHeight: 1.5,
      margin: 0
    }
  }, "Enter your email and we'll send a reset link.")), error && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 13px',
      background: 'rgba(239,68,68,0.08)',
      border: '1px solid rgba(239,68,68,0.2)',
      borderRadius: '9px',
      fontSize: '12.5px',
      color: '#dc2626',
      marginBottom: '13px',
      lineHeight: 1.5
    }
  }, error), successMsg && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 13px',
      background: 'rgba(34,197,94,0.08)',
      border: '1px solid rgba(34,197,94,0.2)',
      borderRadius: '9px',
      fontSize: '12.5px',
      color: '#16a34a',
      marginBottom: '13px',
      lineHeight: 1.5
    }
  }, successMsg), mode === 'forgot' ? /*#__PURE__*/React.createElement("form", {
    onSubmit: handleForgot,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '11px'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "email",
    placeholder: "Email address",
    value: email,
    onChange: e => setEmail(e.target.value),
    style: inp,
    required: true,
    autoFocus: true
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: loading,
    style: {
      width: '100%',
      padding: '12px',
      borderRadius: '10px',
      border: 'none',
      background: '#F5A623',
      color: '#0A1628',
      fontWeight: 800,
      fontSize: '14px',
      cursor: loading ? 'not-allowed' : 'pointer',
      opacity: loading ? 0.65 : 1,
      boxShadow: '0 3px 10px rgba(245,166,35,0.3)'
    }
  }, loading ? 'Sending...' : '📧 Send Reset Link')) :
  /*#__PURE__*/
  /* ── LOGIN / REGISTER FORM ── */
  React.createElement("form", {
    onSubmit: handleSubmit,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '11px'
    }
  }, mode === 'register' && /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Full Name",
    value: name,
    onChange: e => setName(e.target.value),
    style: inp,
    required: true,
    autoFocus: true
  }), /*#__PURE__*/React.createElement("input", {
    type: "email",
    placeholder: "Email address",
    value: email,
    onChange: e => setEmail(e.target.value),
    style: inp,
    required: true,
    autoFocus: mode === 'login'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: showPass ? 'text' : 'password',
    placeholder: "Password",
    value: password,
    onChange: e => setPassword(e.target.value),
    style: {
      ...inp,
      paddingRight: '42px'
    },
    required: true,
    minLength: 6
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setShowPass(p => !p),
    style: {
      position: 'absolute',
      right: '11px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#9ca3af',
      padding: '3px',
      display: 'flex'
    }
  }, showPass ? /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "1",
    y1: "1",
    x2: "23",
    y2: "23"
  })) : /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3"
  })))), mode === 'register' && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: showConf ? 'text' : 'password',
    placeholder: "Confirm Password",
    value: confirmPass,
    onChange: e => setConfirm(e.target.value),
    style: {
      ...inp,
      paddingRight: '42px',
      borderColor: confirmPass && confirmPass !== password ? '#ef4444' : '#e5e7eb'
    },
    required: true,
    minLength: 6
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setShowConf(p => !p),
    style: {
      position: 'absolute',
      right: '11px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#9ca3af',
      padding: '3px',
      display: 'flex'
    }
  }, showConf ? /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "1",
    y1: "1",
    x2: "23",
    y2: "23"
  })) : /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3"
  })))), mode === 'login' && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right',
      marginTop: '-2px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => switchMode('forgot'),
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '12px',
      color: '#F5A623',
      fontWeight: 600,
      padding: 0
    }
  }, "Forgot password?")), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: loading,
    style: {
      width: '100%',
      padding: '12px',
      borderRadius: '10px',
      border: 'none',
      background: '#F5A623',
      color: '#0A1628',
      fontWeight: 800,
      fontSize: '14px',
      cursor: loading ? 'not-allowed' : 'pointer',
      opacity: loading ? 0.65 : 1,
      boxShadow: '0 3px 12px rgba(245,166,35,0.35)',
      marginTop: '2px'
    }
  }, loading ? 'Please wait...' : mode === 'login' ? '🔐 Login' : '🚀 Create Account')));
};

// Lazy-load video src when it enters the viewport
const useLazyVideoSrc = src => {
  const [activeSrc, setActiveSrc] = useState(null);
  const ref = useRef(null);
  useEffect(() => {
    if (!src) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setActiveSrc(src);
        observer.disconnect();
      }
    }, {
      rootMargin: '200px'
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [src]);
  return [activeSrc, ref];
};

// News Card Component
const NewsCard = ({
  news,
  index,
  onReadMore,
  likedPosts = [],
  savedPosts = [],
  onLikeToggle,
  onSaveToggle
}) => {
  const {
    t
  } = useTranslation();
  const {
    user,
    loading: authLoading
  } = useAuth(); // FIX: track auth loading separately
  const {
    addNotification
  } = useNotifications();
  // Anonymous like state — persisted in localStorage for non-logged-in users
  const [anonLikedPosts, setAnonLikedPosts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('kwtAnonLikedPosts') || '[]');
    } catch (e) {
      return [];
    }
  });
  const isLiked = user ? likedPosts.includes(news.id) : anonLikedPosts.includes(news.id);
  const isSaved = savedPosts.includes(news.id);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);

  // FIX 22: Lock body scroll on iOS when share bottom sheet is open
  useEffect(() => {
    if (shareMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [shareMenuOpen]);
  const [views, setViews] = useState(news.views || 0);
  const [likes, setLikes] = useState(news.likes || 0);
  const [commentCount, setCommentCount] = useState(news.commentCount || 0);
  const likePendingRef = useRef(false); // Prevents duplicate like calls

  // Increment views once per session (debounced 3s, sessionStorage guard)
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const viewedKey = 'kwtViewedPosts';
        const viewed = JSON.parse(sessionStorage.getItem(viewedKey) || '[]');
        if (viewed.includes(news.id)) return; // Already counted this session
        await db.collection('news').doc(news.id).update({
          views: firebase.firestore.FieldValue.increment(1)
        });
        sessionStorage.setItem(viewedKey, JSON.stringify([...viewed, news.id]));
      } catch (e) {}
    }, 3000);
    return () => clearTimeout(timer);
  }, [news.id]);

  // Sync local counts when parent news prop updates (via feed's onSnapshot — no extra Firestore connection needed per card)
  useEffect(() => {
    if (typeof news.likes === 'number') setLikes(news.likes);
    if (typeof news.commentCount === 'number') setCommentCount(news.commentCount);
    if (typeof news.views === 'number') setViews(news.views);
  }, [news.likes, news.commentCount, news.views]);
  const handleLike = async () => {
    if (likePendingRef.current) return; // Prevent double-tap
    likePendingRef.current = true;
    const wasLiked = isLiked;
    const prevLikes = likes;
    setLikes(p => wasLiked ? Math.max(0, p - 1) : p + 1);
    try {
      const newsRef = db.collection('news').doc(news.id);
      if (user) {
        // Logged-in: use Firebase user doc
        onLikeToggle && onLikeToggle(news.id, !isLiked);
        const userRef = db.collection('users').doc(user.uid);
        if (wasLiked) {
          await newsRef.update({
            likes: firebase.firestore.FieldValue.increment(-1)
          });
          await userRef.update({
            likedPosts: firebase.firestore.FieldValue.arrayRemove(news.id)
          });
        } else {
          await newsRef.update({
            likes: firebase.firestore.FieldValue.increment(1)
          });
          await userRef.update({
            likedPosts: firebase.firestore.FieldValue.arrayUnion(news.id)
          });
        }
      } else {
        // Anonymous: use localStorage
        const updated = wasLiked ? anonLikedPosts.filter(id => id !== news.id) : [...anonLikedPosts, news.id];
        setAnonLikedPosts(updated);
        try {
          localStorage.setItem('kwtAnonLikedPosts', JSON.stringify(updated));
        } catch (e) {}
        await newsRef.update({
          likes: firebase.firestore.FieldValue.increment(wasLiked ? -1 : 1)
        });
      }
    } catch (error) {
      console.error('Like error:', error);
      if (user) onLikeToggle && onLikeToggle(news.id, wasLiked);else setAnonLikedPosts(anonLikedPosts); // rollback
      setLikes(prevLikes);
    } finally {
      likePendingRef.current = false;
    }
  };
  const handleSave = async () => {
    if (!user) {
      addNotification({
        message: t('loginToSave'),
        type: 'info'
      });
      return;
    }
    // FIX 26: Optimistic update — instant UI, rollback on error
    const wasSaved = isSaved;
    onSaveToggle && onSaveToggle(news.id, !isSaved);
    addNotification({
      message: wasSaved ? t('removedFromSaved') : t('savedToProfile'),
      type: 'success'
    });
    try {
      const userRef = db.collection('users').doc(user.uid);
      if (wasSaved) {
        await userRef.update({
          savedPosts: firebase.firestore.FieldValue.arrayRemove(news.id)
        });
      } else {
        await userRef.update({
          savedPosts: firebase.firestore.FieldValue.arrayUnion(news.id)
        });
      }
    } catch (error) {
      console.error('Save error:', error);
      // FIX 12: Rollback and notify on failure
      onSaveToggle && onSaveToggle(news.id, wasSaved);
      addNotification({
        message: navigator.onLine ? '❌ Save failed, try again' : '📵 Offline — changes will not persist',
        type: 'error'
      });
    }
  };
  const handleShare = async platform => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#news-${news.id}`;
    const mediaUrl = news.videoUrl || news.imageUrl || '';
    const shareText = `📰 ${news.title}\n\n${news.summary?.substring(0, 120)}...\n${mediaUrl ? `\n🖼️ ${mediaUrl}\n` : ''}\n🔗 ${shareUrl}\nVia: KWT News — kwtnews.com`;

    // Try native share first (mobile)
    if (platform === 'native' && navigator.share) {
      try {
        await navigator.share({
          title: news.title,
          text: shareText,
          url: shareUrl
        });
        setShareMenuOpen(false);
        return;
      } catch (e) {}
    }
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank', 'noopener,noreferrer');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank', 'noopener,noreferrer');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank', 'noopener,noreferrer');
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(news.title)}`, '_blank', 'noopener,noreferrer');
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(shareUrl);
        } catch (e) {
          const el = document.createElement('textarea');
          el.value = shareUrl;
          document.body.appendChild(el);
          el.select();
          document.execCommand('copy');
          document.body.removeChild(el);
        }
        addNotification({
          message: t('linkCopied'),
          type: 'success'
        });
        break;
    }
    setShareMenuOpen(false);
  };
  const totalEngagement = views + likes + commentCount;

  // Check if video — mediaType is always "article" per schema; only videoUrl tells us it's a video
  const isVideo = !!(news.videoUrl && news.videoUrl.trim());
  // Lazy-load video src
  const [lazyVideoSrc, videoContainerRef] = useLazyVideoSrc(isVideo ? news.videoUrl : null);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("article", {
    className: "news-card-premium bg-light-card dark:bg-dark-card overflow-hidden transition-all duration-300",
    style: {
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      marginBottom: '20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: videoContainerRef,
    className: "relative overflow-hidden",
    style: {
      aspectRatio: '16/9',
      background: '#e5e7eb',
      cursor: 'pointer'
    },
    onClick: () => onReadMore && onReadMore(news)
  }, isVideo ? /*#__PURE__*/React.createElement("video", {
    src: lazyVideoSrc || undefined,
    controls: true,
    className: "w-full h-full object-cover",
    poster: news.thumbnail || news.thumbnailUrl || '',
    preload: "none",
    onClick: e => e.stopPropagation(),
    onPlay: e => e.stopPropagation()
  }) : /*#__PURE__*/React.createElement("img", {
    src: news.imageUrl || 'https://placehold.co/800x450/0A1628/F5A623?text=KWT+News',
    alt: news.title,
    className: "w-full h-full object-cover hover:scale-105 transition-transform duration-700",
    loading: "lazy",
    decoding: "async",
    onError: e => {
      e.target.src = 'https://placehold.co/800x450/0A1628/F5A623?text=KWT+News';
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "kwt-source-badge absolute bottom-3 left-3 flex items-center gap-2"
  }, news.sourceLogo && /*#__PURE__*/React.createElement("img", {
    src: news.sourceLogo,
    alt: news.source,
    className: "w-4 h-4 rounded-full object-cover"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'rgba(255,255,255,0.92)',
      fontSize: '11px',
      fontWeight: 600
    }
  }, news.source || 'KWT News')), /*#__PURE__*/React.createElement("div", {
    className: "kwt-view-badge absolute top-3 right-3 flex items-center gap-1"
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "11",
    height: "11",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "white",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'white',
      fontSize: '11px',
      fontWeight: 700
    }
  }, views >= 1000 ? (views / 1000).toFixed(1) + 'K' : views))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 md:p-5",
    style: {
      paddingBottom: '14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      cursor: 'pointer'
    },
    onClick: () => onReadMore && onReadMore(news)
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-3 flex-wrap"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '11px',
      fontWeight: 600,
      color: '#F5A623',
      letterSpacing: '0.01em'
    }
  }, /*#__PURE__*/React.createElement(TimeAgo, {
    date: news.timestamp
  })), news.category && news.category !== 'all' && /*#__PURE__*/React.createElement("span", {
    className: "kwt-category-badge"
  }, news.category)), /*#__PURE__*/React.createElement("h2", {
    className: "news-title-premium mb-2.5 text-light-text dark:text-dark-text hover:text-accent transition-colors cursor-pointer line-clamp-2"
  }, news.title), /*#__PURE__*/React.createElement("p", {
    className: "news-desc-premium mb-0 line-clamp-2"
  }, news.summary || news.content?.substring(0, 120), "...")), /*#__PURE__*/React.createElement("div", {
    className: "kwt-engagement-bar flex items-center justify-between",
    onClick: e => e.stopPropagation(),
    onMouseDown: e => e.stopPropagation(),
    onTouchStart: e => e.stopPropagation(),
    onTouchEnd: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: e => {
      e.stopPropagation();
      handleLike();
    },
    className: `card-action-btn px-3 rounded-xl text-sm font-semibold transition-all ${isLiked ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500'}`
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "17",
    height: "17",
    viewBox: "0 0 24 24",
    fill: isLiked ? "currentColor" : "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
  })), /*#__PURE__*/React.createElement("span", null, likes > 0 ? likes : '')), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: e => {
      e.stopPropagation();
      setShowCommentModal(true);
    },
    className: `card-action-btn px-3 rounded-xl text-sm font-semibold transition-all text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500`
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "17",
    height: "17",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
  })), /*#__PURE__*/React.createElement("span", null, commentCount || '')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: e => {
      e.stopPropagation();
      setShareMenuOpen(!shareMenuOpen);
    },
    className: "card-action-btn px-3 rounded-xl text-sm font-semibold text-gray-500 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 transition-all"
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "17",
    height: "17",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "18",
    cy: "5",
    r: "3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "6",
    cy: "12",
    r: "3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "18",
    cy: "19",
    r: "3"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "8.59",
    y1: "13.51",
    x2: "15.42",
    y2: "17.49"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "15.41",
    y1: "6.51",
    x2: "8.59",
    y2: "10.49"
  })))), shareMenuOpen && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 9990,
      background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(2px)'
    },
    onClick: () => setShareMenuOpen(false)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      borderRadius: '20px 20px 0 0',
      background: '#fff',
      boxShadow: '0 -8px 40px rgba(0,0,0,0.2)',
      padding: '0 0 24px',
      animation: 'modalUp 0.25s ease-out'
    },
    className: "dark:bg-gray-900"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      padding: '10px 0 4px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '36px',
      height: '4px',
      borderRadius: '2px',
      background: '#e5e7eb'
    },
    className: "dark:bg-gray-700"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 20px 14px',
      borderBottom: '1px solid #f3f4f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    className: "dark:border-gray-800"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 700,
      fontSize: '15px',
      marginBottom: '3px'
    },
    className: "text-gray-900 dark:text-white"
  }, t('shareVia')), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '12px',
      color: '#9ca3af',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, news.title)), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShareMenuOpen(false),
    style: {
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      marginLeft: '12px'
    },
    className: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-red-100 hover:text-red-500 transition-colors"
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: '4px',
      padding: '16px 12px'
    }
  }, [{
    p: 'whatsapp',
    bg: '#25D366',
    label: 'WhatsApp',
    icon: /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: "24",
      height: "24",
      fill: "white"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M11.993 0C5.366 0 0 5.373 0 12.008c0 2.117.554 4.102 1.522 5.831L0 24l6.335-1.652C8.01 23.342 9.96 24 12 24c6.627 0 12-5.373 12-11.992C24 5.376 18.627.001 11.993 0zm.007 22c-1.846 0-3.655-.5-5.23-1.44l-.374-.223-3.884 1.012 1.042-3.782-.246-.393A9.934 9.934 0 0 1 2 12.008C2 6.481 6.477 2 11.993 2 17.52 2 22 6.482 22 12.008 22 17.532 17.522 22 11.993 22z"
    }))
  }, {
    p: 'facebook',
    bg: '#1877F2',
    label: 'Facebook',
    icon: /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: "24",
      height: "24",
      fill: "white"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
    }))
  }, {
    p: 'twitter',
    bg: '#000000',
    label: 'X (Twitter)',
    icon: /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: "24",
      height: "24",
      fill: "white"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
    }))
  }, {
    p: 'telegram',
    bg: '#0088cc',
    label: 'Telegram',
    icon: /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: "24",
      height: "24",
      fill: "white"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
    }))
  }, {
    p: 'copy',
    bg: '#6366f1',
    label: t('copyLink'),
    icon: /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: "24",
      height: "24",
      fill: "none",
      stroke: "white",
      strokeWidth: "2.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
    }))
  }].map(s => /*#__PURE__*/React.createElement("button", {
    key: s.p,
    onClick: () => handleShare(s.p),
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '6px',
      padding: '12px 6px',
      borderRadius: '14px',
      border: 'none',
      cursor: 'pointer',
      background: 'transparent'
    },
    className: "hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '50px',
      height: '50px',
      borderRadius: '14px',
      background: s.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, s.icon), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '11px',
      fontWeight: 500,
      color: '#374151',
      textAlign: 'center',
      lineHeight: 1.2
    },
    className: "dark:text-gray-300"
  }, s.label))), navigator.share && /*#__PURE__*/React.createElement("button", {
    onClick: () => handleShare('native'),
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '6px',
      padding: '12px 6px',
      borderRadius: '14px',
      border: 'none',
      cursor: 'pointer',
      background: 'transparent'
    },
    className: "hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '50px',
      height: '50px',
      borderRadius: '14px',
      background: '#F5A623',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "24",
    height: "24",
    fill: "none",
    stroke: "#0A1628",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "16 6 12 2 8 6"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "2",
    x2: "12",
    y2: "15"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '11px',
      fontWeight: 500,
      color: '#374151',
      textAlign: 'center',
      lineHeight: 1.2
    },
    className: "dark:text-gray-300"
  }, "More"))))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: e => {
      e.stopPropagation();
      handleSave();
    },
    className: `card-action-btn px-3 rounded-xl text-sm font-semibold transition-all ${isSaved ? 'text-accent bg-amber-50 dark:bg-amber-900/20' : 'text-gray-500 dark:text-gray-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-accent'}`
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "17",
    height: "17",
    viewBox: "0 0 24 24",
    fill: isSaved ? "currentColor" : "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
  })))), /*#__PURE__*/React.createElement("div", {
    onClick: () => onReadMore && onReadMore(news),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '12px',
      fontWeight: 700,
      color: '#F5A623',
      cursor: 'pointer'
    }
  }, t('readMore'), /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "9 18 15 12 9 6"
  })))))), showCommentModal && /*#__PURE__*/React.createElement(CommentModal, {
    news: news,
    onClose: () => setShowCommentModal(false)
  }));
};

// ==========================================
// NEWS DETAIL MODAL
// ==========================================
const NewsDetailModal = ({
  news,
  onClose
}) => {
  const {
    t
  } = useTranslation();
  const {
    user,
    loading: authLoading
  } = useAuth(); // FIX: track auth loading
  const {
    addNotification
  } = useNotifications();
  // Anonymous like state for detail modal
  const [anonLikedPosts, setAnonLikedPosts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('kwtAnonLikedPosts') || '[]');
    } catch (e) {
      return [];
    }
  });
  const [isLikedUser, setIsLikedUser] = useState(false);
  const isLiked = user ? isLikedUser : anonLikedPosts.includes(news.id);
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(news.likes || 0);
  const [shareOpen, setShareOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(news.commentCount || 0);
  const [readProgress, setReadProgress] = useState(0);
  const scrollRef = useRef(null);
  const modalRef = useRef(null); // FIX 18: focus trap
  useFocusTrap(modalRef);

  // FIX 19: Track reading progress
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const {
      scrollTop,
      scrollHeight,
      clientHeight
    } = el;
    const total = scrollHeight - clientHeight;
    if (total <= 0) {
      setReadProgress(100);
      return;
    }
    setReadProgress(Math.min(100, Math.round(scrollTop / total * 100)));
  }, []);
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    // FIX 15: Reset scroll position to top on every modal open
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    // FIX 6+9: GitHub Pages safe deep-link using hash, back button closes modal
    const base = window.location.pathname;
    try {
      window.history.pushState({
        newsModal: news.id
      }, '', base + '#news-' + news.id);
    } catch (e) {}
    const onPop = () => onClose();
    window.addEventListener('popstate', onPop);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('popstate', onPop);
      document.body.style.overflow = '';
      try {
        window.history.replaceState({}, '', base);
      } catch (e) {}
    };
  }, []);
  useEffect(() => {
    if (!user) return;
    const unsub = db.collection('users').doc(user.uid).onSnapshot(snap => {
      if (snap.exists) {
        const d = snap.data();
        setIsLikedUser((d.likedPosts || []).includes(news.id));
        setIsSaved((d.savedPosts || []).includes(news.id));
      }
    }, () => {});
    return () => unsub();
  }, [user?.uid, news.id]);

  // Views are counted by NewsCard (sessionStorage guard); no double-count here

  // FIX 27: Real-time listener so likes/commentCount update while modal is open
  useEffect(() => {
    const unsub = db.collection('news').doc(news.id).onSnapshot(snap => {
      if (snap.exists) {
        const d = snap.data();
        if (typeof d.likes === 'number') setLikes(d.likes);
        if (typeof d.commentCount === 'number') setCommentCount(d.commentCount);
      }
    }, () => {});
    return () => unsub();
  }, [news.id]);
  const likePendingRef = useRef(false);
  const handleLike = async () => {
    if (likePendingRef.current) return;
    likePendingRef.current = true;
    const wasLiked = isLiked;
    const prevLikes = likes;
    setLikes(p => wasLiked ? Math.max(0, p - 1) : p + 1);
    const nr = db.collection('news').doc(news.id);
    try {
      if (user) {
        setIsLikedUser(p => !p);
        const ur = db.collection('users').doc(user.uid);
        if (wasLiked) {
          await nr.update({
            likes: firebase.firestore.FieldValue.increment(-1)
          });
          await ur.update({
            likedPosts: firebase.firestore.FieldValue.arrayRemove(news.id)
          });
        } else {
          await nr.update({
            likes: firebase.firestore.FieldValue.increment(1)
          });
          await ur.update({
            likedPosts: firebase.firestore.FieldValue.arrayUnion(news.id)
          });
        }
      } else {
        // Anonymous like — localStorage
        const updated = wasLiked ? anonLikedPosts.filter(id => id !== news.id) : [...anonLikedPosts, news.id];
        setAnonLikedPosts(updated);
        try {
          localStorage.setItem('kwtAnonLikedPosts', JSON.stringify(updated));
        } catch (e) {}
        await nr.update({
          likes: firebase.firestore.FieldValue.increment(wasLiked ? -1 : 1)
        });
      }
    } catch (e) {
      console.error('Like error:', e);
      if (user) setIsLikedUser(wasLiked);else setAnonLikedPosts(anonLikedPosts);
      setLikes(prevLikes);
    } finally {
      likePendingRef.current = false;
    }
  };
  const handleSave = async () => {
    if (!user) {
      addNotification({
        message: t('loginToSave'),
        type: 'info'
      });
      return;
    }
    const ur = db.collection('users').doc(user.uid);
    try {
      if (isSaved) await ur.update({
        savedPosts: firebase.firestore.FieldValue.arrayRemove(news.id)
      });else await ur.update({
        savedPosts: firebase.firestore.FieldValue.arrayUnion(news.id)
      });
      setIsSaved(p => !p);
      addNotification({
        message: isSaved ? t('removedFromSaved') : t('savedToProfile'),
        type: 'success'
      });
    } catch (e) {
      console.error('Save error:', e);
    }
  };
  const doShare = async platform => {
    const url = `${window.location.origin}${window.location.pathname}#news-${news.id}`;
    const mediaUrl = news.videoUrl || news.imageUrl || '';
    const text = `📰 ${news.title}\n\n${news.summary?.substring(0, 120)}...\n${mediaUrl ? `\n🖼️ ${mediaUrl}\n` : ''}\n🔗 ${url}\nVia KWT News — kwtnews.com`;
    if (platform === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    if (platform === 'facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'noopener');
    if (platform === 'twitter') window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    if (platform === 'telegram') window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(news.title)}`, '_blank', 'noopener');
    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(url);
      } catch (e) {
        const el = document.createElement('textarea');
        el.value = url;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      addNotification({
        message: t('linkCopied'),
        type: 'success'
      });
    }
    setShareOpen(false);
  };

  // mediaType is always "article" per schema; videoUrl presence = video
  const isVideo = !!(news.videoUrl && news.videoUrl.trim());
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 300,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center'
    },
    onClick: e => {
      if (e.target === e.currentTarget) onClose();
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "reading-progress-bar",
    style: {
      width: readProgress + '%'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(0,0,0,0.72)',
      backdropFilter: 'blur(4px)'
    },
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    ref: modalRef,
    style: {
      position: 'relative',
      width: '100%',
      maxWidth: '800px',
      maxHeight: '94vh',
      borderRadius: '22px 22px 0 0',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      animation: 'modalUp 0.28s cubic-bezier(0.25,0.46,0.45,0.94)'
    },
    className: "bg-white dark:bg-gray-900"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      paddingTop: '10px',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '36px',
      height: '4px',
      borderRadius: '2px'
    },
    className: "bg-gray-200 dark:bg-gray-700"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 16px 10px',
      flexShrink: 0
    },
    className: "border-b border-gray-100 dark:border-gray-800"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }
  }, news.isBreaking && /*#__PURE__*/React.createElement("span", {
    style: {
      background: '#c0392b',
      color: 'white',
      fontSize: '9px',
      fontWeight: 800,
      padding: '2px 8px',
      borderRadius: '4px',
      textTransform: 'uppercase'
    }
  }, "\uD83D\uDEA8 BREAKING"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '11px',
      fontWeight: 700,
      color: '#F5A623',
      textTransform: 'uppercase',
      letterSpacing: '0.06em'
    }
  }, news.category || 'News')), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    className: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  })))), /*#__PURE__*/React.createElement("div", {
    ref: scrollRef,
    onScroll: handleScroll,
    style: {
      overflowY: 'auto',
      flex: 1
    },
    className: "hide-scrollbar"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      aspectRatio: '16/9',
      background: '#111',
      position: 'relative',
      flexShrink: 0
    }
  }, isVideo ? /*#__PURE__*/React.createElement("video", {
    src: news.videoUrl,
    poster: news.thumbnail || news.thumbnailUrl || '',
    controls: true,
    preload: "none",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : /*#__PURE__*/React.createElement("img", {
    src: news.imageUrl || 'https://placehold.co/800x450/0A1628/F5A623?text=KWT+News',
    alt: news.title,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    loading: "eager",
    decoding: "async",
    onError: e => {
      e.target.src = 'https://placehold.co/800x450/0A1628/F5A623?text=KWT+News';
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: '10px',
      left: '10px',
      background: 'rgba(0,0,0,0.58)',
      backdropFilter: 'blur(6px)',
      borderRadius: '999px',
      padding: '4px 12px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    }
  }, news.sourceLogo && /*#__PURE__*/React.createElement("img", {
    src: news.sourceLogo,
    alt: "",
    style: {
      width: '14px',
      height: '14px',
      borderRadius: '50%'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'white',
      fontSize: '11px',
      fontWeight: 600
    }
  }, news.source || 'KWT News'))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 18px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '10px',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '12px',
      color: '#F5A623',
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement(TimeAgo, {
    date: news.timestamp
  })), news.readTime && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '11px',
      color: '#9ca3af'
    }
  }, "\u23F1 ", news.readTime, " min read"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '11px',
      color: '#9ca3af'
    }
  }, "\uD83D\uDC41 ", news.views || 0), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '11px',
      color: '#9ca3af'
    }
  }, "\uD83D\uDCAC ", commentCount)), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: '20px',
      fontWeight: 800,
      lineHeight: 1.35,
      marginBottom: '14px',
      letterSpacing: '-0.02em'
    },
    className: "text-gray-900 dark:text-white"
  }, news.title), news.summary && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '14px',
      lineHeight: 1.7,
      borderLeft: '3px solid #F5A623',
      paddingLeft: '12px',
      marginBottom: '16px',
      fontStyle: 'italic'
    },
    className: "text-gray-500 dark:text-gray-400"
  }, news.summary), news.content && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '15px',
      lineHeight: 1.85,
      marginBottom: '20px',
      whiteSpace: 'pre-wrap'
    },
    className: "text-gray-700 dark:text-gray-300"
  }, news.content), news.tags?.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px',
      marginBottom: '16px'
    }
  }, news.tags.map((tag, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      padding: '3px 10px',
      borderRadius: '999px',
      fontSize: '11px',
      fontWeight: 600,
      background: 'rgba(245,166,35,0.1)',
      color: '#F5A623',
      border: '1px solid rgba(245,166,35,0.25)'
    }
  }, "#", tag)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '10px 18px'
    },
    className: "border-t border-b border-gray-100 dark:border-gray-800"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleLike,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 14px',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: 600,
      transition: 'all 0.2s',
      background: isLiked ? 'rgba(239,68,68,0.1)' : 'transparent',
      color: isLiked ? '#ef4444' : '#9ca3af'
    },
    className: "hover:bg-red-50 dark:hover:bg-red-900/20"
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "17",
    height: "17",
    viewBox: "0 0 24 24",
    fill: isLiked ? "currentColor" : "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
  })), likes > 0 && likes), /*#__PURE__*/React.createElement("button", {
    onClick: handleSave,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 14px',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: 600,
      transition: 'all 0.2s',
      background: isSaved ? 'rgba(245,166,35,0.1)' : 'transparent',
      color: isSaved ? '#F5A623' : '#9ca3af'
    },
    className: "hover:bg-amber-50 dark:hover:bg-amber-900/20"
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "17",
    height: "17",
    viewBox: "0 0 24 24",
    fill: isSaved ? "currentColor" : "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
  })), isSaved ? t('savedLabel') : t('save')), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShareOpen(p => !p),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 14px',
      borderRadius: '12px',
      border: '1px solid',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: 600,
      background: 'transparent',
      color: '#9ca3af'
    },
    className: "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "18",
    cy: "5",
    r: "3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "6",
    cy: "12",
    r: "3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "18",
    cy: "19",
    r: "3"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "8.59",
    y1: "13.51",
    x2: "15.42",
    y2: "17.49"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "15.41",
    y1: "6.51",
    x2: "8.59",
    y2: "10.49"
  })), t('shareLabel')), shareOpen && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 400
    },
    onClick: () => setShareOpen(false)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 401,
      borderRadius: '20px 20px 0 0',
      background: '#fff',
      boxShadow: '0 -8px 40px rgba(0,0,0,0.2)',
      padding: '0 0 24px',
      animation: 'modalUp 0.25s ease-out'
    },
    className: "dark:bg-gray-900"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      padding: '10px 0 4px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '36px',
      height: '4px',
      borderRadius: '2px',
      background: '#e5e7eb'
    },
    className: "dark:bg-gray-700"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 20px 12px',
      borderBottom: '1px solid #f3f4f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    className: "dark:border-gray-800"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 700,
      fontSize: '15px',
      marginBottom: '2px'
    },
    className: "text-gray-900 dark:text-white"
  }, "Share Article"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '12px',
      color: '#9ca3af',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, news.title)), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShareOpen(false),
    style: {
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      marginLeft: '12px'
    },
    className: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-red-100 hover:text-red-500 transition-colors"
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: '4px',
      padding: '14px 12px'
    }
  }, [{
    p: 'whatsapp',
    bg: '#25D366',
    label: 'WhatsApp',
    icon: /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: "22",
      height: "22",
      fill: "white"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M11.993 0C5.366 0 0 5.373 0 12.008c0 2.117.554 4.102 1.522 5.831L0 24l6.335-1.652C8.01 23.342 9.96 24 12 24c6.627 0 12-5.373 12-11.992C24 5.376 18.627.001 11.993 0zm.007 22c-1.846 0-3.655-.5-5.23-1.44l-.374-.223-3.884 1.012 1.042-3.782-.246-.393A9.934 9.934 0 0 1 2 12.008C2 6.481 6.477 2 11.993 2 17.52 2 22 6.482 22 12.008 22 17.532 17.522 22 11.993 22z"
    }))
  }, {
    p: 'facebook',
    bg: '#1877F2',
    label: 'Facebook',
    icon: /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: "22",
      height: "22",
      fill: "white"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
    }))
  }, {
    p: 'twitter',
    bg: '#000000',
    label: 'X (Twitter)',
    icon: /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: "22",
      height: "22",
      fill: "white"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
    }))
  }, {
    p: 'telegram',
    bg: '#0088cc',
    label: 'Telegram',
    icon: /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: "22",
      height: "22",
      fill: "white"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
    }))
  }, {
    p: 'copy',
    bg: '#6366f1',
    label: 'Copy Link',
    icon: /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: "22",
      height: "22",
      fill: "none",
      stroke: "white",
      strokeWidth: "2.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
    }))
  }].map(s => /*#__PURE__*/React.createElement("button", {
    key: s.p,
    onClick: () => {
      doShare(s.p);
    },
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '6px',
      padding: '10px 4px',
      borderRadius: '14px',
      border: 'none',
      cursor: 'pointer',
      background: 'transparent'
    },
    className: "hover:bg-gray-50 dark:hover:bg-gray-800"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '48px',
      height: '48px',
      borderRadius: '14px',
      background: s.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, s.icon), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '10px',
      fontWeight: 500,
      color: '#374151',
      textAlign: 'center'
    },
    className: "dark:text-gray-300"
  }, s.label))), navigator.share && /*#__PURE__*/React.createElement("button", {
    onClick: async () => {
      try {
        await navigator.share({
          title: news.title,
          url: `https://kwtnews.com/news/${news.id}`
        });
      } catch (e) {}
      setShareOpen(false);
    },
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '6px',
      padding: '10px 4px',
      borderRadius: '14px',
      border: 'none',
      cursor: 'pointer',
      background: 'transparent'
    },
    className: "hover:bg-gray-50 dark:hover:bg-gray-800"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '48px',
      height: '48px',
      borderRadius: '14px',
      background: '#F5A623',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px'
    }
  }, "\uD83D\uDCE4"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '10px',
      fontWeight: 500,
      color: '#374151',
      textAlign: 'center'
    },
    className: "dark:text-gray-300"
  }, "More"))))))), /*#__PURE__*/React.createElement(CommentsSection, {
    newsId: news.id,
    onCommentCountChange: setCommentCount
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '20px'
    }
  }))));
};

// ==========================================
// COMMENT MODAL — Premium chat-style full screen modal
// ==========================================
const CommentModal = ({
  news,
  onClose
}) => {
  const {
    t
  } = useTranslation();
  const [commentCount, setCommentCount] = useState(news.commentCount || 0);
  const [keyboardOffset, setKeyboardOffset] = useState(0); // FIX 8: iOS keyboard offset

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';

    // FIX 8: Use visualViewport API to handle iOS Safari keyboard
    const handleViewportResize = () => {
      if (window.visualViewport) {
        const offset = window.innerHeight - window.visualViewport.height - window.visualViewport.offsetTop;
        setKeyboardOffset(Math.max(0, offset));
      }
    };
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportResize);
      window.visualViewport.addEventListener('scroll', handleViewportResize);
    }
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportResize);
        window.visualViewport.removeEventListener('scroll', handleViewportResize);
      }
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 350,
      display: 'flex',
      flexDirection: 'column',
      /* Shrink modal to visible viewport when keyboard is open */
      height: keyboardOffset > 0 ? `calc(100dvh - ${keyboardOffset}px)` : '100dvh'
    },
    className: "bg-gray-50 dark:bg-gray-950"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#0A1628',
      flexShrink: 0,
      boxShadow: '0 2px 12px rgba(0,0,0,0.3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px 14px 8px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      width: '34px',
      height: '34px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.1)',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "15 18 9 12 15 6"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '15px',
      fontWeight: 700,
      color: 'white',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, news.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '11px',
      color: '#F5A623',
      marginTop: '1px'
    }
  }, "\uD83D\uDCAC ", commentCount, " ", t('comments'))), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      width: '34px',
      height: '34px',
      borderRadius: '50%',
      background: 'rgba(239,68,68,0.15)',
      border: '1px solid rgba(239,68,68,0.3)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ef4444',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '8px 14px 10px',
      borderTop: '1px solid rgba(255,255,255,0.07)'
    }
  }, news.imageUrl && /*#__PURE__*/React.createElement("img", {
    src: news.imageUrl,
    alt: "",
    style: {
      width: '40px',
      height: '40px',
      borderRadius: '8px',
      objectFit: 'cover',
      flexShrink: 0,
      border: '1px solid rgba(255,255,255,0.1)'
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '11px',
      color: 'rgba(255,255,255,0.55)',
      flex: 1,
      overflow: 'hidden',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical'
    }
  }, news.summary || news.content?.substring(0, 100)))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto'
    },
    className: "hide-scrollbar"
  }, /*#__PURE__*/React.createElement(CommentsSection, {
    newsId: news.id,
    onCommentCountChange: setCommentCount,
    chatStyle: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '24px'
    }
  })));
};

// ==========================================
// COMMENTS SECTION — real-time, like, reply, delete
// ==========================================
const CommentsSection = ({
  newsId,
  onCommentCountChange,
  chatStyle = false
}) => {
  const {
    t
  } = useTranslation();
  const {
    user
  } = useAuth();
  const {
    addNotification
  } = useNotifications();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [likedCmts, setLikedCmts] = useState(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState(null); // FIX 14: {cid, authorId} or null
  const inputRef = useRef(null);
  const bottomRef = useRef(null); // Auto-scroll to bottom on new comment
  const commentLikePendingRef = useRef(new Set()); // Prevent double-tap on comment likes

  useEffect(() => {
    setLoading(true);
    setComments([]);
    let unsub = () => {};

    // Primary: ordered by timestamp ascending (oldest first = natural chat flow)
    const primaryQuery = db.collection('comments').where('newsId', '==', newsId).where('timestamp', '>', new Date(0)).orderBy('timestamp', 'asc');
    unsub = primaryQuery.onSnapshot(snap => {
      const data = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        timestamp: d.data().timestamp?.toDate()
      }));
      setComments(data);
      onCommentCountChange && onCommentCountChange(data.length);
      setLoading(false);
      // Scroll to bottom so newest comment is visible
      setTimeout(() => bottomRef.current?.scrollIntoView({
        behavior: 'smooth'
      }), 80);
    }, () => {
      // Fallback without ordering (no index needed)
      unsub = db.collection('comments').where('newsId', '==', newsId).onSnapshot(snap => {
        const data = snap.docs.map(d => ({
          id: d.id,
          ...d.data(),
          timestamp: d.data().timestamp?.toDate()
        })).sort((a, b) => {
          const ta = a.timestamp ? a.timestamp.getTime() : 0;
          const tb = b.timestamp ? b.timestamp.getTime() : 0;
          return ta - tb; // oldest first
        });
        setComments(data);
        onCommentCountChange && onCommentCountChange(data.length);
        setLoading(false);
      }, () => setLoading(false));
    });
    return () => unsub();
  }, [newsId]);

  // Auto-focus on open (chat mode)
  useEffect(() => {
    if (!loading && inputRef.current && chatStyle) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [loading, chatStyle]);

  // Real-time liked comments for current user
  useEffect(() => {
    if (!user) return;
    const unsub = db.collection('users').doc(user.uid).onSnapshot(snap => {
      if (snap.exists) setLikedCmts(new Set(snap.data().likedComments || []));
    }, () => {});
    return () => unsub();
  }, [user?.uid]);
  const handleSubmit = async e => {
    if (e && e.preventDefault) e.preventDefault();
    const text = newComment.trim();
    if (!text || !user || isSubmitting) return;
    setIsSubmitting(true);
    const replyRef = replyTo; // capture before clearing
    setNewComment('');
    setReplyTo(null);
    try {
      await db.collection('comments').add({
        newsId,
        content: replyRef ? `@${replyRef.name} ${text}` : text,
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        authorPhoto: user.photoURL || null,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        // FIX 4: Track updatedAt separately so edits don't break sort order
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        likes: 0
      });
      await db.collection('news').doc(newsId).update({
        commentCount: firebase.firestore.FieldValue.increment(1)
      }).catch(() => {});
      inputRef.current?.focus();
    } catch (err) {
      console.error(err);
      setNewComment(text); // restore on failure
      setReplyTo(replyRef);
      addNotification({
        message: t('failedComment'),
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCommentLike = async comment => {
    if (!user) {
      addNotification({
        message: t('loginToLike'),
        type: 'info'
      });
      return;
    }
    if (commentLikePendingRef.current.has(comment.id)) return;
    commentLikePendingRef.current.add(comment.id);
    const liked = likedCmts.has(comment.id);
    try {
      await db.collection('comments').doc(comment.id).update({
        likes: firebase.firestore.FieldValue.increment(liked ? -1 : 1)
      });
      const ur = db.collection('users').doc(user.uid);
      if (liked) await ur.update({
        likedComments: firebase.firestore.FieldValue.arrayRemove(comment.id)
      });else await ur.update({
        likedComments: firebase.firestore.FieldValue.arrayUnion(comment.id)
      });
    } catch (e) {
      console.error('Comment like error:', e);
    } finally {
      commentLikePendingRef.current.delete(comment.id);
    }
  };
  const handleDelete = (cid, authorId) => {
    if (user?.uid !== authorId) return;
    // FIX 14: Use custom confirmation instead of native window.confirm
    setDeleteConfirm({
      cid,
      authorId
    });
  };
  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    const {
      cid
    } = deleteConfirm;
    setDeleteConfirm(null);
    await db.collection('comments').doc(cid).delete().catch(() => {});
    await db.collection('news').doc(newsId).update({
      commentCount: firebase.firestore.FieldValue.increment(-1)
    }).catch(() => {});
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }
  }, deleteConfirm && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 400,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      borderRadius: '16px',
      padding: '24px',
      width: '300px',
      maxWidth: '90vw',
      boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
      textAlign: 'center'
    },
    className: "dark:bg-gray-900"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '40px',
      marginBottom: '12px'
    }
  }, "\uD83D\uDDD1\uFE0F"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontWeight: 700,
      fontSize: '15px',
      marginBottom: '6px'
    },
    className: "text-gray-900 dark:text-white"
  }, t('deleteComment')), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '12px',
      color: '#9ca3af',
      marginBottom: '20px'
    }
  }, "This action cannot be undone."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setDeleteConfirm(null),
    style: {
      flex: 1,
      padding: '10px',
      borderRadius: '10px',
      border: '1.5px solid #e5e7eb',
      background: 'transparent',
      fontWeight: 600,
      fontSize: '13px',
      cursor: 'pointer'
    },
    className: "text-gray-700 dark:text-gray-300 dark:border-gray-700"
  }, t('cancel')), /*#__PURE__*/React.createElement("button", {
    onClick: confirmDelete,
    style: {
      flex: 1,
      padding: '10px',
      borderRadius: '10px',
      border: 'none',
      background: '#ef4444',
      color: 'white',
      fontWeight: 700,
      fontSize: '13px',
      cursor: 'pointer'
    }
  }, t('delete'))))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }
  }, !chatStyle && /*#__PURE__*/React.createElement("h3", {
    style: {
      fontWeight: 700,
      fontSize: '15px',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    className: "text-gray-900 dark:text-white"
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#F5A623",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
  })), t('comments'), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '12px',
      color: '#9ca3af',
      fontWeight: 400
    }
  }, "(", comments.length, ")")), loading ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      padding: '8px 0'
    }
  }, [1, 2, 3].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: '10px',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      flexShrink: 0
    },
    className: "skeleton"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '6px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '12px',
      borderRadius: '6px',
      width: '30%'
    },
    className: "skeleton"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '36px',
      borderRadius: '10px',
      width: '80%'
    },
    className: "skeleton"
  }))))) : comments.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '40px 0',
      color: '#9ca3af'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '36px',
      marginBottom: '8px'
    }
  }, "\uD83D\uDCAC"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '13px',
      fontWeight: 500
    }
  }, t('noCommentsYet'))) : comments.map(comment => {
    const liked = likedCmts.has(comment.id);
    const isOwn = user?.uid === comment.authorId;
    return /*#__PURE__*/React.createElement("div", {
      key: comment.id,
      style: {
        display: 'flex',
        gap: '9px',
        alignItems: 'flex-start'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: comment.authorPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.authorName || 'U')}&background=F5A623&color=0A1628&size=80`,
      alt: "",
      style: {
        width: '34px',
        height: '34px',
        borderRadius: '50%',
        objectFit: 'cover',
        flexShrink: 0,
        border: '2px solid rgba(245,166,35,0.25)',
        marginTop: '2px'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-block',
        maxWidth: '92%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        borderRadius: '4px 14px 14px 14px',
        padding: '9px 13px',
        background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        border: '1px solid rgba(0,0,0,0.06)'
      },
      className: "dark:bg-gray-800 dark:border-gray-700/60"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        marginBottom: '3px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 700,
        fontSize: '12px',
        color: '#F5A623'
      }
    }, comment.authorName), isOwn && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '9px',
        fontWeight: 700,
        color: '#F5A623',
        background: 'rgba(245,166,35,0.12)',
        padding: '1px 5px',
        borderRadius: '4px'
      }
    }, "You")), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: '13px',
        lineHeight: 1.55,
        wordBreak: 'break-word'
      },
      className: "text-gray-800 dark:text-gray-200 comment-content"
    }, comment.content))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        marginTop: '4px',
        paddingLeft: '4px',
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '10px',
        color: '#9ca3af'
      }
    }, /*#__PURE__*/React.createElement(TimeAgo, {
      date: comment.timestamp
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#d1d5db',
        fontSize: '10px'
      }
    }, "\xB7"), /*#__PURE__*/React.createElement("button", {
      onClick: () => handleCommentLike(comment),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '3px',
        padding: '3px 8px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: 600,
        transition: 'all 0.15s',
        background: liked ? 'rgba(239,68,68,0.1)' : 'transparent',
        color: liked ? '#ef4444' : '#9ca3af'
      },
      className: "hover:text-red-500"
    }, /*#__PURE__*/React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: "12",
      height: "12",
      viewBox: "0 0 24 24",
      fill: liked ? "currentColor" : "none",
      stroke: "currentColor",
      strokeWidth: "2"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
    })), comment.likes > 0 ? comment.likes : t('reply').replace('↩ ', '')), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        setReplyTo({
          id: comment.id,
          name: comment.authorName
        });
        setTimeout(() => inputRef.current?.focus(), 50);
      },
      style: {
        padding: '3px 8px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: 600,
        color: '#9ca3af',
        background: 'transparent'
      },
      className: "hover:text-blue-500"
    }, "\u21A9 ", t('reply')), isOwn && /*#__PURE__*/React.createElement("button", {
      onClick: () => handleDelete(comment.id, comment.authorId),
      style: {
        marginLeft: '2px',
        padding: '3px 6px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '12px',
        color: '#9ca3af',
        background: 'transparent'
      },
      className: "hover:text-red-500"
    }, "\uD83D\uDDD1"))));
  }), /*#__PURE__*/React.createElement("div", {
    ref: bottomRef
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0,
      borderTop: '1px solid',
      padding: '10px 12px',
      background: '#fff',
      position: 'sticky',
      bottom: 0,
      paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
      zIndex: 10
    },
    className: "border-gray-100 dark:border-gray-700 dark:bg-gray-900"
  }, replyTo && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '5px 10px',
      borderRadius: '8px',
      marginBottom: '6px',
      fontSize: '11px',
      color: '#F5A623',
      background: 'rgba(245,166,35,0.08)',
      border: '1px solid rgba(245,166,35,0.2)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\u21A9 ", t('replyingTo'), " ", /*#__PURE__*/React.createElement("strong", null, "@", replyTo.name)), /*#__PURE__*/React.createElement("button", {
    onClick: () => setReplyTo(null),
    style: {
      marginLeft: 'auto',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#9ca3af',
      fontSize: '16px',
      lineHeight: 1,
      padding: 0
    }
  }, "\xD7")), user ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '8px',
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'U')}&background=F5A623&color=0A1628&size=80`,
    alt: "",
    style: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '2px solid #F5A623',
      flexShrink: 0,
      marginBottom: '2px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "kwt-comment-input dark:bg-gray-800 dark:border-gray-700",
    style: {
      flex: 1,
      display: 'flex',
      alignItems: 'flex-end',
      gap: '6px',
      background: '#f3f4f6',
      borderRadius: '22px',
      padding: '8px 12px',
      border: '1.5px solid #e5e7eb',
      transition: 'border-color 0.18s ease, box-shadow 0.18s ease'
    }
  }, /*#__PURE__*/React.createElement("textarea", {
    ref: inputRef,
    value: newComment,
    onChange: e => setNewComment(e.target.value),
    placeholder: replyTo ? `${t('reply')} @${replyTo.name}...` : t('writeComment'),
    rows: "1",
    inputMode: "text",
    style: {
      flex: 1,
      background: 'transparent',
      border: 'none',
      outline: 'none',
      boxShadow: 'none',
      fontSize: '13px',
      resize: 'none',
      lineHeight: 1.5,
      fontFamily: 'inherit',
      maxHeight: '80px',
      overflowY: 'auto'
    },
    className: "text-gray-800 dark:text-gray-200 placeholder-gray-400"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: handleSubmit,
    disabled: !newComment.trim() || isSubmitting,
    style: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      border: 'none',
      cursor: newComment.trim() && !isSubmitting ? 'pointer' : 'not-allowed',
      background: newComment.trim() && !isSubmitting ? '#F5A623' : '#d1d5db',
      color: '#0A1628',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      transition: 'background 0.2s'
    }
  }, isSubmitting ? /*#__PURE__*/React.createElement("div", {
    style: {
      width: '14px',
      height: '14px',
      border: '2px solid rgba(10,22,40,0.2)',
      borderTopColor: '#0A1628',
      borderRadius: '50%',
      animation: 'spin 0.6s linear infinite'
    }
  }) : /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "22",
    y1: "2",
    x2: "11",
    y2: "13"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: "22 2 15 22 11 13 2 9 22 2"
  }))))) : /*#__PURE__*/React.createElement("button", {
    onClick: () => addNotification({
      message: t('loginToComment'),
      type: 'info'
    }),
    style: {
      width: '100%',
      padding: '12px',
      borderRadius: '12px',
      textAlign: 'center',
      fontSize: '13px',
      color: '#9ca3af',
      border: '1.5px dashed',
      background: 'transparent',
      cursor: 'pointer'
    },
    className: "border-gray-200 dark:border-gray-700 hover:border-accent hover:text-accent transition-colors"
  }, "\uD83D\uDD10 ", t('loginToComment'))));
};

// Ad Component — real-time, video support, loop, muted by default, unmute button
const AdBanner = ({
  position,
  className = ""
}) => {
  const {
    t
  } = useTranslation();
  const [adData, setAdData] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);
  const impressionTracked = useRef(null); // Bug Fix: prevent infinite impression loop

  useEffect(() => {
    // Real-time ad listener with onSnapshot
    const unsub = db.collection('ads').where('position', '==', position).limit(10).onSnapshot(snapshot => {
      const now = new Date();
      const valid = snapshot.docs.filter(doc => {
        const d = doc.data();
        // Bug Fix 1: Correct active check — exclude any ad that is not explicitly active:true
        if (!d.active) return false;
        try {
          const start = d.startDate?.toDate ? d.startDate.toDate() : new Date((d.startDate || '2000-01-01') + 'T00:00:00');
          const end = d.endDate?.toDate ? d.endDate.toDate() : new Date((d.endDate || '2099-12-31') + 'T23:59:59');
          return now >= start && now <= end;
        } catch (e) {
          return true;
        }
      });
      if (valid.length > 0) {
        const adDoc = valid[Math.floor(Math.random() * valid.length)];
        const data = {
          id: adDoc.id,
          ...adDoc.data()
        };
        setAdData(prev => prev?.id === data.id ? prev : data);
        // Bug Fix 2: Infinite loop prevention — impressions tabhi increment hon
        // jab nayi ad pehli baar dikhti hai (onSnapshot update pe nahi)
        // Warna: impression update → snapshot fires → impression update → infinite loop!
        if (impressionTracked.current !== adDoc.id) {
          impressionTracked.current = adDoc.id;
          db.collection('ads').doc(adDoc.id).update({
            impressions: firebase.firestore.FieldValue.increment(1)
          }).catch(() => {});
        }
      } else {
        setAdData(null);
      }
    }, () => {});
    return () => unsub();
  }, [position]);
  const handleAdClick = async e => {
    e.stopPropagation();
    if (!adData) return;
    // Track click
    db.collection('ads').doc(adData.id).update({
      clicks: firebase.firestore.FieldValue.increment(1)
    }).catch(() => {});
    // Open target URL
    const url = adData.targetUrl || adData.link || adData.url;
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };
  const toggleMute = e => {
    e.stopPropagation();
    e.preventDefault();
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (videoRef.current) videoRef.current.muted = newMuted;
  };
  if (!adData) return null;
  const isVideo = adData.mediaType === 'video' || adData.videoUrl || adData.imageUrl && adData.imageUrl.match(/\.(mp4|webm|ogg)(\?|$)/i);
  const mediaSrc = adData.videoUrl || adData.imageUrl;
  const targetUrl = adData.targetUrl || adData.link || adData.url || '#';
  return /*#__PURE__*/React.createElement("div", {
    className: `kwt-ad-banner relative overflow-hidden ${className}`,
    style: {
      background: '#f8fafc',
      cursor: 'pointer',
      marginBottom: '20px',
      marginTop: '6px'
    },
    onClick: handleAdClick
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '8px',
      left: '8px',
      zIndex: 5,
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(6px)',
      color: 'white',
      fontSize: '9px',
      fontWeight: 800,
      padding: '3px 8px',
      borderRadius: '6px',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      userSelect: 'none',
      border: '1px solid rgba(255,255,255,0.15)'
    }
  }, t('sponsored')), isVideo ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      height: '112px',
      background: '#000',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("video", {
    ref: videoRef,
    src: mediaSrc,
    poster: adData.thumbnail || adData.imageUrl,
    autoPlay: true,
    loop: true,
    muted: isMuted,
    playsInline: true,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: toggleMute,
    style: {
      position: 'absolute',
      bottom: '8px',
      right: '8px',
      zIndex: 20,
      background: 'rgba(0,0,0,0.6)',
      border: 'none',
      borderRadius: '50%',
      width: '44px',
      height: '44px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: 'white'
    }
  }, isMuted ? /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5"
  }, /*#__PURE__*/React.createElement("polygon", {
    points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "23",
    y1: "9",
    x2: "17",
    y2: "15"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "17",
    y1: "9",
    x2: "23",
    y2: "15"
  })) : /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5"
  }, /*#__PURE__*/React.createElement("polygon", {
    points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"
  }))), adData.title && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(transparent,rgba(0,0,0,0.75))',
      padding: '20px 10px 8px',
      color: 'white',
      fontSize: '11px',
      fontWeight: 600
    }
  }, adData.title)) : /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      overflow: 'hidden',
      maxHeight: '160px'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: mediaSrc || 'https://via.placeholder.com/800x200?text=Advertisement',
    alt: adData.title || 'Advertisement',
    style: {
      width: '100%',
      height: 'auto',
      maxHeight: '160px',
      objectFit: 'cover',
      display: 'block'
    },
    onError: e => {
      e.target.style.display = 'none';
    }
  }), adData.title && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(transparent,rgba(0,0,0,0.7))',
      padding: '16px 10px 6px',
      color: 'white',
      fontSize: '11px',
      fontWeight: 600
    }
  }, adData.title)), adData.description && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '5px 10px 6px',
      fontSize: '10px',
      color: '#6b7280',
      background: '#f9fafb',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    className: "dark:bg-gray-800 dark:text-gray-400"
  }, adData.description));
};

// Sidebar Component
const Sidebar = () => {
  const {
    t
  } = useTranslation();
  const [trending, setTrending] = useState([]);
  const [latest, setLatest] = useState([]);
  useEffect(() => {
    // Fetch trending news
    const unsubTrending = db.collection('news').orderBy('views', 'desc').limit(10).onSnapshot(snapshot => {
      setTrending(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      })).filter(n => !n.hidden && (n.status === 'published' || n.status === 'active' || n.status === 'Active' || !n.status)).slice(0, 5));
    }, () => {});

    // Fetch latest news
    const unsubLatest = db.collection('news').orderBy('timestamp', 'desc').limit(10).onSnapshot(snapshot => {
      setLatest(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      })).filter(n => !n.hidden && (n.status === 'published' || n.status === 'active' || n.status === 'Active' || !n.status)).slice(0, 5));
    }, () => {});
    return () => {
      unsubTrending();
      unsubLatest();
    };
  }, []);
  const SidebarItem = ({
    item,
    index
  }) => /*#__PURE__*/React.createElement("a", {
    href: `/news/${item.id}`,
    className: "flex gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group",
    style: {
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sidebar-item-num",
    style: {
      fontSize: '20px',
      fontWeight: 900,
      color: 'rgba(245,166,35,0.3)',
      minWidth: '28px',
      lineHeight: '1.3'
    }
  }, String(index + 1).padStart(2, '0')), /*#__PURE__*/React.createElement("div", {
    className: "flex-1",
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontWeight: 600,
      fontSize: '13px',
      lineHeight: '1.45',
      overflow: 'hidden',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      margin: 0
    },
    className: "text-gray-800 dark:text-gray-100 group-hover:text-accent transition-colors"
  }, item.title), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '11px',
      color: '#9ca3af',
      marginTop: '4px',
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement(TimeAgo, {
    date: item.timestamp
  }))));
  return /*#__PURE__*/React.createElement("aside", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement(AdBanner, {
    position: "sidebar_top"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sidebar-card bg-light-card dark:bg-dark-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-4 border-b border-gray-100 dark:border-gray-700/60",
    style: {
      background: 'linear-gradient(135deg,#0A1628 0%,#162040 100%)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-white flex items-center gap-2",
    style: {
      fontSize: '14px',
      letterSpacing: '0.01em'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#F5A623",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "23 6 13.5 15.5 8.5 10.5 1 18"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "17 6 23 6 23 12"
  })), t('trending'))), /*#__PURE__*/React.createElement("div", {
    className: "divide-y divide-gray-100 dark:divide-gray-700/50"
  }, trending.map((item, idx) => /*#__PURE__*/React.createElement(SidebarItem, {
    key: item.id,
    item: item,
    index: idx
  })))), /*#__PURE__*/React.createElement("div", {
    className: "sidebar-card bg-light-card dark:bg-dark-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-4 border-b border-gray-100 dark:border-gray-700/60",
    style: {
      background: 'linear-gradient(135deg,#0A1628 0%,#162040 100%)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-white flex items-center gap-2",
    style: {
      fontSize: '14px',
      letterSpacing: '0.01em'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#F5A623",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "12 6 12 12 16 14"
  })), t('latest'))), /*#__PURE__*/React.createElement("div", {
    className: "divide-y divide-gray-100 dark:divide-gray-700/50"
  }, latest.map((item, idx) => /*#__PURE__*/React.createElement(SidebarItem, {
    key: item.id,
    item: item,
    index: idx
  })))), /*#__PURE__*/React.createElement(AdBanner, {
    position: "sidebar_bottom"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sidebar-card bg-light-card dark:bg-dark-card p-4"
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontWeight: 700,
      fontSize: '12px',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      marginBottom: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    className: "text-gray-500 dark:text-gray-400"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#F5A623'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "18",
    cy: "5",
    r: "3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "6",
    cy: "12",
    r: "3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "18",
    cy: "19",
    r: "3"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "8.59",
    y1: "13.51",
    x2: "15.42",
    y2: "17.49"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "15.41",
    y1: "6.51",
    x2: "8.59",
    y2: "10.49"
  }))), t('followUs')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '8px'
    }
  }, [{
    href: 'https://twitter.com/kwtnews_com',
    label: 'X / Twitter',
    handle: '@kwtnews_com',
    bg: '#111',
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "14",
      height: "14",
      fill: "currentColor",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
    }))
  }, {
    href: 'https://instagram.com/kwtnews_com',
    label: 'Instagram',
    handle: '@kwtnews_com',
    bg: 'linear-gradient(135deg,#f09433,#dc2743,#bc1888)',
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "14",
      height: "14",
      fill: "currentColor",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
    }))
  }, {
    href: 'https://t.me/kwtnews_com',
    label: 'Telegram',
    handle: 'kwtnews_com',
    bg: '#229ED9',
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "14",
      height: "14",
      fill: "currentColor",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
    }))
  }, {
    href: 'mailto:kwtnews.com@gmail.com',
    label: 'Email Us',
    handle: 'kwtnews.com',
    bg: '#EA4335',
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "14",
      height: "14",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
    }), /*#__PURE__*/React.createElement("polyline", {
      points: "22,6 12,13 2,6"
    }))
  }].map((s, i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: s.href,
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '4px',
      padding: '10px 6px',
      borderRadius: '12px',
      background: s.bg,
      color: 'white',
      textDecoration: 'none',
      transition: 'opacity 0.18s,transform 0.18s'
    },
    onMouseEnter: e => {
      e.currentTarget.style.opacity = '0.88';
      e.currentTarget.style.transform = 'translateY(-2px)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.opacity = '1';
      e.currentTarget.style.transform = 'translateY(0)';
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    }
  }, s.icon, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '11px',
      fontWeight: 700
    }
  }, s.label)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '9px',
      opacity: 0.72,
      userSelect: 'none'
    }
  }, s.handle))))));
};
const FooterPageLinks = () => {
  const {
    t
  } = useTranslation();
  const [activePage, setActivePage] = useState(null);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
      flexWrap: 'wrap',
      marginBottom: '20px'
    }
  }, [{
    label: t('aboutUs'),
    id: 'about'
  }, {
    label: t('contact'),
    id: 'contact'
  }, {
    label: t('privacy'),
    id: 'privacy'
  }, {
    label: t('terms'),
    id: 'terms'
  }].map(link => /*#__PURE__*/React.createElement("button", {
    key: link.id,
    onClick: () => setActivePage(link.id),
    style: {
      fontSize: '12px',
      color: 'rgba(255,255,255,0.4)',
      textDecoration: 'none',
      transition: 'color 0.2s',
      letterSpacing: '0.02em',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0
    },
    className: "hover:text-accent"
  }, link.label))), activePage && /*#__PURE__*/React.createElement(StaticPageModal, {
    page: activePage,
    onClose: () => setActivePage(null)
  }));
};
const Footer = () => {
  const {
    t
  } = useTranslation();
  return /*#__PURE__*/React.createElement("footer", {
    className: "kwt-footer",
    style: {
      color: 'white',
      marginTop: '48px'
    }
  }, /*#__PURE__*/React.createElement(AdBanner, {
    position: "footer",
    className: "mx-4 pt-4"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '36px 20px 28px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container mx-auto",
    style: {
      maxWidth: '600px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '24px',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement(Logo, null), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '12px',
      color: 'rgba(255,255,255,0.35)',
      letterSpacing: '0.04em',
      textAlign: 'center'
    }
  }, "Kuwait's trusted source for real-time news")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
      marginBottom: '20px',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://twitter.com/kwtnews_com",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.07)',
      border: '1px solid rgba(255,255,255,0.12)',
      color: 'white',
      transition: 'all 0.2s',
      textDecoration: 'none'
    },
    title: "@kwtnews_com on X",
    className: "hover:bg-white/20"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '9px',
      color: 'rgba(255,255,255,0.3)',
      userSelect: 'none'
    }
  }, "@kwtnews_com")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://instagram.com/kwtnews_com",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.07)',
      border: '1px solid rgba(255,255,255,0.12)',
      color: 'white',
      transition: 'all 0.2s',
      textDecoration: 'none'
    },
    title: "@kwtnews_com on Instagram",
    className: "hover:bg-white/20"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '9px',
      color: 'rgba(255,255,255,0.3)',
      userSelect: 'none'
    }
  }, "@kwtnews_com")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://tiktok.com/@kwtnews.com",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.07)',
      border: '1px solid rgba(255,255,255,0.12)',
      color: 'white',
      transition: 'all 0.2s',
      textDecoration: 'none'
    },
    title: "kwtnews.com on TikTok",
    className: "hover:bg-white/20"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '9px',
      color: 'rgba(255,255,255,0.3)',
      userSelect: 'none'
    }
  }, "kwtnews.com")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://t.me/kwtnews_com",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.07)',
      border: '1px solid rgba(255,255,255,0.12)',
      color: 'white',
      transition: 'all 0.2s',
      textDecoration: 'none'
    },
    title: "kwtnews_com on Telegram",
    className: "hover:bg-white/20"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '9px',
      color: 'rgba(255,255,255,0.3)',
      userSelect: 'none'
    }
  }, "kwtnews_com")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "mailto:kwtnews.com@gmail.com",
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.07)',
      border: '1px solid rgba(255,255,255,0.12)',
      color: 'white',
      transition: 'all 0.2s',
      textDecoration: 'none'
    },
    title: "kwtnews.com@gmail.com",
    className: "hover:bg-white/20"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "22,6 12,13 2,6"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '9px',
      color: 'rgba(255,255,255,0.3)',
      userSelect: 'none'
    }
  }, "Email"))), /*#__PURE__*/React.createElement(FooterPageLinks, null), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid rgba(255,255,255,0.06)',
      paddingTop: '12px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '10px',
      color: 'rgba(255,255,255,0.25)'
    }
  }, "\xA9 2026 ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#F5A623',
      fontWeight: 600
    }
  }, "kwtnews.com"), ". All rights reserved."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '9px',
      color: 'rgba(255,255,255,0.15)',
      marginTop: '2px'
    }
  }, "Made with \u2764\uFE0F in Kuwait")))));
};

// Main App Component
const App = () => {
  // ── ALL useState/useRef declarations FIRST (Rules of Hooks) ──
  const [activeTab, setActiveTab] = useState(() => {
    try {
      return localStorage.getItem('kwtActiveTab') || 'all';
    } catch (e) {
      return 'all';
    }
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNews, setSelectedNews] = useState(null);
  const [breakingNews, setBreakingNews] = useState([]);
  const [notifPermission, setNotifPermission] = useState(typeof Notification !== 'undefined' ? Notification.permission : 'default');
  const [showNotifBanner, setShowNotifBanner] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [ptrActive, setPtrActive] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // FIX: soft refresh
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  // Refs
  const infiniteScrollRef = useRef(null);
  const ptrStartY = useRef(null);
  const ptrThreshold = 80;
  const tabHistory = useRef(['all']);
  // Hooks
  const {
    news,
    loading,
    hasMore,
    loadMore
  } = useNews(activeTab, 20, refreshKey);
  const {
    notifications,
    removeNotification,
    addNotification
  } = useNotifications();
  const {
    t
  } = useTranslation();
  const {
    user
  } = useAuth();

  // Global single-video-at-a-time: pause all other videos when one plays
  useEffect(() => {
    const handlePlay = e => {
      if (e.target.tagName !== 'VIDEO') return;
      document.querySelectorAll('video').forEach(v => {
        if (v !== e.target && !v.paused) v.pause();
      });
    };
    document.addEventListener('play', handlePlay, true);
    return () => document.removeEventListener('play', handlePlay, true);
  }, []);

  // ── FIX 10: online/offline ──
  useEffect(() => {
    const onOnline = () => setIsOffline(false);
    const onOffline = () => setIsOffline(true);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  // ── FIX 6: Deep-link open on load (hash-based, GitHub Pages safe) ──
  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/^#news-(.+)$/);
    if (match) {
      const newsId = match[1];
      db.collection('news').doc(newsId).get().then(doc => {
        if (doc.exists) {
          setSelectedNews({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate()
          });
        }
      }).catch(() => {});
    }
  }, []);

  // ── FIX 12: Infinite scroll — use ref to avoid stale closure bug ──
  const isLoadingMoreRef = useRef(false);
  useEffect(() => {
    if (!infiniteScrollRef.current) return;
    const observer = new IntersectionObserver(async entries => {
      if (entries[0].isIntersecting && hasMore && !isLoadingMoreRef.current && !loading) {
        isLoadingMoreRef.current = true;
        setIsLoadingMore(true);
        try {
          await loadMore();
        } catch (e) {
          console.error('Infinite scroll load error:', e);
        } finally {
          isLoadingMoreRef.current = false;
          setIsLoadingMore(false);
        }
      }
    }, {
      threshold: 0.1,
      rootMargin: '100px'
    }); // FIX 11: was 300px — caused premature loading
    observer.observe(infiniteScrollRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  // ── FIX 18: Pull-to-Refresh ──
  const handleTouchStart = useCallback(e => {
    if (window.scrollY === 0) ptrStartY.current = e.touches[0].clientY;
  }, []);
  const handleTouchMove = useCallback(e => {
    if (ptrStartY.current === null) return;
    const dy = e.touches[0].clientY - ptrStartY.current;
    if (dy > ptrThreshold) setPtrActive(true);
  }, []);
  const handleTouchEnd = useCallback(() => {
    if (ptrActive) {
      setPtrActive(false);
      // FIX: Soft refresh — just increment refreshKey, NO page reload
      setRefreshKey(k => k + 1);
    }
    ptrStartY.current = null;
  }, [ptrActive]);
  useEffect(() => {
    window.addEventListener('touchstart', handleTouchStart, {
      passive: true
    });
    window.addEventListener('touchmove', handleTouchMove, {
      passive: true
    });
    window.addEventListener('touchend', handleTouchEnd, {
      passive: true
    });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  // ── Single shared user-data listener ──
  useEffect(() => {
    if (!user) {
      setLikedPosts([]);
      setSavedPosts([]);
      return;
    }
    const unsub = db.collection('users').doc(user.uid).onSnapshot(snap => {
      if (snap.exists) {
        setLikedPosts(snap.data().likedPosts || []);
        setSavedPosts(snap.data().savedPosts || []);
      }
    }, () => {});
    return () => unsub();
  }, [user?.uid]);

  // NOTE: 30-second background refresh REMOVED.
  // onSnapshot is a real-time listener — Firestore automatically pushes new articles
  // the moment they are added. Recreating the subscription every 30s was wasteful
  // and caused a brief gap where no listener was active.

  const handleLikeToggle = useCallback((id, liked) => {
    setLikedPosts(prev => liked ? [...prev, id] : prev.filter(x => x !== id));
  }, []);
  const handleSaveToggle = useCallback((id, saved) => {
    setSavedPosts(prev => saved ? [...prev, id] : prev.filter(x => x !== id));
  }, []);

  // Breaking news real-time — no orderBy to avoid composite index requirement
  // Client-side sort achieves same result without needing a Firestore index
  useEffect(() => {
    const unsub = db.collection('news').where('isBreaking', '==', true).limit(5).onSnapshot(snap => {
      const items = snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      })).filter(n => !n.hidden && (n.status === 'published' || n.status === 'active' || n.status === 'Active' || !n.status)).sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
      setBreakingNews(items);
    }, () => {});
    return () => unsub();
  }, []);

  // ── Hardware Back Button ──────────────────────────────────────────
  const navigateTab = useCallback(tabId => {
    if (tabId === activeTab) return;
    try {
      localStorage.setItem('kwtActiveTab', tabId);
    } catch (e) {}
    tabHistory.current.push(tabId);
    // FIX 3: Use pushState ONLY once (initial), then replaceState for tab switches
    // This way back button only fires once instead of N times
    window.history.pushState({
      tab: tabId
    }, '', '');
    setActiveTab(tabId);
  }, [activeTab]);
  useEffect(() => {
    // FIX 3: replaceState for the initial entry — no history spam
    window.history.replaceState({
      tab: activeTab
    }, '', '');
    const onPopState = e => {
      const hist = tabHistory.current;
      if (hist.length > 1) {
        hist.pop();
        const prev = hist[hist.length - 1];
        setActiveTab(prev);
        try {
          localStorage.setItem('kwtActiveTab', prev);
        } catch (e) {}
        // Use replaceState so we don't keep growing browser history
        window.history.replaceState({
          tab: prev
        }, '', '');
        // Re-push one entry so the next back press fires popstate again
        window.history.pushState({
          tab: prev
        }, '', '');
      }
      // If only one entry left, let browser handle (exit / go back normally)
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // ── Push Notification Permission ─────────────────────────────────
  useEffect(() => {
    // Show banner after 4 sec if permission not decided yet
    if (typeof Notification === 'undefined') return;
    if (Notification.permission === 'default') {
      const timer = setTimeout(() => setShowNotifBanner(true), 4000);
      return () => clearTimeout(timer);
    }
  }, []);
  const requestNotifPermission = async () => {
    setShowNotifBanner(false);
    if (typeof Notification === 'undefined') return;
    try {
      const permission = await Notification.requestPermission();
      setNotifPermission(permission);
      if (permission === 'granted') {
        try {
          localStorage.setItem('kwtNotifEnabled', 'true');
        } catch (e) {}
        // Try to get FCM token
        try {
          const token = messaging ? await messaging.getToken({
            vapidKey: 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDkBWAVe7axcl0bYFdCvD29NBwkk5K2cGjlj'
          }) : null;
          if (token) {
            await db.collection('fcm_tokens').doc(token).set({
              token,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              platform: 'web'
            });
          }
        } catch (fcmErr) {
          console.log('FCM token error (non-critical):', fcmErr);
        }
        // Show welcome notification
        new Notification('KWT News 🗞️', {
          body: 'Notifications enabled! You will receive breaking news alerts.',
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          tag: 'kwt-welcome'
        });
        addNotification({
          message: '🔔 Notifications enabled!',
          type: 'success'
        });
      } else {
        try {
          localStorage.setItem('kwtNotifEnabled', 'false');
        } catch (e) {}
      }
    } catch (err) {
      console.error('Notification permission error:', err);
    }
  };

  // Listen for ALL new news from Firestore → fire native notification for every new article
  useEffect(() => {
    if (notifPermission !== 'granted') return;
    // Register FCM token so backend can send push to all users
    if (messaging) {
      messaging.getToken({
        vapidKey: 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDkBWAVe7axcl0bYFdCvD29NBwkk5K2cGjlj'
      }).then(token => {
        if (token) {
          db.collection('fcm_tokens').doc(token).set({
            token,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            platform: 'web'
          }).catch(() => {});
        }
      }).catch(() => {});
    }
    // Real-time listener — ALL news, newest first, limit 1 → fires on every new article
    const unsubscribe = db.collection('news').orderBy('timestamp', 'desc').limit(1).onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const article = change.doc.data();
          if (article.hidden || article.status && article.status.toLowerCase() === 'inactive') return;
          // Only notify if article is fresh (< 3 min old)
          const age = Date.now() - (article.timestamp?.toMillis?.() || 0);
          if (age < 180000) {
            const isBreaking = article.isBreaking;
            const title = isBreaking ? '🚨 Breaking — KWT News' : '🗞️ KWT News';
            new Notification(title, {
              body: article.title || 'New news update',
              icon: article.imageUrl || '/icon-192.png',
              badge: '/icon-192.png',
              tag: 'kwt-news-' + change.doc.id,
              requireInteraction: isBreaking,
              vibrate: isBreaking ? [200, 100, 200] : [100]
            });
          }
        }
      });
    }, () => {});
    return () => unsubscribe();
  }, [notifPermission]);

  // Filter news based on search
  const filteredNews = useMemo(() => {
    if (!searchQuery) return news;
    return news.filter(item => item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || item.summary?.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [news, searchQuery]);

  // Insert ads every 5th item
  const newsWithAds = useMemo(() => {
    const result = [];
    filteredNews.forEach((item, index) => {
      if (index > 0 && index % 5 === 0) {
        result.push({
          type: 'ad',
          id: `ad-${index}`
        });
      }
      result.push({
        type: 'news',
        data: item
      });
    });
    return result;
  }, [filteredNews]);
  const tabs = [{
    id: 'all',
    label: t('home')
  }, {
    id: 'kuwait',
    label: t('kuwait')
  }, {
    id: 'world',
    label: t('world')
  }, {
    id: 'kuwait-jobs',
    label: '💼 Kuwait Jobs'
  }, {
    id: 'kuwait-offers',
    label: '🛍️ Kuwait Offers'
  }, {
    id: 'funny-news-meme',
    label: '😂 Funny & Memes'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text font-sans transition-colors duration-300"
  }, /*#__PURE__*/React.createElement(Header, {
    activeTab: activeTab,
    setActiveTab: navigateTab,
    searchQuery: searchQuery,
    setSearchQuery: setSearchQuery,
    onReadMore: setSelectedNews
  }), showNotifBanner && /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-r from-primary to-blue-900 text-white px-4 py-3 flex items-center gap-3 shadow-lg"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-2xl flex-shrink-0"
  }, "\uD83D\uDD14"), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-semibold"
  }, "Stay updated with Breaking News!"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-300"
  }, "Get instant alerts for latest Kuwait & World news.")), /*#__PURE__*/React.createElement("button", {
    onClick: requestNotifPermission,
    className: "flex-shrink-0 bg-accent text-primary text-xs font-bold px-4 py-2 rounded-full hover:bg-yellow-400 transition-colors"
  }, "Allow"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowNotifBanner(false),
    className: "flex-shrink-0 p-1.5 hover:bg-white/10 rounded-full transition-colors"
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  })))), isOffline && /*#__PURE__*/React.createElement("div", {
    className: "offline-banner",
    style: {
      background: '#1f2937',
      color: 'white',
      padding: '10px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      justifyContent: 'center',
      fontSize: '13px',
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '16px'
    }
  }, "\uD83D\uDCF5"), "You're offline \u2014 showing cached content", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '11px',
      color: '#9ca3af',
      fontWeight: 400
    }
  }, "Reconnect to load new articles")), ptrActive && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      top: '60px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 100,
      background: '#F5A623',
      color: '#0A1628',
      borderRadius: '999px',
      padding: '6px 16px',
      fontSize: '12px',
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 4px 20px rgba(245,166,35,0.4)',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '14px',
      height: '14px',
      border: '2px solid #0A1628',
      borderTopColor: 'transparent',
      borderRadius: '50%',
      animation: 'spin 0.6s linear infinite'
    }
  }), "Refreshing..."), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: 'none',
      background: '#fafafa',
      padding: '6px 0',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center'
    },
    className: "dark:bg-gray-900/40 border-b border-gray-100 dark:border-gray-700/60"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '9px',
      fontWeight: 700,
      color: '#9ca3af',
      background: 'transparent',
      padding: '2px 10px',
      flexShrink: 0,
      whiteSpace: 'nowrap',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      borderRight: '1px solid #e5e7eb'
    },
    className: "dark:border-gray-700 dark:text-gray-500"
  }, "AD"), /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: 'hidden',
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-block',
      animation: 'marqueeScroll 32s linear infinite',
      whiteSpace: 'nowrap',
      paddingLeft: '16px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '11px',
      color: '#9ca3af'
    },
    className: "dark:text-gray-500"
  }, "Advertise with KWT News \xA0\xB7\xA0 Reach Kuwait & worldwide readers \xA0\xB7\xA0 Contact: kwtnews.com@gmail.com \xA0\xA0\xA0\xA0\xA0\xA0Advertise with KWT News \xA0\xB7\xA0 Reach Kuwait & worldwide readers \xA0\xB7\xA0 Contact: kwtnews.com@gmail.com")))), /*#__PURE__*/React.createElement("div", {
    className: "container mx-auto px-4 mt-4"
  }, /*#__PURE__*/React.createElement(AdBanner, {
    position: "top_banner"
  })), /*#__PURE__*/React.createElement("main", {
    className: "container mx-auto px-4 py-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-3 gap-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-2 space-y-6 no-copy"
  }, loading ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(NewsCardSkeleton, null), /*#__PURE__*/React.createElement(NewsCardSkeleton, null), /*#__PURE__*/React.createElement(NewsCardSkeleton, null)) : newsWithAds.length === 0 ?
  /*#__PURE__*/
  /* FIX 20: Premium Empty State */
  React.createElement("div", {
    className: "empty-state-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "empty-state-icon"
  }, "\uD83D\uDCED"), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '20px',
      fontWeight: 800,
      marginBottom: '8px',
      letterSpacing: '-0.02em'
    },
    className: "text-light-text dark:text-dark-text"
  }, "No stories yet"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '14px',
      color: '#9ca3af',
      maxWidth: '280px',
      lineHeight: '1.7',
      marginBottom: '24px'
    }
  }, "This category has no articles right now. Try another section or come back soon!"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => navigateTab('all'),
    style: {
      padding: '10px 22px',
      borderRadius: '999px',
      background: '#F5A623',
      color: '#0A1628',
      fontWeight: 700,
      fontSize: '13px',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 4px 14px rgba(245,166,35,0.35)'
    }
  }, "\uD83C\uDFE0 Back to Home"), /*#__PURE__*/React.createElement("button", {
    onClick: () => navigateTab('world'),
    style: {
      padding: '10px 22px',
      borderRadius: '999px',
      background: 'transparent',
      color: '#F5A623',
      fontWeight: 700,
      fontSize: '13px',
      border: '2px solid rgba(245,166,35,0.4)',
      cursor: 'pointer'
    }
  }, "\uD83C\uDF0D World News"))) : /*#__PURE__*/React.createElement(React.Fragment, null, newsWithAds.map((item, index) => item.type === 'ad' ? /*#__PURE__*/React.createElement(AdBanner, {
    key: item.id,
    position: "in_feed"
  }) : /*#__PURE__*/React.createElement(NewsCard, {
    key: item.data.id,
    news: item.data,
    index: index,
    onReadMore: setSelectedNews,
    likedPosts: likedPosts,
    savedPosts: savedPosts,
    onLikeToggle: handleLikeToggle,
    onSaveToggle: handleSaveToggle
  })), /*#__PURE__*/React.createElement("div", {
    ref: infiniteScrollRef,
    style: {
      height: '1px'
    }
  }), isLoadingMore && /*#__PURE__*/React.createElement("div", {
    className: "inf-spinner"
  }), !hasMore && newsWithAds.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '16px 0 8px',
      fontSize: '12px',
      color: '#9ca3af',
      fontWeight: 500
    }
  }, t('youveReadAll')))), /*#__PURE__*/React.createElement("div", {
    className: "hidden lg:block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sticky top-24"
  }, /*#__PURE__*/React.createElement(Sidebar, null))))), /*#__PURE__*/React.createElement(Footer, null), selectedNews && /*#__PURE__*/React.createElement(NewsDetailModal, {
    news: selectedNews,
    onClose: () => setSelectedNews(null)
  }), breakingNews.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "breaking-ticker",
    style: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 55,
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      height: '36px',
      boxShadow: '0 -2px 16px rgba(0,0,0,0.3)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "breaking-label",
    style: {
      flexShrink: 0,
      background: 'rgba(0,0,0,0.25)',
      fontWeight: 900,
      fontSize: '9px',
      letterSpacing: '0.12em',
      padding: '0 14px',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      borderRight: '1px solid rgba(255,255,255,0.2)'
    }
  }, "\uD83D\uDEA8 BREAKING"), /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: 'hidden',
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-block',
      animation: 'marqueeScroll 32s linear infinite',
      whiteSpace: 'nowrap',
      paddingLeft: '24px'
    }
  }, [...breakingNews, ...breakingNews].map((n, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      marginRight: '56px',
      fontSize: '12px',
      fontWeight: 500,
      cursor: 'pointer',
      opacity: 0.92
    },
    onClick: () => setSelectedNews(n)
  }, "\u25B6 ", n.title))))), /*#__PURE__*/React.createElement("div", {
    className: "toast-container-inner",
    style: {
      position: 'fixed',
      bottom: '80px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      alignItems: 'center',
      width: '92vw',
      maxWidth: '360px',
      pointerEvents: 'none',
      zIndex: 1000
    }
  }, notifications.map(notif => /*#__PURE__*/React.createElement(Toast, {
    key: notif.id,
    message: notif.message,
    type: notif.type,
    onClose: () => removeNotification(notif.id)
  }))));
};

// ==========================================
// ERROR BOUNDARY — prevents white screen on any JS crash
// ==========================================
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }
  componentDidCatch(error, info) {
    console.error('KWT News crashed:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return /*#__PURE__*/React.createElement("div", {
        style: {
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 20px',
          background: '#0A1628',
          textAlign: 'center'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: '56px',
          marginBottom: '16px'
        }
      }, "\uD83D\uDCF0"), /*#__PURE__*/React.createElement("h1", {
        style: {
          color: '#F5A623',
          fontSize: '22px',
          fontWeight: 800,
          marginBottom: '8px'
        }
      }, "KWT News"), /*#__PURE__*/React.createElement("p", {
        style: {
          color: 'rgba(255,255,255,0.65)',
          fontSize: '14px',
          marginBottom: '28px',
          maxWidth: '300px',
          lineHeight: 1.6
        }
      }, "Something went wrong loading the app. Please refresh the page."), /*#__PURE__*/React.createElement("button", {
        onClick: () => window.location.reload(),
        style: {
          padding: '12px 32px',
          borderRadius: '999px',
          background: '#F5A623',
          color: '#0A1628',
          fontWeight: 800,
          fontSize: '14px',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(245,166,35,0.4)'
        }
      }, "\uD83D\uDD04 Refresh Page"));
    }
    return this.props.children;
  }
}

// Root Render
const Root = () => /*#__PURE__*/React.createElement(ErrorBoundary, null, /*#__PURE__*/React.createElement(ThemeProvider, null, /*#__PURE__*/React.createElement(AuthProvider, null, /*#__PURE__*/React.createElement(LanguageProvider, null, /*#__PURE__*/React.createElement(NotificationProvider, null, /*#__PURE__*/React.createElement(App, null))))));
const root = createRoot(document.getElementById('root'));
root.render(/*#__PURE__*/React.createElement(Root, null));
// Complete progress bar → fade out loader
if (typeof window.kwtCompleteLoader === 'function') {
  window.kwtCompleteLoader();
} else {
  const loader = document.getElementById('initial-loader');
  if (loader) loader.style.display = 'none';
}