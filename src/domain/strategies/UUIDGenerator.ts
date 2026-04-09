import { faker } from '@faker-js/faker';
import { DataGeneratorStrategy } from './DataGeneratorStrategy.js';

export class UUIDGenerator implements DataGeneratorStrategy {
    generate(): string {
        return faker.string.uuid();
    }
}
