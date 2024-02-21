import { ZOOM_REST_URL } from "$env/static/private"
import type Redis from "ioredis"
import type { MeetingsInfo, QueryMeetingType, User, Zak } from "$lib/types/zoom"
import { AuthorizedServer } from "./authorizedService"
import type { IUserService } from "./interfaces"

export class UserService extends AuthorizedServer implements IUserService {

    private readonly userKey: string
    private readonly zakKey: string

    constructor(redisClient: Redis) {
        super(redisClient)
        this.userKey = "user"
        this.zakKey = "zak"
    }
    
    public async getUser(): Promise<User> {
        const cachedUser = await this.getUserFromCache()

        if(cachedUser) 
        {
            return cachedUser
        }

        const user = await this.fetchUser()
        await this.cacheUser(user)
        
        return user
    }

    public async getZak(): Promise<Zak> {
        const cachedZak = await this.getZakFromCache()

        if(cachedZak) 
        {
            return cachedZak
        }

        const zak = await this.fetchZak()
        await this.cacheZak(zak)

        return zak
    }

    public async getUserMeetings(type: QueryMeetingType): Promise<MeetingsInfo> {
        const url = `${ZOOM_REST_URL}/users/me/meetings?type=${type}`

        const response = await fetch(url, {
            method: "GET",
            headers: await this.getAccessHeaders()
        })

        if(!response.ok)
        {
            throw Error(response.statusText)
        }

        const meetings: MeetingsInfo = await response.json()

        return meetings
    }

    private async fetchZak(): Promise<Zak> {
        const url =`${ZOOM_REST_URL}/users/me/token?type=zak`

        const response = await fetch(url, {
            method: "GET",
            headers: await this.getAccessHeaders()
        })

        if(!response.ok)
        {
            throw Error(response.statusText)
        }

        const zak: Zak = await response.json()

        return zak
    }

    private async fetchUser(): Promise<User> {
        const response = await fetch(`${ZOOM_REST_URL}/users/me`, {
            method: "GET",
            headers: await this.getAccessHeaders()
        })
    
        if(!response.ok) {
            throw Error(response.statusText)
        }
    
        const user: User = await response.json()

        return user
    }

    private async cacheUser(user: User): Promise<void> {
        await this.redisClient.set(this.userKey, JSON.stringify(user), "EX", 1200)
    }

    private async cacheZak(zak: Zak): Promise<void> {
        await this.redisClient.set(this.zakKey, JSON.stringify(zak), "EX", 7776000)
    }

    private async getZakFromCache(): Promise<Zak | null> {
        const cached = await this.redisClient.get(this.zakKey)

        if(cached) 
        {
            const zak: Zak = JSON.parse(cached)

            return zak
        }

        return null
    }

    private async getUserFromCache(): Promise<User | null> {
        const cached = await this.redisClient.get(this.userKey)

        if(cached) {
            const user: User = JSON.parse(cached)

            return user
        }

        return null
    }
}







