import { createNanoEvents } from 'nanoid/non-secure';
import { FirestorePermissionError } from './errors';

interface Events {
  'permission-error': (error: FirestorePermissionError) => void;
}

export const errorEmitter = createNanoEvents<Events>();
