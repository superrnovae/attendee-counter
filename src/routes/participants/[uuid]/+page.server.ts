import { meetingService } from "$lib/constants"
import type { MeetingParticipantsProps } from "$lib/types/props"
import { error } from "@sveltejs/kit"

export const prerender = true

/** @type {import('./$types').PageLoad} */
export async function load({ params }): Promise<MeetingParticipantsProps> {
	
	try 
	{
		const encodedUUID = encodeURIComponent(params.uuid)
		const page = meetingService.getPastMeetingParticipants(encodedUUID)

		return {
			participant_info: page
		}
	}
	catch(error)
	{
		console.error('There was an error fetching meeting participants', error)
	}

	error(500, {
		code: "INTERNAL_SERVER_ERROR",
		message: 'Contact your server administrator'
	})	
}

