<script lang="ts" generics="T extends Record<string, unknown>">
	import type { ArrayField } from '$core/model/collection';
	import type { SuperForm } from 'sveltekit-superforms';
	import FieldMatcher from './FieldMatcher.svelte';
	import * as Field from '$lib/comp/ui/field/index.js';
	import { getLabel, getPathValue } from './helpers.svelte.js';
	import { generateRandomHash } from '$/lib/helpers/crypto';
	import { Button } from '../core';
	import { tick } from 'svelte';

	type Props = {
		field: ArrayField;
		form: SuperForm<T>;
		objectPath: (string | number)[];
		noSeparator?: boolean;
	};

	const { field, form, objectPath, noSeparator }: Props = $props();
	const { form: formData } = form;

	let fieldState: { id: string; content: unknown }[] = $derived.by(() =>
		((getPathValue($formData, objectPath) as unknown[]) ?? []).map((item) => {
			return {
				content: item,
				id: generateRandomHash()
			};
		})
	);
	const addItem = async () => {
		await tick();
		fieldState = [
			...fieldState,
			{
				content: {},
				id: generateRandomHash()
			}
		];
	};
</script>

<Field.Set>
	<Field.Legend class="flex w-full items-center justify-between">
		{getLabel(field)}
		<Button variant="ghost" size="sm" class="text-xs" onclick={addItem}>Add</Button>
	</Field.Legend>
	{#each fieldState as item, index (item.id)}
		<FieldMatcher
			field={{ ...field.items, optional: true }}
			{form}
			objectPath={[...objectPath, index]}
			noLabel
		/>
	{/each}
</Field.Set>
{#if !noSeparator}
	<Field.Separator />
{/if}
