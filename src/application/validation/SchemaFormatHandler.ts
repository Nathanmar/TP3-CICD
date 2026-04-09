import { ValidationHandler } from './ValidationHandler.js';

export class SchemaFormatHandler extends ValidationHandler {
    protected validate(request: any): string | null {
        if (!request || typeof request !== 'object') {
            return 'Request body must be a valid JSON object.';
        }

        if (!request.schema) {
            return "Missing required property: 'schema'.";
        }

        if (request.count === undefined || request.count === null) {
            return "Missing required property: 'count'.";
        }

        if (typeof request.schema !== 'object') {
            return "'schema' must be an object.";
        }

        return null;
    }
}
