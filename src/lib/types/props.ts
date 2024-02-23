import type { User, MeetingsInfo, MeetingInstance, Participant } from './zoom'

export type MeetingInstancesProps = {
	instances: Promise<MeetingInstance[]>
}

export type MeetingParticipantsProps = {
	participants: Promise<Participant[]>
}

export type UserProps = {
	user: Promise<User>
}

export type UserMeetingsProps = {
	scheduledMeetings: Promise<MeetingsInfo>
}
