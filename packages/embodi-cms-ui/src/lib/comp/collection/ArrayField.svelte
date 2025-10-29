<script lang="ts" generics="T extends { meta: Record<string, unknown>}">
	import type { ArrayField } from '$core/model/collection';
	import type { SuperForm } from 'sveltekit-superforms';
	import FieldMatcher from './FieldMatcher.svelte';
	import * as Field from '$lib/comp/ui/field/index.js';
	import { getLabel, getPathValue } from './helpers.svelte.js';
	import { generateRandomHash } from '$/lib/helpers/crypto';
	import { Button } from '../core';
	import { Plus } from '@lucide/svelte';
	import { tick } from 'svelte';

	type Props = {
		field: ArrayField;
		form: SuperForm<T>;
		objectPath: (string | number)[];
		noSeparator?: boolean;
	};

	const { field, form, objectPath, noSeparator }: Props = $props();
	const { form: formData } = form;

	let fieldState: { id: string; content: unknown }[] = $state([]);
	((getPathValue($formData, objectPath) as unknown[]) ?? []).forEach((item) => {
		fieldState.push({
			content: item,
			id: generateRandomHash()
		});
	});
	formData.subscribe(console.log);
	const addItem = async () => {
		console.log(objectPath.join('.'));
		await tick();
		fieldState.push({
			content: {},
			id: generateRandomHash()
		});
	};
</script>

<Field.Set>
	<Field.Legend class="w-full">
		<div class="flex items-center justify-between">
			{getLabel(field)}
			<Button variant="ghost" onclick={addItem}><Plus />Add</Button>
		</div>
	</Field.Legend>
	{#each fieldState as item, index (item.id)}
		<FieldMatcher field={field.items} {form} objectPath={[...objectPath, index]} noLabel />
	{/each}
</Field.Set>
{#if !noSeparator}
	<Field.Separator />
{/if}
