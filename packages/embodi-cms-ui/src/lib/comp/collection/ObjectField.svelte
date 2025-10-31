<script lang="ts" generics="T extends Record<string, unknown>">
	import type { ObjectField } from '$core/model/collection';
	import type { SuperForm } from 'sveltekit-superforms';
	import FieldMatcher from './FieldMatcher.svelte';
	import * as Field from '$lib/comp/ui/field/index.js';
	import { getLabel, getPathValue, hasPathValue, setPathValue } from './helpers.svelte';
	import RemoveButton from './RemoveButton.svelte';
	import AddButton from './AddButton.svelte';
	import { Button } from '../core';

	type Props = {
		field: ObjectField;
		form: SuperForm<T>;
		objectPath: (string | number)[];
	};

	const { field, form, objectPath }: Props = $props();
	const { form: formData } = form;
	let show = $derived(!field.optional || hasPathValue($formData, objectPath));

	let safe = $state({});

	const addElement = () => {
		$formData = setPathValue($formData, objectPath, safe);
	};

	const removeElement = () => {
		safe = getPathValue($formData, objectPath) as Record<string, unknown>;
		$formData = setPathValue($formData, objectPath, undefined);
	};
</script>

<Field.Set>
	<Field.Legend class="flex w-full items-center justify-between">
		{getLabel(field)}
		{#if !show}
			<Button size="sm" variant="ghost" class="ml-auto text-xs" onclick={addElement}>Add</Button>
		{:else if field.optional}
			<RemoveButton onclick={removeElement} />
		{/if}
	</Field.Legend>
	{#if show}
		{#each field.fields as sub (sub.fieldName)}
			<FieldMatcher field={sub} {form} objectPath={[...objectPath, sub.fieldName]} />
		{/each}
	{/if}
</Field.Set>
<Field.Separator />
