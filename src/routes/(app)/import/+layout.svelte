<script lang="ts">
	import type { LayoutProps } from './$types';

	const { children }: LayoutProps = $props();
</script>

<main class="overflow-y-autolg:mx-27 mx-3 flex h-full items-center justify-center md:mx-17">
	<div class="max-h-full w-full py-8">
		{@render children()}
	</div>
</main>
