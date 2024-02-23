import { TokenService } from './tokenService'

export class CommonFunk {
	private readonly tokenService: TokenService

	constructor(opts: { tokenService: TokenService }) {
		this.tokenService = opts.tokenService
	}

	public async fetchAndMaybeThrow<T>(url: URL): Promise<T> {
		const token_info = await this.tokenService.getAccessToken()

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + token_info.access_token,
				'Content-Type': 'application/json'
			}
		})

		if (!response.ok) {
			throw new Error(response.statusText)
		}

		const result: T = await response.json()

		return result
	}
}
