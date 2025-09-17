<script lang="ts">
	import type { PageData } from './$types';
	import { ProjectCard } from '$/lib/comp/project';
	import { Button } from '$lib/comp/core';

	type Props = { data: PageData };

	let { data }: Props = $props();
</script>

<h1>Your GitHub Repos</h1>
{#each data.reposByOwner as { owner, repos } (owner.id)}
	<section class="flex flex-col gap-3">
		<h2 class="text-xl font-semibold">{owner.name}</h2>
		<div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
			{#each repos as repo (repo.id)}
				<ProjectCard class="w-full" title={repo.name} description={repo.description}>
					{#snippet action()}
						{#if repo.projectId}
							<Button variant="secondary" href="/project/{repo.projectId}">Open</Button>
						{:else}
							<Button href={`/import/${repo.owner}/${repo.name}`}>Import</Button>
						{/if}
					{/snippet}
				</ProjectCard>
			{/each}
		</div>
	</section>
{/each}
