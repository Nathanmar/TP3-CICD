import { ValidationHandler } from './ValidationHandler.js'

export class SchemaFormatHandler extends ValidationHandler {
  protected validate(request: unknown): string | null {
    const data = request as Record<string, unknown>

    if (!data || typeof data !== 'object') {
      return 'Invalid request format. Expected a JSON object.'
    }

    if (!data.schema) {
      return "Missing required property: 'schema'."
    }

    if (data.count === undefined) {
      return "Missing required property: 'count'."
    }

    return null
  }
}
