<script lang="ts">
	import type { PageData } from './$types';
	import { ProjectCard } from '$/lib/comp/project';
	import { Button } from '$lib/comp/core';

	type Props = { data: PageData };

	let { data }: Props = $props();
</script>

<h1>Your GitHub Repos</h1>
{#each data.reposByOwner as { owner, repos } (owner.id)}
	<h2>{owner.name}</h2>
	<div class="flex gap-3">
		{#each repos as repo (repo.id)}
			<ProjectCard class="w-full" title={repo.name} description={repo.description}>
				{#snippet action()}
					<Button href="/projects/setup/{repo.id}/{repo.fullName}">Add</Button>
				{/snippet}
			</ProjectCard>
		{/each}
	</div>
{/each}
