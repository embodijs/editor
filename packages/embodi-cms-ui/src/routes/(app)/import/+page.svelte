<script lang="ts">
	import type { PageData } from './$types';
	import { ProjectCard } from '$/lib/comp/project';
	import { Button } from '$lib/comp/core';
	import { Skeleton } from '$lib/comp/ui/skeleton/index.js';
	import { fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	type Props = { data: PageData };

	let { data }: Props = $props();
</script>

<h1>Your GitHub Repos</h1>
{#await data.reposByOwner}
	<Skeleton class="h-24 w-full" />
{:then reposByOwner}
	{#each reposByOwner as { owner, repos } (owner)}
		<section animate:flip class="mx-auto mt-5 mb-11 flex flex-col gap-3">
			<h2 class="text-xl font-semibold">{owner}</h2>

			<div
				transition:fade
				class="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
			>
				{#each repos as repo (repo.id)}
					<ProjectCard class="w-full" title={repo.name} description={repo.description}>
						{#snippet action()}
							{#if repo.projectId}
								<Button variant="secondary" href="/project/{repo.projectId}">Open</Button>
							{:else}
								<Button href={`/import/${repo.owner}/${repo.name}/validate`}>Import</Button>
							{/if}
						{/snippet}
					</ProjectCard>
				{/each}
			</div>
		</section>
	{/each}
{:catch}
	Something went wrong
{/await}
