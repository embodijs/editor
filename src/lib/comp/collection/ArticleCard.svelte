<script lang="ts">
	import * as Card from '$lib/comp/ui/card/index.js';
	import { Button } from '$lib/comp/core';

	type Props = {
		name: string;
		path: string;
	};
	const { name, path }: Props = $props();
</script>

<Card.Root class="@container/card">
	<Card.Header>
		<Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
			{name}
		</Card.Title>
		<Card.Action>
			<Button>Open</Button>
		</Card.Action>
	</Card.Header>
	<Card.Footer class="flex-col items-start gap-1.5 text-sm">
		<div class="text-muted-foreground">{path}</div>
	</Card.Footer>
</Card.Root>
