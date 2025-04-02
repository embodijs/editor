<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		children,
		vertical,
		...props
	}: { children: Snippet; vertical?: boolean } & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div class:vertical {...props}>
	{@render children()}
</div>

<style lang="postcss">
	@reference "tailwindcss/theme";
	div {
		@apply grid items-start justify-normal justify-items-end gap-2;
	}

	div:not(.vertical) {
		@apply auto-cols-max grid-flow-col grid-rows-1;
	}

	div:vertical {
		@apply grid-flow-row auto-rows-auto grid-cols-1;
	}
</style>
