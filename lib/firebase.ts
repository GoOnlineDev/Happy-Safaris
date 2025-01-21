"use client";

import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDoq2BDUDDcQyEaUwtipuoWKsYklIGQckY",
  authDomain: "happy-safaris.firebaseapp.com",
  projectId: "happy-safaris",
  storageBucket: "happy-safaris.firebasestorage.app",
  messagingSenderId: "600743540809",
  appId: "1:600743540809:web:1879992dde1afe23af2798"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };