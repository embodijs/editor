<script lang="ts">
	import { Replace } from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	type Props = {
		children: Snippet;
	};
	const { children }: Props = $props();
</script>

<div class="relative overflow-hidden rounded-lg">
	<div class="absolute z-10 hidden h-full w-full group-hover/file:block">
		<div class="grid h-full w-full place-content-center gap-3">
			<span class="bg-accent/30 rounded-full p-3 shadow-lg">
				<Replace />
			</span>
		</div>
	</div>
	<div class="group-hover/file:blur-xs">
		{@render children()}
	</div>
</div>
