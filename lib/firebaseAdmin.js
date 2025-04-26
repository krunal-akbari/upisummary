import admin from 'firebase-admin';

const serviceAccount = require('../firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://upisummary.firebaseio.com" // Replace with your database URL
  });
}

export default admin;

