<script lang="ts">
	import { Separator } from '$lib/comp/ui/separator/index.js';
	import * as Sidebar from '$lib/comp/ui/sidebar/index.js';
	import type { Snippet } from 'svelte';

	type Props = {
		title: string | Snippet;
		actions?: Snippet;
	};

	const { title, actions }: Props = $props();
</script>

<header
	class="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)"
>
	<div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
		<Sidebar.Trigger class="-ml-1" />
		<Separator orientation="vertical" class="mx-2 data-[orientation=vertical]:h-4" />
		<h1 class="text-base font-medium">
			{#if typeof title === 'string'}{title}{:else}{@render title()}{/if}
		</h1>
		{#if actions}
			<div class="ml-auto flex items-center gap-2">
				{@render actions()}
			</div>
		{/if}
	</div>
</header>
