import type { MeetingsInfo, QueryMeetingType, User, Zak } from '$lib/types/zoom'
import type { IUserService } from './interfaces'
import { CommonFunk } from './common'
import { RedisProvider, getUserKey, getZakKey } from '$lib/providers/redis'
import { ZOOM_REST_API } from '$lib/constants'

export class UserService implements IUserService {
	private readonly redisProvider: RedisProvider
	private readonly common: CommonFunk

	constructor(opts: { redisProvider: RedisProvider; commonFunk: CommonFunk }) {
		this.redisProvider = opts.redisProvider
		this.common = opts.commonFunk
	}

	public async getUser(): Promise<User> {
		const cachedUser = await this.redisProvider.redis.get(getUserKey())

		if (cachedUser) {
			const parsed = JSON.parse(cachedUser)
			return parsed as User
		}

		const user = await this.fetchUser()
		await this.cacheUser(user)

		return user
	}

	public async getZak(): Promise<Zak> {
		const cachedZak = await this.redisProvider.redis.get(getZakKey())

		if (cachedZak) {
			const parsed = JSON.parse(cachedZak)
			return parsed as Zak
		}

		const zak = await this.fetchZak()
		await this.cacheZak(zak)

		return zak
	}

	public async getUserMeetings(type: QueryMeetingType): Promise<MeetingsInfo> {
		const url = new URL(`${ZOOM_REST_API}/users/me/meetings?type=${type}`)
		const meetings = await this.common.fetchAndMaybeThrow<MeetingsInfo>(url)

		return meetings
	}

	private async fetchZak(): Promise<Zak> {
		const url = new URL(`${ZOOM_REST_API}/users/me/token?type=zak`)
		const zak = await this.common.fetchAndMaybeThrow<Zak>(url)

		return zak
	}

	private async fetchUser(): Promise<User> {
		const url = new URL(`${ZOOM_REST_API}/users/me`)
		const user = await this.common.fetchAndMaybeThrow<User>(url)

		return user
	}

	private async cacheUser(user: User): Promise<void> {
		await this.redisProvider.redis.set(getUserKey(), JSON.stringify(user), 'EX', 1200)
	}

	private async cacheZak(zak: Zak): Promise<void> {
		await this.redisProvider.redis.set(getUserKey(), JSON.stringify(zak), 'EX', 7776000)
	}
}
