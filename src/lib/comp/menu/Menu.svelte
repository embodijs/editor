<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = { children: Snippet } & HTMLAttributes<HTMLElement>;

	let { children, ...props }: Props = $props();
</script>

<nav {...props}>
	{@render children()}
</nav>

<style lang="postcss">
	@reference "tailwindcss";

	nav {
		@apply bg-base-200;
	}
</style>
