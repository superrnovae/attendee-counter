import type { MeetingInstancesInfo, User, ParticipantsInfo, MeetingsInfo, MeetingInstance } from "./zoom"

export type MeetingInstancesProps = {
    instances: Promise<MeetingInstance[]>
}

export type MeetingParticipantsProps = {
    participant_info: Promise<ParticipantsInfo>
}

export type UserProps = {
    user: Promise<User>
}

export type UserMeetingsProps = {
    scheduledMeetings: Promise<MeetingsInfo>
}