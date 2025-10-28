<script lang="ts" generics="T extends { meta: Record<string, unknown>}">
	import type { MetaInputField } from '$core/model/collection';
	import type { SuperForm } from 'sveltekit-superforms';
	import FieldMatcher from './FieldMatcher.svelte';
	import * as Field from '$lib/comp/ui/field/index.js';

	type Props = {
		fields: MetaInputField[];
		label?: string;
		description?: string;
		form: SuperForm<T>;
		objectPath: (string | number)[];
		noSeparator?: boolean;
	};

	const { fields, form, objectPath, label, description, noSeparator }: Props = $props();
</script>

<Field.Set>
	<Field.Legend>{label}</Field.Legend>
	{#if description}
		<Field.Description>{description}</Field.Description>
	{/if}
	{#each fields as field (field.fieldName)}
		<FieldMatcher {field} {form} objectPath={[...objectPath, field.fieldName]} />
	{/each}
</Field.Set>
{#if !noSeparator}
	<Field.Separator />
{/if}
