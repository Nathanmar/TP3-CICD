import { StringGenerator } from '../../src/domain/strategies/StringGenerator.js'
import { NumberGenerator } from '../../src/domain/strategies/NumberGenerator.js'
import { UUIDGenerator } from '../../src/domain/strategies/UUIDGenerator.js'
import { NameGenerator } from '../../src/domain/strategies/NameGenerator.js'

describe('DataGenerator Strategies', () => {
  describe('StringGenerator', () => {
    it('should return a string when generate is called', () => {
      // Arrange
      const generator = new StringGenerator()

      // Act
      const result = generator.generate()

      // Assert
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('NumberGenerator', () => {
    it('should return a number when generate is called', () => {
      // Arrange
      const generator = new NumberGenerator()

      // Act
      const result = generator.generate()

      // Assert
      expect(typeof result).toBe('number')
    })
  })

  describe('UUIDGenerator', () => {
    it('should return a valid UUID string when generate is called', () => {
      // Arrange
      const generator = new UUIDGenerator()
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

      // Act
      const result = generator.generate()

      // Assert
      expect(typeof result).toBe('string')
      expect(result).toMatch(uuidRegex)
    })
  })

  describe('NameGenerator', () => {
    it('should return a string when generate is called', () => {
      // Arrange
      const generator = new NameGenerator()

      // Act
      const result = generator.generate()

      // Assert
      expect(typeof result).toBe('string')
      expect(result.split(' ').length).toBeGreaterThan(0)
    })
  })
})
