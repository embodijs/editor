<script lang="ts" generics="T extends { meta: Record<string, unknown>}">
	import type { ArrayField } from '$core/model/collection';
	import type { FormPath, SuperForm } from 'sveltekit-superforms';
	import FieldMatcher from './FieldMatcher.svelte';
	import * as Field from '$lib/comp/ui/field/index.js';
	import { getLabel, getPathValue, setPathValue } from './helpers.svelte.js';
	import { generateRandomHash } from '$/lib/helpers/crypto';

	type Props = {
		field: ArrayField;
		form: SuperForm<T>;
		objectPath: string[];
	};

	const { field, form, objectPath }: Props = $props();
	const { form: formData } = form;

	let fieldState: { id: string; content: unknown }[] = $state([]);
	(getPathValue($formData, objectPath) as unknown[]).forEach((item) => {
		fieldState.push({
			content: item,
			id: generateRandomHash()
		});
	});
</script>

<Field.Set>
	<Field.Legend>{getLabel(field)}</Field.Legend>
	{#each fieldState as item, index (item.id)}
		<FieldMatcher field={field.items} {form} objectPath={[...objectPath, index]} noLabel />
	{/each}
</Field.Set>
<Field.Separator />
