<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = {
		children: Snippet;
		end?: boolean;
		top?: boolean;
	} & HTMLAttributes<HTMLDivElement>;

	let { children, end = false, top = false, ...props }: Props = $props();
</script>

<div class:dropdown={true} class:dropdown-end={end} class:dropdown-top={top} {...props}>
	{@render children()}
</div>
