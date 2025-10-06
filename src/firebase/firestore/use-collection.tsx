
'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, Query, DocumentData, QuerySnapshot } from 'firebase/firestore';

interface UseCollectionReturn<T> {
    data: T[];
    loading: boolean;
    error: Error | null;
}

export function useCollection<T>(query: Query<DocumentData>): UseCollectionReturn<T> {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query,
            (snapshot: QuerySnapshot<DocumentData>) => {
                try {
                    const result: T[] = snapshot.docs.map(doc => {
                        return { id: doc.id, ...doc.data() } as T;
                    });
                    setData(result);
                    setError(null);
                } catch(e: any) {
                    setError(e);
                } finally {
                    setLoading(false);
                }
            },
            (err: Error) => {
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [query]);

    return { data, loading, error };
}
