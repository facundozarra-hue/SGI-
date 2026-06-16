import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDkXhZTMYyBby5Tgfn3ZV28xZfk7GS4BiQ',
  authDomain: 'sgi-empresa.firebaseapp.com',
  projectId: 'sgi-empresa',
  storageBucket: 'sgi-empresa.firebasestorage.app',
  messagingSenderId: '177561722206',
  appId: '1:177561722206:web:43b697469bff2038eb03cf',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
