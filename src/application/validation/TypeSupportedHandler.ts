import { ValidationHandler } from './ValidationHandler.js';

export class TypeSupportedHandler extends ValidationHandler {
    private static readonly SUPPORTED_TYPES = ['string', 'number', 'uuid', 'name'];

    protected validate(request: any): string | null {
        const schema = request.schema;

        for (const key in schema) {
            const type = schema[key];
            if (!TypeSupportedHandler.SUPPORTED_TYPES.includes(type.toLowerCase())) {
                return `Unsupported type '${type}' for field '${key}'. Supported types are: ${TypeSupportedHandler.SUPPORTED_TYPES.join(', ')}.`;
            }
        }

        return null;
    }
}
