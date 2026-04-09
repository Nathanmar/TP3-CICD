import { MockDataBuilder } from '../../src/domain/builders/MockDataBuilder.js'
import { StringGenerator } from '../../src/domain/strategies/StringGenerator.js'
import { NumberGenerator } from '../../src/domain/strategies/NumberGenerator.js'

describe('MockDataBuilder', () => {
  it('should build an object with correct fields when schema is provided', () => {
    // Arrange
    const builder = new MockDataBuilder()
    builder.addField('testString', new StringGenerator())
    builder.addField('testNumber', new NumberGenerator())

    // Act
    const result = builder.build()

    // Assert
    expect(result).toHaveProperty('testString')
    expect(result).toHaveProperty('testNumber')
    expect(typeof result.testString).toBe('string')
    expect(typeof result.testNumber).toBe('number')
  })

  it('should build multiple objects when buildMany is called', () => {
    // Arrange
    const builder = new MockDataBuilder()
    builder.addField('id', new StringGenerator())
    const count = 5

    // Act
    const results = builder.buildMany(count)

    // Assert
    expect(Array.isArray(results)).toBe(true)
    expect(results.length).toBe(count)
    results.forEach((item) => {
      expect(item).toHaveProperty('id')
    })
  })

  it('should return an empty object when no fields are added', () => {
    // Arrange
    const builder = new MockDataBuilder()

    // Act
    const result = builder.build()

    // Assert
    expect(Object.keys(result).length).toBe(0)
  })
})
