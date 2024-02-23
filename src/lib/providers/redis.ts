import { REDIS_HOST, REDIS_PORT } from '$env/static/private'
import Redis from 'ioredis'

const redisClient = new Redis({
	host: REDIS_HOST,
	port: +REDIS_PORT
})

const shutdownGracefully = async () => {
	await redisClient.quit()
}

redisClient.on('connect', () => {
	console.log('Connected to Redis')
})

redisClient.on('error', (error) => {
	console.error(`Error connecting to Redis: ${error}`)
	throw new Error('Unable to connect with RedisClient')
})

// Clean up resources when the server shuts down
process.on('exit', shutdownGracefully)
process.on('SIGINT', shutdownGracefully)
process.on('SIGTERM', shutdownGracefully)

export const getParticipantsKey = (uuid: string): string => {
	return `participants:${uuid}`
}

export const getTokenKey = (): string => 'token:zoom'
export const getUserKey = (): string => 'user'
export const getZakKey = (): string => 'zak'

export const getFromCache = async <T>(key: string): Promise<T | null> => {
	const cached = await redisClient.get(key)

	if (cached) {
		const parsed = JSON.parse(cached)

		return parsed as T
	}

	return null
}

export default redisClient
