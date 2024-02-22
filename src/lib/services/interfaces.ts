import type {
	MeetingInstance,
	MeetingsInfo,
	Participant,
	PollResult,
	QueryMeetingType,
	TokenInfo,
	User,
	Zak
} from '$lib/types/zoom';

export interface IUserService {
	getUser(): Promise<User>;
	getZak(): Promise<Zak>;
	getUserMeetings(type: QueryMeetingType): Promise<MeetingsInfo>;
}

export interface IMeetingService {
	getPastMeetingInstances(meetingId: number): Promise<MeetingInstance[]>;
	getPastMeetingParticipants(uuid: string): Promise<Participant[]>;
	getPastMeetingPollResults(uuid: string): Promise<PollResult>;
}

export interface ITokenService {
	getAccessToken(): Promise<TokenInfo>;
}
