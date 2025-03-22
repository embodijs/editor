<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	type Props = { children: Snippet; active: boolean; label: string } & HTMLAnchorAttributes;

	let { children, active, label, ...props }: Props = $props();
</script>

<a class:active class="hover:bg-300" {...props}>
	{@render children()}
	<span>{label}</span>
</a>

<style lang="postcss">
	@reference "tailwindcss/theme";

	a {
		@apply grid grid-cols-1 grid-rows-2 items-center justify-center justify-items-center;
		@apply m-1 cursor-pointer rounded-md p-3;
	}

	a:hover,
	a:focus {
		@apply outline-none;
	}

	span {
		@apply text-xs;
	}
</style>
