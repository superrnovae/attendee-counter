import Redis from 'ioredis'

export class RedisProvider {
	
	public readonly redis: Redis
	
	constructor(opts: { host: string, port: number })
	{
		this.redis = new Redis({
			host: opts.host,
			port: opts.port
		})

		this.redis.on('connect', () => {
			console.log('Connected to Redis')
		})
		
		this.redis.on('error', (error) => {
			console.error(`Error connecting to Redis: ${error}`)
			throw new Error('Unable to connect with RedisClient')
		})

		const shutdownGracefully = async () => {
			await this.redis.quit()
		}

		process.on('exit', shutdownGracefully)
		process.on('SIGINT', shutdownGracefully)
		process.on('SIGTERM', shutdownGracefully)
	}
}

export const getParticipantsKey = (uuid: string): string => {
	return `participants:${uuid}`
}

export const getTokenKey = (): string => 'token:zoom'
export const getUserKey = (): string => 'user'
export const getZakKey = (): string => 'zak'
