import { createNanoEvents } from 'nanoid/non-secure';
import { FirestorePermissionError } from './errors';

interface Events {
  'permission-error': (error: FirestorePermissionError) => void;
}

// Ensure a single instance of the emitter is created and used.
const errorEmitter = createNanoEvents<Events>();

export { errorEmitter };
