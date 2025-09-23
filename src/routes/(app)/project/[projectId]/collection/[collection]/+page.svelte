<script lang="ts">
	import { ArticleCard } from '$/lib/comp/collection';
	import { SiteHeader } from '$/lib/comp/core';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const currentCollection = data.collections.find((col) => col.name === data.collectionName);
</script>

<SiteHeader title={currentCollection?.displayName ?? 'Unknown Collection'} />
<main>
	{#each data.articlesMeta as meta (meta.path)}
		<ArticleCard name={meta.name} path={meta.path} />
	{/each}
</main>
