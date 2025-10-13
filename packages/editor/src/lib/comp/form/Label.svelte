<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLLabelAttributes } from 'svelte/elements';

	let { children, ...props }: { children: Snippet } & HTMLLabelAttributes = $props();
</script>

<label {...props}>{@render children()}</label>

<style lang="postcss">
	@reference "tailwindcss/theme";

	label {
		@apply ml-1 text-sm text-zinc-600;
	}

	:global(.dark) {
		label {
			@apply text-zinc-400;
		}
	}
</style>
