'use client';

import { createContext, useContext, ReactNode } from 'react';
import { initializeFirebase } from './index';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

type FirebaseContextValue = ReturnType<typeof initializeFirebase>;

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const value = initializeFirebase();

  return (
    <FirebaseContext.Provider value={value}>
      <FirebaseErrorListener>
        {children}
      </FirebaseErrorListener>
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => {
    const context = useContext(FirebaseContext);
    if (!context) {
        throw new Error('useFirebase must be used within a FirebaseProvider');
    }
    return context;
}

export const useFirebaseApp = () => useFirebase().app;
export const useAuth = () => useFirebase().auth;
export const useFirestore = () => useFirebase().firestore;
