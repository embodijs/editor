<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = {
		children: Snippet;
		end?: boolean;
	} & HTMLAttributes<HTMLDivElement>;

	let { children, end = false, ...props }: Props = $props();
</script>

<div class:dropdown={true} class:dropdown-end={end} {...props}>
	{@render children()}
</div>
