<script lang="ts">
	import * as InputGroup from '$lib/comp/ui/input-group/index.js';
	import { X } from '@lucide/svelte';
	import { Button } from '$lib/comp/core/index.js';
	import { toast } from 'svelte-sonner';
	import { useId } from 'bits-ui';
	import type { Snippet, ComponentProps } from 'svelte';

	type Props = ComponentProps<typeof InputGroup.Input> & {
		label?: Snippet<[string]>;
		value?: string[];
	};

	let { value = $bindable(), label, ...props }: Props = $props();
	const id = useId();

	const handleInput = (event: KeyboardEvent) => {
		event.stopPropagation();
		if (event.key === 'Enter') {
			event.preventDefault();
			const input = event.target as HTMLInputElement;
			const inputValue = input.value.trim();
			if (inputValue) {
				if (value && value.some((p) => p === inputValue)) {
					toast.error('Value already exists');
					return;
				}
				value = [...(value ?? []), inputValue];
				input.value = '';
			}
		}
	};

	const handleRemove = (index: number) => () => {
		console.log('Removing item at index:', index);
		value = value?.filter((_, i) => i !== index);
	};
</script>

<InputGroup.Root>
	{#if label}
		<InputGroup.Addon align="block-start">{@render label(id)}</InputGroup.Addon>
	{/if}
	<InputGroup.Addon align="block-start" class="flex flex-row flex-wrap items-center gap-1.5">
		{#each value ?? [] as pill, index (pill)}
			<div
				class="bg-primary text-secondary flex flex-row flex-nowrap items-center gap-2 rounded-md px-2 py-1"
			>
				<span class="text-secondary">{pill}</span>
				<Button
					onclick={handleRemove(index)}
					variant="ghost"
					size="icon-sm"
					class="hover:bg-primary/10 h-4 w-4"><X /></Button
				>
			</div>
		{/each}
	</InputGroup.Addon>
	<InputGroup.Input onkeydown={handleInput} {...props} />
</InputGroup.Root>
