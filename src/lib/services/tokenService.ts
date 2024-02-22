import { ACCOUNT_ID, CLIENT_ID, CLIENT_SECRET, ZOOM_AUTH_URL } from '$env/static/private';
import type { TokenInfo } from '$lib/types/zoom';
import type Redis from 'ioredis';
import type { ITokenService } from './interfaces';
import { getTokenKey } from '$lib/providers/redis';
import { CommonFunctionality } from './common';

export class TokenService implements ITokenService {
	private readonly redis: Redis;
	private readonly common: CommonFunctionality;

	constructor(redisClient: Redis) {
		this.redis = redisClient;
		this.common = new CommonFunctionality(redisClient);
	}

	public async getAccessToken(): Promise<TokenInfo> {
		const tokenKey = getTokenKey();
		const cached = await this.common.getFromCache<TokenInfo>(tokenKey);

		if (cached) {
			return cached;
		}

		const fetched = await this.fetchAccessTokenFromApi();
		await this.cacheAccessToken(fetched);

		return fetched;
	}

	private readonly fetchAccessTokenFromApi = async (): Promise<TokenInfo> => {
		const utf8creds = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`, 'utf-8').toString();
		const base64creds = btoa(utf8creds);

		const response = await fetch(`${ZOOM_AUTH_URL}`, {
			method: 'POST',
			headers: new Headers({
				Authorization: 'Basic ' + base64creds,
				'Content-Type': 'application/x-www-form-urlencoded'
			}),
			body: new URLSearchParams({
				account_id: ACCOUNT_ID,
				grant_type: 'account_credentials'
			})
		});

		if (!response.ok) {
			throw new Error(response.statusText);
		}

		const tokenObj: TokenInfo = await response.json();

		return tokenObj;
	};

	private readonly cacheAccessToken = async (token: TokenInfo): Promise<void> => {
		await this.redis.set(getTokenKey(), JSON.stringify(token), 'EX', token.expires_in);
	};
}
