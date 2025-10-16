<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLLiAttributes } from 'svelte/elements';

	type Props = {
		children: Snippet;
	} & HTMLLiAttributes;

	let { children, ...props }: Props = $props();
</script>

<li {...props}>
	{@render children()}
</li>
