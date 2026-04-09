import { ValidationHandler } from './ValidationHandler.js';

export class MaxLimitHandler extends ValidationHandler {
    private static readonly MAX_LIMIT = 1000;

    protected validate(request: any): string | null {
        const count = Number(request.count);

        if (isNaN(count)) {
            return "'count' must be a valid number.";
        }

        if (count < 0) {
            return "'count' cannot be negative.";
        }

        if (count > MaxLimitHandler.MAX_LIMIT) {
            return `Requested count exceeds the maximum limit of ${MaxLimitHandler.MAX_LIMIT}.`;
        }

        return null;
    }
}
