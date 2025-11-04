<script lang="ts" generics="T extends Record<string, unknown>">
	import type { FormInputField, ObjectField, ArrayField } from '$core/model/collection';
	import type { SuperForm } from 'sveltekit-superforms';
	import FieldMatcher from './FieldMatcher.svelte';
	import * as Field from '$lib/comp/ui/field/index.js';

	type Props = {
		fields?: FormInputField[];
		definition?: ObjectField | ArrayField;
		label?: string;
		description?: string;
		form: SuperForm<T>;
		objectPath: (string | number)[];
	};

	const { fields, definition, form, objectPath, label, description }: Props = $props();
</script>

<Field.Set class="mx-3 my-5">
	<Field.Legend>{label}</Field.Legend>
	{#if description}
		<Field.Description>{description}</Field.Description>
	{/if}
	{#if definition}
		<FieldMatcher field={definition} {form} {objectPath} />
	{/if}
	{#if fields}
		{#each fields as sub (sub.fieldName)}
			{#if sub.fieldName}
				<FieldMatcher field={sub} {form} objectPath={[...objectPath, sub.fieldName]} />
			{/if}
		{/each}
	{/if}
</Field.Set>
