<script lang="ts">
	import MarkdownEditor from '$/lib/comp/collection/MarkdownEditor.svelte';
	import { SiteHeader } from '$/lib/comp/core';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
</script>

<SiteHeader title="Article" />
<main>
	<MarkdownEditor markdown={data.article.content} />
</main>
