<script lang="ts">
	import { ArticleCard } from '$/lib/comp/collection';
	import { Button, SiteHeader } from '$/lib/comp/core';
	import { page } from '$app/state';
	import { FilePlus2 } from '@lucide/svelte';
	import type { PageProps } from './$types';
	import { resolve } from '$app/paths';

	let { data }: PageProps = $props();

	const currentCollection = data.collections.find((col) => col.name === data.collectionName);
</script>

<SiteHeader title={currentCollection?.displayName ?? 'Unknown Collection'}>
	{#snippet actions()}
		<Button href="{data.collectionName}/writer">
			<FilePlus2 />
			Add
		</Button>
	{/snippet}
</SiteHeader>
<main>
	<div class="grid grid-cols-1 gap-3 p-3">
		{#each data.articlesMeta as meta (meta.path)}
			<ArticleCard
				name={meta.name}
				path={meta.path}
				opento={resolve(
					`/project/${page.params.projectId}/collection/${page.params.collection}/writer/${meta.path}`
				)}
			/>
		{/each}
	</div>
</main>
