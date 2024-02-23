import { UserService } from '$lib/services/userService'
import type { UserMeetingsProps } from '$lib/types/props'
import { error } from '@sveltejs/kit'
import container from '$lib/providers/container'

export const prerender = true

/** @type {import('./$types').PageLoad} */
export async function load(): Promise<UserMeetingsProps> {
	try {
		const userService = container.resolve<UserService>('userService')

		return {
			scheduledMeetings: userService.getUserMeetings('scheduled')
		}
	} catch (error) {
		console.error('There was an error fetching user meetings', error)
	}

	error(500, {
		code: 'INTERNAL_SERVER_ERROR',
		message: 'Contact your server administrator'
	})
}
