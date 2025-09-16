<script lang="ts">
	import type { LayoutProps } from './$types';

	const { children }: LayoutProps = $props();
</script>

<main class="overflow-y-autolg:mx-27 mx-3 flex h-full items-center justify-center md:mx-17">
	<div class="max-h-full w-full py-8">
		{@render children()}
	</div>
</main>

<style lang="postcss">
	@reference 'tailwindcss';

	main :global {
		h1 {
			@apply text-2xl font-bold;
		}
	}
</style>
