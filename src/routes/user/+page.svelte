<script lang="ts">
	import type { UserProps } from '$lib/types/props'
	import { LoginType } from '$lib/types/zoom'

	export let data: UserProps

</script>

{#await data.user}
	Loading user data...
{:then user}
	<div data-testid="user-container">
		<div>User ID: {user.id}</div>
		<div>Email: {user.email}</div>
		<div>Personnal meeting ID: {user.pmi}</div>
		<div>Display Name: {user.display_name}</div>
		<div>First Name: {user.first_name}</div>
		<div>Last Name: {user.last_name}</div>
		<div>
			Personnal meeting url: <a href={user.personal_meeting_url}>{user.personal_meeting_url}</a>
		</div>
		<div>Login Types:</div>

		<ul>
			{#each user.login_types as loginTypes}
				<li class="ml-10">{LoginType[loginTypes]}</li>
			{/each}
		</ul>

		<div>Use PMI: {user.use_pmi}</div>
		<div>Account ID: {user.account_id}</div>
		<div>Account number: {user.account_number}</div>
	</div>
{:catch error}
	<p>Error loading user data: {error.message}</p>
{/await}
