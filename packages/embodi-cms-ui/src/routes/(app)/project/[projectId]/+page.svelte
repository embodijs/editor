<script lang="ts">
	import type { PageProps } from './$types';
	import * as Card from '$/lib/comp/ui/card/index.js';
	import { SiteHeader } from '$/lib/comp/core/index.js';

	let { data }: PageProps = $props();
</script>

<SiteHeader title="Dashboard" />
<main class="m-3 grid grid-cols-2 gap-3">
	<Card.Root>
		<Card.Header>
			<Card.Title>Currnt git repository</Card.Title>
			<Card.Description>Repository data will be read from and write to.</Card.Description>
		</Card.Header>
		<Card.Content class="text-2xl">
			{data.project.owner}/{data.project.repo}
		</Card.Content>
	</Card.Root>
</main>
