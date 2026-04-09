import { faker } from '@faker-js/faker'
import { DataGeneratorStrategy } from './DataGeneratorStrategy.js'

export class NameGenerator implements DataGeneratorStrategy {
  generate(): string {
    return faker.person.fullName()
  }
}
