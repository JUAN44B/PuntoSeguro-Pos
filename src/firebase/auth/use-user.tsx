
'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseAuthUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth, useFirestore } from '../provider';

// This will be the user object available throughout the app
export type AppUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'Administrador' | 'Cajero' | 'Supervisor' | null;
};

// Define the hardcoded super admin email
const SUPER_ADMIN_EMAIL = 'admin@aliru.com';

export function useUser() {
  const auth = useAuth();
  const firestore = useFirestore();
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseAuthUser | null) => {
      if (firebaseUser) {
        // Check if the logged-in user is the super admin
        if (firebaseUser.email === SUPER_ADMIN_EMAIL) {
          const userDocRef = doc(firestore, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          // Create a profile for the super admin if it doesn't exist
          if (!userDoc.exists()) {
            await setDoc(userDocRef, {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: 'Admin Principal',
              role: 'Administrador',
            });
          }

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: 'Admin Principal',
            role: 'Administrador',
          });
        } else {
          // For regular users, get their profile from Firestore
          const userDocRef = doc(firestore, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: userData.displayName || null,
              role: userData.role || null,
            });
          } else {
            // No profile doc found, maybe a partially created user.
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              role: null, // No role found
            });
          }
        }
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  return { user, loading };
}
