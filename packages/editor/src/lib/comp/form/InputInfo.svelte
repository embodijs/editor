<script lang="ts">
	let { error, info } = $props();
</script>

{#if error}
	<small>{error}</small>
{:else if info}
	<small>{info}</small>
{:else}
	<small>&nbsp;</small>
{/if}

<style lang="postcss">
	@reference "tailwindcss/theme";
	small {
		@apply ml-1 text-sm text-zinc-600;
	}

	:global(.dark) {
		small {
			@apply text-zinc-400;
		}
	}
</style>
