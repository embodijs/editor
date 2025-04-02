<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = {
		size?: 'sm' | 'md' | 'lg';
		label?: string;
	} & Omit<HTMLInputAttributes, 'size'>;

	let { size = 'md', label, checked = $bindable(false), onchange, ...props }: Props = $props();
</script>

<label
	class:size-sm={size === 'sm'}
	class:size-md={size === 'md'}
	class:size-lg={size === 'lg'}
	class="inline-flex cursor-pointer items-center"
>
	<input type="checkbox" value="t" class="peer sr-only" bind:checked {onchange} {...props} />
	<div class="peer"></div>
	{#if label}
		<span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{label}</span>
	{/if}
</label>

<style lang="postcss">
	@reference "tailwindcss/theme";

	div {
		@apply relative rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 peer-focus:outline-none after:absolute after:border-gray-300 after:bg-white dark:border-gray-600 dark:bg-gray-700 dark:peer-checked:bg-blue-600 dark:peer-focus:ring-blue-800;
	}

	.size-sm {
		@apply mb-5;
		div {
			@apply h-5 w-9 after:start-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full;
		}
	}
	.size-md {
		@apply mb-5;

		div {
			@apply h-6 w-11 after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full;
		}
	}
	.size-lg div {
		@apply h-7 w-14 after:start-[4px] after:top-0.5 after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full;
	}
</style>
