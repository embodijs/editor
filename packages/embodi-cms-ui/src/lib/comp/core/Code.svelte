<script lang="ts">
	import type { Snippet } from 'svelte';
	type Props = {
		children: Snippet;
	};

	const { children }: Props = $props();
</script>

<code class="bg-accent text-accent-foreground rounded-md px-2 py-1">{@render children()}</code>
