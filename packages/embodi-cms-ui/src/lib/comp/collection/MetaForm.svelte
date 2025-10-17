<script lang="ts" generics="T extends { meta: Record<string, unknown>}">
	import type { MetaInputField } from '$core/model/collection';
	import { superForm, type SuperForm } from 'sveltekit-superforms';
	import FieldMatcher from './FieldMatcher.svelte';
	import * as Field from '$lib/comp/ui/field/index.js';

	type Props = {
		fields: MetaInputField[];
		form: SuperForm<T>;
		objectPath: string[];
		excludeFirstFromName?: boolean;
	};

	const { fields, form, objectPath, excludeFirstFromName = false }: Props = $props();
	const { form: formData, errors } = form;
	formData.subscribe(console.log);
	errors.subscribe(console.log);
</script>

{#each fields as field (field.fieldName)}
	<FieldMatcher {field} {form} objectPath={[...objectPath, field.fieldName]} />
{/each}
