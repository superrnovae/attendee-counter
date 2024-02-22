<script lang="ts">
	import type { MeetingInstancesProps } from '$lib/types/props';
	import type { MeetingInstance } from '$lib/types/zoom';
	import { onMount } from 'svelte';

	const pageSize: number = 10;

	export let data: MeetingInstancesProps;

	let instances: MeetingInstance[] = [];

	$: pageNumber = 0;
	$: page = instances.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
	$: hasNextPage = page.length >= pageSize;
	$: hasPreviousPage = pageNumber > 0;

	onMount(async () => {
		instances = await data.instances;
	});

	function handleNextPageButtonClick() {
		pageNumber += 1;
	}

	function handlePreviousPageButtonClick() {
		pageNumber -= 1;
	}

	function encodeUUID(uuid: string): string {
		return encodeURIComponent(encodeURIComponent(uuid));
	}

	function getLocalDate(jsonDate: string): string {
		return new Date(jsonDate).toLocaleString('fr-FR');
	}
</script>

{#await data.instances}
	<p>Loading past meeting instances...</p>
{:then}
	<h1>Meetings:</h1>

	<ul>
		{#each page as m}
			{@const encodedUUID = encodeUUID(m.uuid)}
			{@const startTime = getLocalDate(m.start_time)}

			<li class="mb-1">
				<a href="/participants/{encodedUUID}">
					{startTime}
				</a>
			</li>
		{/each}
	</ul>

	<button on:click={handlePreviousPageButtonClick} disabled={!hasPreviousPage}>
		Previous Page
	</button>

	<button on:click={handleNextPageButtonClick} disabled={!hasNextPage}> Next Page </button>
{:catch error}
	<p>Failed to load past meeting instances...</p>
	<code>{error}</code>
{/await}

<style>
	.mb-1 {
		margin-bottom: 1em;
	}
</style>
