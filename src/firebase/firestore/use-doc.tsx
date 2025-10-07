
'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot, DocumentReference, DocumentData, DocumentSnapshot } from 'firebase/firestore';

interface UseDocReturn<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
    snapshot: DocumentSnapshot<DocumentData> | null;
}

export function useDoc<T>(ref: DocumentReference<DocumentData> | null): UseDocReturn<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [snapshot, setSnapshot] = useState<DocumentSnapshot<DocumentData> | null>(null);

    useEffect(() => {
        if (!ref) {
            setData(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        const unsubscribe = onSnapshot(
            ref,
            (snapshot: DocumentSnapshot<DocumentData>) => {
                try {
                    if (snapshot.exists()) {
                        setData({ id: snapshot.id, ...snapshot.data() } as T);
                    } else {
                        setData(null);
                    }
                    setSnapshot(snapshot);
                    setError(null);
                } catch(e: any) {
                    setError(e);
                } finally {
                    setLoading(false);
                }
            },
            (err: Error) => {
                console.error("Error in useDoc:", err);
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [ref]);

    return { data, loading, error, snapshot };
}
