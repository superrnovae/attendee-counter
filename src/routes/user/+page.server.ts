import { UserService } from '$lib/services/userService'
import type { UserProps } from '$lib/types/props'
import { error } from '@sveltejs/kit'
import container from '$lib/providers/container'
import type { IUserService } from '$lib/services/interfaces'

/** @type {import('./$types').PageLoad} */
export async function load(): Promise<UserProps> {
	try {
		const userService: IUserService = container.resolve<UserService>('userService')

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
