
'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, Query, DocumentData, QuerySnapshot } from 'firebase/firestore';

interface UseCollectionReturn<T> {
    data: T[];
    loading: boolean;
    error: Error | null;
    snapshot: QuerySnapshot<DocumentData> | null;
}

export function useCollection<T>(query: Query<DocumentData>): UseCollectionReturn<T> {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [snapshot, setSnapshot] = useState<QuerySnapshot<DocumentData> | null>(null);

    useEffect(() => {
        // Reset state on query change
        setLoading(true);
        const unsubscribe = onSnapshot(
            query,
            (snapshot: QuerySnapshot<DocumentData>) => {
                try {
                    const result: T[] = snapshot.docs.map(doc => {
                        return { id: doc.id, ...doc.data() } as T;
                    });
                    setData(result);
                    setSnapshot(snapshot);
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
    // We stringify the query object to detect changes, as it's a complex object.
    // A better approach might involve memoizing the query object itself where it's created.
    // For now, let's depend on its identity or a simplified representation if needed.
    // The dependency array should ideally capture the query's specifics.
    // Since query objects are recreated on each render, this effect might run often.
    // Using a stable query object (e.g., from useMemo) is recommended.
    }, [query]);

    return { data, loading, error, snapshot };
}
