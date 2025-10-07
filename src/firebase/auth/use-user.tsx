
'use client';

import { useState, useEffect } from 'react';

// This will be the user object available throughout the app
export type AppUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'Administrador' | 'Cajero' | 'Supervisor' | null;
};

// This hook now checks for a local session first, then would fall back to Firebase
// but for this implementation, we are only using the local session.
export function useUser() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This code now only runs on the client.
    try {
        const localUser = localStorage.getItem('local-admin-auth');
        if (localUser) {
            setUser(JSON.parse(localUser));
        } else {
            setUser(null);
        }
    } catch(e) {
        console.error("Could not parse local user session.", e);
        setUser(null);
    }
    setLoading(false);
  }, []);

  return { user, loading };
}
