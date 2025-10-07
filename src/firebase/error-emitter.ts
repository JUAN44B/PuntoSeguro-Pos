import type { FirestorePermissionError } from './errors';

interface Events {
  'permission-error': (error: FirestorePermissionError) => void;
}

type EventName = keyof Events;
type Callback<T> = (data: T) => void;

// A simple, dependency-free event emitter
function createSimpleEmitter<E extends Record<EventName, any>>() {
  const listeners: { [K in keyof E]?: Callback<E[K]>[] } = {};

  return {
    on<K extends keyof E>(event: K, callback: Callback<E[K]>) {
      if (!listeners[event]) {
        listeners[event] = [];
      }
      listeners[event]!.push(callback);
      
      // Return an unsubscribe function
      return () => {
        listeners[event] = listeners[event]?.filter(cb => cb !== callback);
      };
    },
    emit<K extends keyof E>(event: K, data: E[K]) {
      listeners[event]?.forEach(callback => {
        try {
          callback(data);
        } catch (e) {
          console.error(`Error in event listener for ${String(event)}:`, e);
        }
      });
    },
  };
}

const errorEmitter = createSimpleEmitter<Events>();

export { errorEmitter };
