<script>
	import { Replace } from '@lucide/svelte';
	const { children } = $props();
</script>

<div class="relative overflow-hidden rounded-lg">
	<div class="absolute z-10 hidden h-full w-full group-hover:block">
		<div class="grid h-full w-full place-content-center">
			<span class="bg-accent/30 rounded-full p-3 shadow-lg">
				<Replace />
			</span>
		</div>
	</div>
	<div class="group-hover:blur-xs">
		{@render children()}
	</div>
</div>
