'use client';

import { useEffect, useState } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';

export function FirebaseErrorListener({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = errorEmitter.on('permission-error', (permissionError) => {
      // Throw the error to let Next.js error overlay catch it
      setError(() => { throw permissionError });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (error) {
    // This part will likely not be rendered because the error is thrown.
    // However, it's a good fallback.
    return <div>An unexpected error occurred.</div>;
  }

  return <>{children}</>;
}
