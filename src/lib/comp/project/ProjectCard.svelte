<script lang="ts">
	import * as Card from '$lib/comp/ui/card/index.js';
	import type { Snippet, ComponentProps } from 'svelte';

	type Props = {
		title: string;
		description?: string;
		action?: Snippet;
	} & ComponentProps<typeof Card.Root>;

	let { title, description, action, ...props }: Props = $props();
</script>

<Card.Root {...props}>
	<Card.Header>
		<Card.Title>{title}</Card.Title>
		<Card.Description>{description ?? ''}</Card.Description>
		{#if action}
			<Card.Action>
				{@render action?.()}
			</Card.Action>
		{/if}
	</Card.Header>
</Card.Root>
