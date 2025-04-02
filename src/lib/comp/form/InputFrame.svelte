<script lang="ts">
	import type { Snippet } from 'svelte';
	import { initFrameContext } from './context';
	import Label from './Label.svelte';
	import InputInfo from './InputInfo.svelte';

	type Props = {
		for?: string;
		label?: string;
		children: Snippet;
		info?: string;
		error?: string;
	};

	const { label, children, info, error, ...props }: Props = $props();

	const context = initFrameContext();

	let errors: string[] = $state(error ? [error] : []);

	$effect(() => {
		if (error) {
			errors = [error];
		} else {
			errors = [];
		}
	});

	context.errors.subscribe((err) => {
		errors = Object.values(err).flat();
	});
</script>

<div class="frame">
	{#if label && props.for}
		<Label for={props.for}>{label}</Label>
	{/if}
	<div class="inputs">
		{@render children()}
	</div>
	<InputInfo error={errors.join(', ')} {info} />
</div>

<style lang="postcss">
	@reference "tailwindcss/theme";
	.frame {
		@apply grid gap-0;
	}

	:global(.dark) {
		.inputs {
			@apply bg-zinc-700;
			@apply border-zinc-700 focus-within:border-teal-600;
		}
	}

	.inputs {
		@apply border-s-5;
		@apply focus-within:border-teal-400;

		@apply flex flex-row flex-nowrap items-center gap-3;
		@apply w-full px-1 py-1;
		@apply border-zinc-100 bg-zinc-100;
		@apply rounded-md;
	}
</style>
