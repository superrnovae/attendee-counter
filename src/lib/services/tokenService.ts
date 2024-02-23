import { ACCOUNT_ID, CLIENT_ID, CLIENT_SECRET } from '$env/static/private'
import type { TokenInfo } from '$lib/types/zoom'
import type { ITokenService } from './interfaces'
import { RedisProvider, getTokenKey } from '$lib/providers/redis'
import { ZOOM_AUTH_API } from '$lib/constants'

export class TokenService implements ITokenService {
	private readonly redisProvider: RedisProvider

	constructor(opts: { redisProvider: RedisProvider }) {
		this.redisProvider = opts.redisProvider
	}

	public async getAccessToken(): Promise<TokenInfo> {
		const tokenKey = getTokenKey()
		const cached = await this.redisProvider.redis.get(tokenKey)

		if (cached) {
			const parsed = JSON.parse(cached)
			return parsed
		}

		const fetched = await this.fetchAccessTokenFromApi()
		await this.cacheAccessToken(fetched)

		return fetched
	}

	private readonly fetchAccessTokenFromApi = async (): Promise<TokenInfo> => {
		const utf8creds = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`, 'utf-8').toString()
		const base64creds = btoa(utf8creds)

		const response = await fetch(`${ZOOM_AUTH_API}`, {
			method: 'POST',
			headers: new Headers({
				Authorization: 'Basic ' + base64creds,
				'Content-Type': 'application/x-www-form-urlencoded'
			}),
			body: new URLSearchParams({
				account_id: ACCOUNT_ID,
				grant_type: 'account_credentials'
			})
		})

		if (!response.ok) {
			throw new Error(response.statusText)
		}

		const tokenObj: TokenInfo = await response.json()

		return tokenObj
	}

	private readonly cacheAccessToken = async (token: TokenInfo): Promise<void> => {
		await this.redisProvider.redis.set(getTokenKey(), JSON.stringify(token), 'EX', token.expires_in)
	}
}
