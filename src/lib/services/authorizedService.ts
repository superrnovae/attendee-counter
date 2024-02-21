import type Redis from "ioredis"
import { TokenService, type ITokenService } from "./tokenService"

export abstract class AuthorizedServer {
    
    protected readonly redisClient: Redis
    protected readonly tokenService: ITokenService

    constructor(redisClient: Redis) {
        this.redisClient = redisClient
        this.tokenService = new TokenService(redisClient)
    }

    protected async getAccessHeaders(): Promise<Headers> {
        
        const tokenInfo = await this.tokenService.getAccessToken()

        return new Headers({
            "Authorization": "Bearer " + tokenInfo.access_token,
            "Content-Type": "application/json"
        })
    }
}