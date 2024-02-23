import { MeetingService } from '$lib/services/meetingService'
import type { MeetingParticipantsProps } from '$lib/types/props'
import { error } from '@sveltejs/kit'
import container from '$lib/providers/container'

/** @type {import('./$types').PageLoad} */
export async function load({ params }): Promise<MeetingParticipantsProps> {
	try {
		const encodedUUID = encodeURIComponent(params.uuid)
		const meetingService = container.resolve<MeetingService>('meetingService')
		const participants = meetingService.getPastMeetingParticipants(encodedUUID)

		return {
			participants: participants
		}
	} catch (error) {
		console.error('There was an error fetching meeting participants', error)
	}

	error(500, {
		code: 'INTERNAL_SERVER_ERROR',
		message: 'Contact your server administrator'
	})
}
