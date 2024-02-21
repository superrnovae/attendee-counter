<script lang="ts">
	import type { MeetingParticipantsProps } from "$lib/types/props";
	import type { Participant } from "$lib/types/zoom";
	import { onMount } from "svelte";

    export let data: MeetingParticipantsProps

    let participants: Participant[] = []

    onMount(async() => {
        participants = (await data.participant_info).participants
    })

    $: nombreParticipants = participants.reduce(
        (accum, curr) => accum + curr.poll_answer, 0
    )

</script>


{#await data.participant_info}
   <p>Loading list of participants...</p>
{:then} 
    <h1>Participants: </h1>

    <div class="flex flex-col">
        <div>
            <strong>Nombre de connexions:</strong> {participants.length} connexions
        </div>
        <div>
            <strong>Nombre de participants: </strong> {nombreParticipants}
        </div>
    </div>

    <table id="participants">
        <thead>
            <th>Nom</th>
            <th>Durée</th>
            <th>Nombre de participants</th>
        </thead>

        <tbody>
            {#each participants as p}
                <tr>
                    <td>{p.name}</td>
                    <td>{Math.floor(p.duration/60)} minutes</td>
                    <td>{p.poll_answer}</td>
                </tr>
            {/each}
        </tbody>
    </table>
{:catch error}
    <p>Failed to load the list of participants...</p>
    <p>{error}</p>
{/await}

<style>

.flex {
    display: flex
}

.flex-col {
    flex-direction: column;
}

table, th, td {
    border: 1px solid;
    border-collapse: collapse;
}

thead th, tbody td {
    padding: 0.4em;
}

table {
    margin: 1em 0;
}

</style>