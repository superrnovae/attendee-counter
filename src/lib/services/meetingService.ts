import { ZOOM_REST_URL } from "$env/static/private";
import type { Redis } from "ioredis";
import { Participant, type MeetingInstancesInfo, type ParticipantsInfo, type PollResult, type PollQuestion, type MeetingInstance } from "$lib/types/zoom";
import { AuthorizedServer } from "./authorizedService";
import config from "$lib/data/config.json"
import type { IMeetingService } from "./interfaces";

export class MeetingService extends AuthorizedServer implements IMeetingService {

    constructor(redisClient: Redis) {
        super(redisClient)
    }

    public async getPastMeetingInstances(meetingId: number): Promise<MeetingInstance[]> {

        const url = `${ZOOM_REST_URL}/past_meetings/${meetingId}/instances`

        const response = await fetch(url, {
            method: "GET",
            headers: await this.getAccessHeaders()
        })

        if (!response.ok) {
            throw new Error(response.statusText)
        }

        const info: MeetingInstancesInfo = await response.json()

        info.meetings.sort(this.sortMeetingsByDate)

        return info.meetings
    }

    public async getPastMeetingParticipants(uuid: string): Promise<ParticipantsInfo> {

        const url = `${ZOOM_REST_URL}/past_meetings/${uuid}/participants?page_size=300`

        const response = await fetch(url, {
            method: "GET",
            headers: await this.getAccessHeaders()
        })

        if (!response.ok) {
            throw new Error(response.statusText)
        }

        const page: ParticipantsInfo = await response.json()
        page.participants = this.filterParticipants(page.participants)

        const pollResults = await this.getPastMeetingPollResults(uuid)

        this.applyPollResultToEachParticipant(page.participants, pollResults)

        return page
    }

    public async getPastMeetingPollResults(uuid: string): Promise<PollResult> {
        const url = `${ZOOM_REST_URL}/past_meetings/${uuid}/polls`

        const response = await fetch(url, {
            method: "GET",
            headers: await this.getAccessHeaders()
        })

        if (!response.ok) {
            throw new Error(response.statusText)
        }

        const polls: PollResult = await response.json()
        
        return polls
    }

    private filterParticipants(participants: Participant[]) {

        const map = new Map<string, Participant>()

        participants.forEach(p => {

            if (p.status === 'in_waiting_room' 
            || config.ignored_participants.includes(p.name)
            || p.duration < 600) return

            const existingObj = map.get(p.name)

            if (!existingObj || p.duration > existingObj.duration) {
                map.set(p.name, p)
            }
        })

        const ret = Array.from(map.values()).sort(Participant.compare)

        return ret
    }

    private sortMeetingsByDate(a: MeetingInstance, b: MeetingInstance) {
        return new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
    }

    private applyPollResultToEachParticipant(participants: Participant[], pollResult: PollResult): void {
        
        participants.forEach(p => {
			const userAnswers = pollResult.questions.findIndex(q => q.name === p.name)

			if(userAnswers !== -1) 
			{
				p.poll_answer = parseInt(pollResult.questions[userAnswers].question_details[0].answer)
			}
			else
			{
				p.poll_answer = 1
			}
		})

    }
}