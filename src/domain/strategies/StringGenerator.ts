import { faker } from '@faker-js/faker'
import { DataGeneratorStrategy } from './DataGeneratorStrategy.js'

export class StringGenerator implements DataGeneratorStrategy {
  generate(): string {
    return faker.lorem.word()
  }
}
