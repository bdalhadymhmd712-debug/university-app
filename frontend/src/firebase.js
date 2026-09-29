import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDVnR6eBcrRwT54wl7-cbQAuEqkXCv0om0",
  authDomain: "university-app-96819.firebaseapp.com",
  projectId: "university-app-96819",
  storageBucket: "university-app-96819.firebasestorage.app",
  messagingSenderId: "287913709462",
  appId: "1:287913709462:web:8271279b2b009d948f57b7"
};

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'BNO3vhGl2JHp9_zFOoTXS5f_4f9wFem9PYdl_J_jhIjRVls3WtqylDG3ubw_zGx8rBZhoyxZUg2UHAa6xJ9aaCE'
      });
      return token;
    }
    return null;
  } catch (error) {
    console.error('خطأ في طلب الإذن:', error);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });