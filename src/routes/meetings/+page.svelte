<script lang="ts">
    import type { UserMeetingsProps } from "$lib/types/props";
	import { MeetingType, type Meeting } from "$lib/types/zoom";

    export let data: UserMeetingsProps

    function getInstanceId(meeting: Meeting) {
        if(meeting.type === MeetingType.RECURRING_MEETING_WITH_NO_FIXED_TIME) 
            return meeting.pmi
        
        return meeting.id
    }
</script>

{#await data.scheduledMeetings}
    <p>Loading scheduled meetings...</p>
{:then scheduledMeetings}
    <h1>Scheduled Meetings</h1>

    <ul>
        {#each scheduledMeetings.meetings as m}
            {@const instanceId = getInstanceId(m)}
            
            <li>
                <h2> {m.topic} </h2>
                <div class="mb-1"> <strong> Id: </strong> {m.id} </div>
                <div class="mb-1"> <strong> Type: </strong> {MeetingType[m.type]} </div>
                <div class="mb-1"> <strong> Durée: </strong> {m.duration} </div>
                
                {#if m.pmi}
                    <div class="mb-1"> <strong> PMI: </strong> {m.pmi} </div>
                {/if}

                <a href="/instances/{instanceId}"><button>View meeting instances</button></a>

            </li>
        {/each}
    </ul>
{:catch error}
    <p>Failed to load the scheduled meetings...</p>
    <code>{error}</code>
{/await}

<style>

    ul {
        list-style-type: none;
        padding: 0;
    }

    ul li {
        padding: 1em;
        border: 1px solid gray;
        border-radius: 1em;
        background-color: white;
        width: 500px;
    }

    .mb-1 {
        margin-bottom: 1em;
    }
</style>