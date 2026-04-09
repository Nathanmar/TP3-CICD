import { faker } from '@faker-js/faker'
import { DataGeneratorStrategy } from './DataGeneratorStrategy.js'

export class NumberGenerator implements DataGeneratorStrategy {
  generate(): number {
    return faker.number.int()
  }
}
