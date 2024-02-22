import { ZOOM_REST_URL } from '$env/static/private';
import type Redis from 'ioredis';
import type { MeetingsInfo, QueryMeetingType, User, Zak } from '$lib/types/zoom';
import type { IUserService } from './interfaces';
import { CommonFunctionality } from './common';
import { getUserKey, getZakKey } from '$lib/providers/redis';

export class UserService implements IUserService {
	private readonly redisClient: Redis;
	private readonly common: CommonFunctionality;

	constructor(redisClient: Redis) {
		this.redisClient = redisClient;
		this.common = new CommonFunctionality(redisClient);
	}

	public async getUser(): Promise<User> {
		const cachedUser = await this.common.getFromCache<User>(getUserKey());

		if (cachedUser) {
			return cachedUser;
		}

		const user = await this.fetchUser();
		await this.cacheUser(user);

		return user;
	}

	public async getZak(): Promise<Zak> {
		const cachedZak = await this.common.getFromCache<Zak>(getZakKey());

		if (cachedZak) {
			return cachedZak;
		}

		const zak = await this.fetchZak();
		await this.cacheZak(zak);

		return zak;
	}

	public async getUserMeetings(type: QueryMeetingType): Promise<MeetingsInfo> {
		const url = new URL(`${ZOOM_REST_URL}/users/me/meetings?type=${type}`);
		const meetings = await this.common.fetchAndMaybeThrow<MeetingsInfo>(url);

		return meetings;
	}

	private async fetchZak(): Promise<Zak> {
		const url = new URL(`${ZOOM_REST_URL}/users/me/token?type=zak`);
		const zak = await this.common.fetchAndMaybeThrow<Zak>(url);

		return zak;
	}

	private async fetchUser(): Promise<User> {
		const url = new URL(`${ZOOM_REST_URL}/users/me`);
		const user = await this.common.fetchAndMaybeThrow<User>(url);

		return user;
	}

	private async cacheUser(user: User): Promise<void> {
		await this.redisClient.set(getUserKey(), JSON.stringify(user), 'EX', 1200);
	}

	private async cacheZak(zak: Zak): Promise<void> {
		await this.redisClient.set(getUserKey(), JSON.stringify(zak), 'EX', 7776000);
	}
}
