import type { 
    MeetingInstance,
    MeetingInstancesInfo, 
    MeetingsInfo, 
    ParticipantsInfo, 
    PollResult, 
    QueryMeetingType, 
    TokenInfo, 
    User, 
    Zak } from "$lib/types/zoom"

export interface IUserService {
    getUser(): Promise<User>
    getZak(): Promise<Zak>
    getUserMeetings(type: QueryMeetingType): Promise<MeetingsInfo>
}

export interface IMeetingService {
    getPastMeetingInstances(meetingId: number): Promise<MeetingInstance[]>
    getPastMeetingParticipants(uuid: string): Promise<ParticipantsInfo>
    getPastMeetingPollResults(uuid: string): Promise<PollResult>
}

export interface ITokenService {
    getAccessToken(): Promise<TokenInfo>
}