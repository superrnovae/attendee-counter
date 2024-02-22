import { ZOOM_REST_URL } from '$env/static/private';
import type { Redis } from 'ioredis';
import {
	Participant,
	type MeetingInstancesInfo,
	type ParticipantsInfo,
	type PollResult,
	type MeetingInstance
} from '$lib/types/zoom';
import config from '$lib/data/config.json';
import type { IMeetingService } from './interfaces';
import { getParticipantsKey } from '$lib/providers/redis';
import { CommonFunctionality } from './common';

export class MeetingService implements IMeetingService {
	private readonly redisClient: Redis;
	private readonly common: CommonFunctionality;

	constructor(redisClient: Redis) {
		this.redisClient = redisClient;
		this.common = new CommonFunctionality(redisClient);
	}

	public async getPastMeetingInstances(meetingId: number): Promise<MeetingInstance[]> {
		const url = new URL(`${ZOOM_REST_URL}/past_meetings/${meetingId}/instances`);
		const info = await this.common.fetchAndMaybeThrow<MeetingInstancesInfo>(url);

		info.meetings.sort(this.sortMeetingsByDate);

		return info.meetings;
	}

	public async getPastMeetingParticipants(uuid: string): Promise<Participant[]> {
		const key = getParticipantsKey(uuid);
		const cached = await this.common.getFromCache<Participant[]>(key);

		if (cached) {
			return cached;
		}

		const participants = await this.fetchPastMeetingParticipants(uuid);
		await this.cacheMeetingParticipants(uuid, participants);

		return participants;
	}

	public async getPastMeetingPollResults(uuid: string): Promise<PollResult> {
		const url = new URL(`${ZOOM_REST_URL}/past_meetings/${uuid}/polls`);
		const polls = await this.common.fetchAndMaybeThrow<PollResult>(url);

		return polls;
	}

	private async fetchPastMeetingParticipants(uuid: string): Promise<Participant[]> {
		const url = new URL(`${ZOOM_REST_URL}/past_meetings/${uuid}/participants?page_size=300`);

		const page = await this.common.fetchAndMaybeThrow<ParticipantsInfo>(url);

		while (page.next_page_token !== '') {
			const searchParams = new URLSearchParams(url.search);
			searchParams.set('next_page_token', page.next_page_token);
			url.search = searchParams.toString();

			const next_page = await this.common.fetchAndMaybeThrow<ParticipantsInfo>(url);
			page.participants = page.participants.concat(next_page.participants);
		}

		page.participants = this.filterParticipants(page.participants);

		const pollResults = await this.getPastMeetingPollResults(uuid);

		this.applyPollResultToEachParticipant(page.participants, pollResults);

		return page.participants;
	}

	private filterParticipants(participants: Participant[]): Participant[] {
		const map = new Map<string, Participant>();

		participants.forEach((p) => {
			if (
				p.status === 'in_waiting_room' ||
				config.ignored_participants.includes(p.name) ||
				p.duration < 600
			)
				return;

			const existingObj = map.get(p.name);

			if (!existingObj || p.duration > existingObj.duration) {
				map.set(p.name, p);
			}
		});

		const ret = Array.from(map.values()).sort(Participant.compare);

		return ret;
	}

	private async cacheMeetingParticipants(uuid: string, participants: Participant[]): Promise<void> {
		const key = getParticipantsKey(uuid);
		this.redisClient.set(key, JSON.stringify(participants));
	}

	private sortMeetingsByDate(a: MeetingInstance, b: MeetingInstance): number {
		return new Date(b.start_time).getTime() - new Date(a.start_time).getTime();
	}

	private applyPollResultToEachParticipant(
		participants: Participant[],
		pollResult: PollResult
	): void {
		participants.forEach((p) => {
			const userAnswers = pollResult.questions.findIndex((q) => q.name === p.name);

			if (userAnswers !== -1) {
				p.poll_answer = parseInt(pollResult.questions[userAnswers].question_details[0].answer);
			} else {
				p.poll_answer = 1;
			}
		});
	}
}
