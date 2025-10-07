export type SecurityRuleContext = {
    path: string;
    operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
    requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
    public context: SecurityRuleContext;
    public originalError?: any;

    constructor(context: SecurityRuleContext, originalError?: any) {
        const message = `FirestoreError: Missing or insufficient permissions. Context: ${JSON.stringify(context, null, 2)}`;
        super(message);
        this.name = 'FirestorePermissionError';
        this.context = context;
        this.originalError = originalError;
        
        // This is for V8 engines (like Node.js and Chrome)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, FirestorePermissionError);
        }
    }
}
