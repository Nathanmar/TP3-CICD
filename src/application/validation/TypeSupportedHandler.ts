import { ValidationHandler } from './ValidationHandler.js'

export class TypeSupportedHandler extends ValidationHandler {
  private readonly supportedTypes = ['string', 'number', 'uuid', 'name']

  protected validate(request: unknown): string | null {
    const data = request as Record<string, unknown>
    const schema = data.schema as Record<string, string>

    for (const field in schema) {
      if (!this.supportedTypes.includes(schema[field].toLowerCase())) {
        return `Unsupported type '${schema[field]}' for field '${field}'. Supported types: ${this.supportedTypes.join(', ')}.`
      }
    }

    return null
  }
}
