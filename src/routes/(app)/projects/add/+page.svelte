<script lang="ts">
	import type { PageData } from './$types';
	import { Card, CardActions, CardTitle } from '$/lib/comp/core';

	type Props = { data: PageData };

	let { data }: Props = $props();
</script>

<h1>Your GitHub Repos</h1>
{#each data.reposByOwner as { owner, repos } (owner.id)}
	<h2>{owner.name}</h2>
	{#each repos as repo (repo.id)}
		<Card>
			<CardTitle>{repo.name}</CardTitle>
			<p>{repo.description}</p>
			<CardActions>
				<a class="btn btn-primary" href={`/projects/setup/${repo.id}/${repo.fullName}`}>Add</a>
			</CardActions>
		</Card>
	{/each}
{/each}
