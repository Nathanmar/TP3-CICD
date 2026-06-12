import request from 'supertest'
import app from '../../src/presentation/app.js'

describe('API Integration Tests (POST /api/mock)', () => {
  it('should return 200 and generated data when request is valid', async () => {
    // Arrange
    const payload = {
      schema: {
        id: 'uuid',
        name: 'name',
      },
      count: 3,
    }

    // Act
    const response = await request(app).post('/api/mock').send(payload)

    // Assert
    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.length).toBe(3)
    expect(response.body[0]).toHaveProperty('id')
    expect(response.body[0]).toHaveProperty('name')
  })

  it('should return 400 when schema is missing', async () => {
    // Arrange
    const payload = {
      count: 5,
    }

    // Act
    const response = await request(app).post('/api/mock').send(payload)

    // Assert
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toMatch(/Missing required property: 'schema'/)
  })

  it('should return 400 when count exceeds limit', async () => {
    // Arrange
    const payload = {
      schema: { id: 'uuid' },
      count: 5000,
    }

    // Act
    const response = await request(app).post('/api/mock').send(payload)

    // Assert
    expect(response.status).toBe(400)
    expect(response.body.error).toMatch(/exceeds the maximum limit/)
  })

  it('should return 400 when an unsupported type is requested', async () => {
    // Arrange
    const payload = {
      schema: { age: 'invalid_type' },
      count: 1,
    }

    // Act
    const response = await request(app).post('/api/mock').send(payload)

    // Assert
    expect(response.status).toBe(400)
    expect(response.body.error).toMatch(/Unsupported type 'invalid_type'/)
  })
})

describe('Health & Metrics Endpoints', () => {
  it('GET /health should return 200 with status ok', async () => {
    // Arrange / Act
    const response = await request(app).get('/health')

    // Assert
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ status: 'ok' })
  })

  it('GET /metrics should return 200 with expected fields', async () => {
    // Arrange / Act
    const response = await request(app).get('/metrics')

    // Assert
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('uptime_seconds')
    expect(response.body).toHaveProperty('version')
    expect(response.body).toHaveProperty('node_version')
    expect(response.body).toHaveProperty('timestamp')
    expect(response.body).toHaveProperty('memory_mb')
    expect(typeof response.body.uptime_seconds).toBe('number')
    expect(typeof response.body.memory_mb).toBe('number')
  })
})
