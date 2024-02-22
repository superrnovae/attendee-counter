import redisClient from './providers/redis';
import type { IMeetingService, ITokenService, IUserService } from './services/interfaces';
import { MeetingService } from './services/meetingService';
import { TokenService } from './services/tokenService';
import { UserService } from './services/userService';

export const tokenService: ITokenService = new TokenService(redisClient);
export const meetingService: IMeetingService = new MeetingService(redisClient);
export const userService: IUserService = new UserService(redisClient);
