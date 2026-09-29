/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDVnR6eBcrRwT54wl7-cbQAuEqkXCv0om0",
  authDomain: "university-app-96819.firebaseapp.com",
  projectId: "university-app-96819",
  storageBucket: "university-app-96819.firebasestorage.app",
  messagingSenderId: "287913709462",
  appId: "1:287913709462:web:8271279b2b009d948f57b7"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon: '/logo192.png',
    badge: '/logo192.png',
  });
});