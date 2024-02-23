export type User = {
	/**
	 * Id
	 */
	id: string

	/**
	 * First name
	 */
	first_name: string

	/**
	 * Last name
	 */
	last_name: string

	/**
	 * User's display name.
	 */
	display_name: string

	/**
	 * User's email address.
	 */
	email: string

	/**
	 * Personal Meeting ID (PMI).
	 */
	pmi: number

	/**
	 * Displays true if user has enabled a personal meeting ID (PMI) for instant meetings, false otherwise.
	 */
	use_pmi: boolean

	type: UserType

	account_id: string

	account_number: number

	company: string | undefined

	language: string

	login_types: LoginType[]

	personal_meeting_url: string

	pic_url: string
}

export enum UserType {
	Basic = 1,
	Lisenced = 2,
	None = 99
}

export enum LoginType {
	FACEBOOK_OAUTH = 0,
	GOOGLE_OAUTH = 1,
	APPLE_OAUTH = 24,
	MICROSOFT_OAUTH = 27,
	MOBILE_DEVICE = 97,
	RINGCENTRAL_OAUTH = 98,
	API_USER = 99,
	ZOOM_WORK_EMAIL = 100,
	SSO = 101
}

export type MeetingInstance = {
	start_time: string
	uuid: string
}

export type MeetingInstancesInfo = {
	meetings: MeetingInstance[]
}

export type TokenInfo = {
	/**
	 * Your access token.
	 */
	access_token: string

	/**
	 * The token type (bearer)
	 */
	token_type: string

	/**
	 * Expires in one hour (3600 seconds).
	 */
	expires_in: number

	/**
	 * The scopes that you chose in your app settings page on the Zoom App Marketplace.
	 */
	scope: string
}

export type Zak = {
	token: string
}

export type PaginationData = {
	page_count: number
	page_size: number
	total_records: number
	next_page_token: string
}

export type MeetingsInfo = {
	meetings: Meeting[]
} & PaginationData

export type ParticipantsInfo = {
	participants: Participant[]
} & PaginationData

export type Meeting = {
	agenda: string
	created_at: Date
	duration: number
	host_id: string
	id: number
	topic: string
	type: MeetingType
	timezone: string
	join_url: string
	pmi: string | undefined
} & MeetingInstance

export enum MeetingType {
	PRESCHEDULED_MEETING = 0,
	INSTANT_MEETING = 1,
	SCHEDULED_MEETING = 2,
	RECURRING_MEETING_WITH_NO_FIXED_TIME = 3,
	PERSONAL_MEETING_ROOM = 4,
	PERSONAL_AUDIO_CONFERENCE_MEETING = 7,
	RECURRING_MEETING_WITH_FIXED_TIME = 8
}

export type QueryMeetingType =
	| 'scheduled'
	| 'live'
	| 'upcoming'
	| 'upcoming_meetings'
	| 'previous_meetings'

export class Participant {
	id: string = ''
	name: string = ''
	user_id: string = ''
	registrant_id: string = ''
	user_email: string | null = null
	join_time: Date = new Date()
	leave_time: Date = new Date()
	duration: number = 0
	failover: boolean = false
	status: 'in_meeting' | 'in_waiting_room' = 'in_waiting_room'
	poll_answer: number = 1

	static compare(a: Participant, b: Participant): 1 | -1 | 0 {
		if (a.name < b.name) return -1
		if (a.name > b.name) return 1

		// If names are equal, compare by duration
		if (a.duration < b.duration) return -1
		if (a.duration > b.duration) return 1

		return 0 // Objects are equal
	}
}

export type PollResult = {
	id: number
	questions: PollQuestion[]
}

export type PollQuestion = {
	email: string
	name: string
	question_details: PollQuestionDetails[]
	start_time: Date
	uuid: string
}

export type PollQuestionDetails = {
	answer: string
	date_time: Date
	polling_id: string
	question: string
}
