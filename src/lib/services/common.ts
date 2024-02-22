import type Redis from 'ioredis';
import { TokenService } from './tokenService';
import type { ITokenService } from './interfaces';

export class CommonFunctionality {
	protected readonly redisClient: Redis;
	protected readonly tokenService: ITokenService;

	constructor(redisClient: Redis) {
		this.redisClient = redisClient;
		this.tokenService = new TokenService(redisClient);
	}

	public async getAccessHeaders(): Promise<Headers> {
		const tokenInfo = await this.tokenService.getAccessToken();

		return new Headers({
			Authorization: 'Bearer ' + tokenInfo.access_token,
			'Content-Type': 'application/json'
		});
	}

	public async fetchAndMaybeThrow<T>(url: URL): Promise<T> {
		const response = await fetch(url, {
			method: 'GET',
			headers: await this.getAccessHeaders()
		});

		if (!response.ok) {
			throw new Error(response.statusText);
		}

		const result: T = await response.json();

		return result;
	}

	public async getFromCache<T>(key: string): Promise<T | null> {
		const cached = await this.redisClient.get(key);

		if (cached) {
			const parsed = JSON.parse(cached);

			return parsed as T;
		}

		return null;
	}
}
