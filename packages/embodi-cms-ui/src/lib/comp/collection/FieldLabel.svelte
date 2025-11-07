<script lang="ts">
	import type { FormInputField } from '$/exports';
	import { Asterisk } from '@lucide/svelte';
	import { Label } from '../ui/form';
	import { getLabel } from './helpers.svelte.js';

	type Props = {
		field: FormInputField;
		props: { 'aria-required'?: 'true' };
	};

	const { field, props }: Props = $props();
</script>

<Label>
	{getLabel(field)}
	{#if props['aria-required']}
		<span title="Required">
			<Asterisk class="h-4 w-4" />
		</span>
	{/if}
</Label>
