<script lang="ts" generics="T extends Record<string, unknown>">
	import type { FormInputField } from '$core/model/collection';
	import type { SuperForm } from 'sveltekit-superforms';
	import FieldMatcher from './FieldMatcher.svelte';
	import * as Field from '$lib/comp/ui/field/index.js';

	type Props = {
		fields: FormInputField[];
		label?: string;
		description?: string;
		form: SuperForm<T>;
		objectPath: (string | number)[];
	};

	const { fields, form, objectPath, label, description }: Props = $props();
</script>

<Field.Set class="mx-3 my-5">
	<Field.Legend>{label}</Field.Legend>
	{#if description}
		<Field.Description>{description}</Field.Description>
	{/if}
	{#each fields as sub (sub.fieldName)}
		<FieldMatcher field={sub} {form} objectPath={[...objectPath, sub.fieldName]} />
	{/each}
</Field.Set>
