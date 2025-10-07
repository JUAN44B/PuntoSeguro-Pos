'use client';

import { createContext, useContext, ReactNode } from 'react';
import { initializeFirebase } from './index';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

// Simple flag to disable all Firebase interactions for local mode
const FIREBASE_ENABLED = false;

type FirebaseContextValue = ReturnType<typeof initializeFirebase> | null;

const FirebaseContext = createContext<FirebaseContextValue>(null);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const value = FIREBASE_ENABLED ? initializeFirebase() : null;

  return (
    <FirebaseContext.Provider value={value}>
      {FIREBASE_ENABLED ? <FirebaseErrorListener>{children}</FirebaseErrorListener> : children}
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => {
    const context = useContext(FirebaseContext);
    if (FIREBASE_ENABLED && !context) {
        throw new Error('useFirebase must be used within a FirebaseProvider');
    }
    return context;
}

// These hooks will now return null or throw an error if Firebase is disabled.
// Components using them will need to handle this.
export const useFirebaseApp = () => useFirebase()?.app;
export const useAuth = () => useFirebase()?.auth;
export const useFirestore = () => useFirebase()?.firestore;
