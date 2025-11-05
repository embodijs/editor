<script lang="ts" generics="T extends Record<string, unknown>">
	import type { SchemaDefinition } from '$core/model/collection';
	import type { SuperForm } from 'sveltekit-superforms';
	import FieldMatcher from './FieldMatcher.svelte';

	type Props = {
		definition: SchemaDefinition;
		label?: string;
		form: SuperForm<T>;
		objectPath: (string | number)[];
		class?: string;
	};

	const { definition, form, objectPath, label, ...props }: Props = $props();
	const { enhance } = form;
</script>

<form use:enhance method="post" {...props}>
	<FieldMatcher field={{ displayName: label, ...definition }} {form} {objectPath} />
</form>
