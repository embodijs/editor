<script lang="ts" generics="T extends Record<string, unknown>">
	import type { ArrayField } from '$core/model/collection';
	import type { SuperForm } from 'sveltekit-superforms';
	import FieldMatcher from './FieldMatcher.svelte';
	import * as Field from '$lib/comp/ui/field/index.js';
	import { getLabel, getPathValue } from './helpers.svelte.js';
	import { generateRandomHash } from '$/lib/helpers/crypto';
	import { Button } from '../core';
	import * as ButtonGroup from '$lib/comp/ui/button-group/index.js';
	import * as Item from '$lib/comp/ui/item/index.js';

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
	<Item.Group>
		{#each fieldState as item, index (item.id)}
			<Item.Title>Set {index + 1}</Item.Title>
			<Item.Actions>
				<ButtonGroup.Root></ButtonGroup.Root>
			</Item.Actions>
			<Item.Content>
				<FieldMatcher field={field.items} {form} objectPath={[...objectPath, index]} noLabel />
			</Item.Content>
		{/each}
	</Item.Group>
</Field.Set>
