import { ValidationHandler } from './ValidationHandler.js'

export class MaxLimitHandler extends ValidationHandler {
  private static readonly MAX_LIMIT = 1000

  protected validate(request: unknown): string | null {
    const data = request as Record<string, unknown>
    const count = Number(data.count)

    if (isNaN(count)) {
      return "'count' must be a valid number."
    }

    if (count < 0) {
      return "'count' cannot be negative."
    }

    if (count > MaxLimitHandler.MAX_LIMIT) {
      return `Requested count exceeds the maximum limit of ${MaxLimitHandler.MAX_LIMIT}.`
    }

    return null
  }
}
