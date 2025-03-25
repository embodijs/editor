<script lang="ts">
	import { Button, Card } from '$lib/comp/core';
	import CardTitle from '$lib/comp/core/CardTitle.svelte';
	import type { PageData } from './$types';
	import CardActions from '$lib/comp/core/CardActions.svelte';
	import { enhance } from '$app/forms';

	type Props = { data: PageData };

	let { data }: Props = $props();
</script>

{#each data.reposByOwner as { owner, repos } (owner.id)}
	<h2>{owner.name}</h2>
	{#each repos as repo (repo.id)}
		<Card>
			<CardTitle>{repo.name}</CardTitle>
			<p>{repo.description}</p>
			<CardActions>
				<a class="btn btn-primary" href={`/${repo.fullName}`}>Select</a>
			</CardActions>
		</Card>
	{/each}
{/each}
