import { userService } from '$lib/constants'
import type { UserProps } from '$lib/types/props'
import { error } from '@sveltejs/kit'

export const prerender = true

/** @type {import('./$types').PageLoad} */
export async function load(): Promise<UserProps> {
	try {
		return {
			user: userService.getUser()
		}
	} catch (error) {
		console.error('There was an error fetching user info', error)
	}

	error(500, {
		code: 'INTERNAL_SERVER_ERROR',
		message: 'Contact your server administrator'
	})
}
