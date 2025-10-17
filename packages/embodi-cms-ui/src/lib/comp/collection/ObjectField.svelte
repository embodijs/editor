<script lang="ts" generics="T extends { meta: Record<string, unknown>}">
	import type { MetaInputField } from '$core/model/collection';
	import type { SuperForm } from 'sveltekit-superforms';
	import FieldMatcher from './FieldMatcher.svelte';
	import * as Field from '$lib/comp/ui/field/index.js';

	type Props = {
		fields: MetaInputField[];
		label?: string;
		form: SuperForm<T>;
		objectPath: string[];
		excludeFirstFromName?: boolean;
	};

	const { fields, form, objectPath, excludeFirstFromName = false, label }: Props = $props();
</script>

<Field.Set>
	<Field.Legend>{label}</Field.Legend>
	{#each fields as field (field.fieldName)}
		<FieldMatcher
			{field}
			{form}
			objectPath={[...objectPath, field.fieldName]}
			{excludeFirstFromName}
		/>
	{/each}
</Field.Set>
<Field.Separator />
