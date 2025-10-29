<script lang="ts" generics="T extends { meta: Record<string, unknown>}">
	import type { MetaInputField } from '$core/model/collection';
	import ObjectField from './ObjectField.svelte';
	import type { FormPath, SuperForm } from 'sveltekit-superforms';
	import * as Form from '$lib/comp/ui/form/index.js';
	import { DatePicker } from '../core';
	import { getLocale } from '$lib/paraglide/runtime.js';
	import * as InputGroup from '$lib/comp/ui/input-group/index.js';
	import {
		isArrayField,
		isBooleanField,
		isDateField,
		isImageField,
		isObjectField
	} from '$core/logic/collection';
	import { getLabel, getPathValue, setPathValue } from './helpers.svelte.js';
	import ArrayField from './ArrayField.svelte';
	import { Switch } from '../ui/switch';
	import ImageField from './ImageField.svelte';

	type Props = {
		field: MetaInputField;
		form: SuperForm<T>;
		objectPath: (string | number)[];
		noLabel?: boolean;
	};

	const { field, form, objectPath, noLabel }: Props = $props();
	const { form: formData } = form;

	let fieldState: unknown = $state(getPathValue($formData, objectPath));
	const name = `${objectPath.join('.')}` as FormPath<T>;
	formData.subscribe(console.log);
	$effect(() => {
		formData.update((data) => setPathValue(data, objectPath, fieldState));
	});
</script>

<Form.Field {form} {name}>
	<Form.Control>
		{#snippet children({ props })}
			{#if isBooleanField(field)}
				<div class="flex items-center justify-between">
					{#if !noLabel}
						<Form.Label>{getLabel(field)}</Form.Label>
					{/if}
					<Switch bind:checked={fieldState as boolean} {...props} />
				</div>
			{:else if isObjectField(field)}
				<ObjectField label={getLabel(field)} {form} fields={field.fields} {objectPath} />
			{:else if isArrayField(field)}
				<ArrayField {form} {field} {objectPath} />
			{:else if isImageField(field)}
				<ImageField {form} {field} {objectPath} />
			{:else}
				<InputGroup.Root>
					{#if !noLabel}
						<InputGroup.Addon align="block-start">
							<Form.Label>{getLabel(field)}</Form.Label>
						</InputGroup.Addon>
					{/if}
					{#if isDateField(field)}
						<DatePicker
							data-slot="input-group-control"
							{...props}
							class="border-input selection:bg-primary selection:text-primary-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex h-9 w-full min-w-0 flex-1 rounded-none border-0 bg-transparent px-3 py-1 text-base shadow-none transition-[color,box-shadow] outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-transparent"
							bind:value={fieldState as Date}
							local={getLocale()}
						/>
					{:else if isImageField(field)}
						<InputGroup.Input {...props} bind:value={fieldState}></InputGroup.Input>
					{:else}
						<InputGroup.Input {...props} bind:value={fieldState as string}></InputGroup.Input>
					{/if}
				</InputGroup.Root>
			{/if}
		{/snippet}
	</Form.Control>
	<Form.FieldErrors />
</Form.Field>
