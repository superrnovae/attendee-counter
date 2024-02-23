import { InjectionMode, createContainer, asClass } from 'awilix'
import { RedisProvider } from './redis'
import { CommonFunk } from '$lib/services/common'
import { TokenService } from '$lib/services/tokenService'
import { MeetingService } from '$lib/services/meetingService'
import { UserService } from '$lib/services/userService'
import { REDIS_HOST, REDIS_PORT } from '$env/static/private'

const container = createContainer({
	injectionMode: InjectionMode.PROXY,
	strict: true
})

container.register({
	redisProvider: asClass(RedisProvider)
		.singleton()
		.inject(() => ({
			host: REDIS_HOST,
			port: REDIS_PORT
		})),
	tokenService: asClass(TokenService).scoped(),
	commonFunk: asClass(CommonFunk).scoped(),
	meetingService: asClass(MeetingService).scoped(),
	userService: asClass(UserService).scoped()
})

process.on('SIGINT', async () => {
	await container.dispose()
})

process.on('SIGTERM', async () => {
	await container.dispose()
})

export default container
