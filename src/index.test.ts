import container from '$lib/providers/container'
import type { IUserService } from '$lib/services/interfaces'
import type { UserService } from '$lib/services/userService'
import { describe, it, expect, beforeEach } from 'vitest'

describe('sum test', () => {
	it('adds 1 + 2 to equal 3', () => {
		expect(1 + 2).toBe(3)
	})
})

describe('userService', () => {
	let userService: IUserService

	beforeEach(async() => {
		userService = container.resolve<UserService>('userService')
	})

	it('Getting the user', async() => {
		const userPromise = userService.getUser()
		expect(userPromise).resolves.not.toThrow()

		expect(userPromise).resolves.toHaveProperty('id')
		expect(userPromise).resolves.toHaveProperty('login_types')
	})

	it('Getting the Zak token', async() => {
		const zakPromise = userService.getZak()
		expect(zakPromise).resolves.not.toThrow()
	})

	it('Getting the user meetings', async() => {
		const meetingsPromise = userService.getUserMeetings("scheduled")
		expect(meetingsPromise).resolves.not.toThrow()
	})
})
