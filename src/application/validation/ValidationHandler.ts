export abstract class ValidationHandler {
    private nextHandler: ValidationHandler | null = null;

    setNext(handler: ValidationHandler): ValidationHandler {
        this.nextHandler = handler;
        return handler;
    }

    handle(request: any): string | null {
        const error = this.validate(request);
        if (error) {
            return error;
        }

        if (this.nextHandler) {
            return this.nextHandler.handle(request);
        }

        return null;
    }

    protected abstract validate(request: any): string | null;
}
