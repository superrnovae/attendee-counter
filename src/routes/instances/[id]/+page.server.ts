import { MeetingService } from '$lib/services/meetingService'
import type { MeetingInstancesProps } from '$lib/types/props'
import { error } from '@sveltejs/kit'
import container from "$lib/providers/container"

/** @type {import('./$types').PageLoad} */
export async function load({ params }): Promise<MeetingInstancesProps> {
	const meetingId = parseInt(params.id)

	if (!meetingId) {
		error(402, {
			code: 'BAD_REQUEST',
			message: 'Meeting Id must be a number'
		})
	}

	try {
		const meetingService = container.resolve<MeetingService>('meetingService')
		const response = meetingService.getPastMeetingInstances(meetingId)

		return {
			instances: response
		}
	} catch (error) {
		console.error('There was an error fetching past meeting instances', error)
	}

	error(500, {
		code: 'INTERNAL_SERVER_ERROR',
		message: 'Contact your server administrator'
	})
}
