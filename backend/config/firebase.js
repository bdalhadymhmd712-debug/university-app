const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  const path = require('path');
  serviceAccount = require(path.join(__dirname, '..', 'firebase-service-account.json'));
}

if (getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

module.exports = { messaging: getMessaging() };