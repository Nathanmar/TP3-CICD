import { DataGeneratorStrategy } from '../strategies/DataGeneratorStrategy.js'

export class MockDataBuilder {
  private schema: Map<string, DataGeneratorStrategy> = new Map()

  addField(name: string, strategy: DataGeneratorStrategy): MockDataBuilder {
    this.schema.set(name, strategy)
    return this
  }

  build(): Record<string, unknown> {
    const result: Record<string, unknown> = {}
    for (const [key, strategy] of this.schema.entries()) {
      result[key] = strategy.generate()
    }
    return result
  }

  buildMany(count: number): Record<string, unknown>[] {
    const results: Record<string, unknown>[] = []
    for (let i = 0; i < count; i++) {
      results.push(this.build())
    }
    return results
  }
}
