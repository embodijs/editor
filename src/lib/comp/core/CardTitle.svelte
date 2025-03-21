<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		h1?: boolean;
		h2?: boolean;
		h3?: boolean;
		h4?: boolean;
	};

	let { children, h1, h2 = true, h3, h4 }: Props = $props();
</script>

{#if h1}
	<h1 class="card-title">
		{@render children()}
	</h1>
{:else if h2}
	<h2 class="card-title">
		{@render children()}
	</h2>
{:else if h3}
	<h3 class="card-title">
		{@render children()}
	</h3>
{:else if h4}
	<h4 class="card-title">
		{@render children()}
	</h4>
{:else}
	<div class="card-title">
		{@render children()}
	</div>
{/if}
