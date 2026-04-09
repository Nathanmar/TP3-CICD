import { DataGeneratorStrategy } from '../strategies/DataGeneratorStrategy.js';

export class MockDataBuilder {
    private schema: Map<string, DataGeneratorStrategy> = new Map();

    addField(fieldName: string, strategy: DataGeneratorStrategy): this {
        this.schema.set(fieldName, strategy);
        return this;
    }

    build(): Record<string, any> {
        const result: Record<string, any> = {};
        for (const [key, strategy] of this.schema.entries()) {
            result[key] = strategy.generate();
        }
        return result;
    }

    buildMany(count: number): Record<string, any>[] {
        return Array.from({ length: count }, () => this.build());
    }
}
