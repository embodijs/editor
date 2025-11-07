<script lang="ts" generics="T extends Record<string, unknown>">
	import type { FormInputField } from '$core/model/collection';
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
	import TagInput from '../core/TagInput.svelte';
	import FieldLabel from './FieldLabel.svelte';

	type Props = {
		field: FormInputField;
		form: SuperForm<T>;
		objectPath: (string | number)[];
		class?: string;
	};

	const { field, form, objectPath, ...fieldProps }: Props = $props();

	const { form: formData } = form;

	const name = `${objectPath.join('.')}` as FormPath<T>;

	const updateFormValue = (value: unknown, objectPath: Props['objectPath']) => {
		if (String(value).trim() === '') {
			formData.update((data) => setPathValue(data, objectPath, undefined));
		} else {
			formData.update((data) => setPathValue(data, objectPath, value));
		}
	};
</script>

<Form.Field {form} {name}>
	<Form.Control>
		{#snippet children({ props })}
			{#if isBooleanField(field)}
				<div class="flex items-center justify-between">
					<Form.Label>{getLabel(field)}</Form.Label>
					<Switch
						bind:checked={
							() => (getPathValue($formData, objectPath) as boolean) ?? field.default ?? false,
							(v) => updateFormValue(v, objectPath)
						}
						{...props}
					/>
				</div>
			{:else if isObjectField(field)}
				<ObjectField {form} {field} {objectPath} {...fieldProps} />
			{:else if isArrayField(field)}
				{#if field.items.type === 'string' || field.items.type === 'number'}
					<TagInput
						placeholder="Add..."
						bind:value={
							() => (getPathValue($formData, objectPath) as string[]) ?? field.default,
							(v) => updateFormValue(v, objectPath)
						}
						{...props}
					>
						{#snippet label()}
							<FieldLabel {field} {props} />
						{/snippet}
					</TagInput>
				{:else}
					<ArrayField {form} {field} {objectPath} />
				{/if}
			{:else if isImageField(field)}
				<ImageField {form} {field} {objectPath} />
			{:else}
				<InputGroup.Root>
					<InputGroup.Addon align="block-start">
						<FieldLabel {field} {props} />
					</InputGroup.Addon>

					{#if isDateField(field)}
						<DatePicker
							data-slot="input-group-control"
							{...props}
							class="border-input selection:bg-primary selection:text-primary-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex h-9 w-full min-w-0 flex-1 rounded-none border-0 bg-transparent px-3 py-1 text-base shadow-none transition-[color,box-shadow] outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-transparent"
							bind:value={
								() => (getPathValue($formData, objectPath) as string) ?? field.default,
								(v) => updateFormValue(v, objectPath)
							}
							local={getLocale()}
						/>
					{:else}
						<InputGroup.Input
							{...props}
							data-lpignore="true"
							bind:value={
								() => getPathValue($formData, objectPath) ?? field.default,
								(v) => updateFormValue(v, objectPath)
							}
						></InputGroup.Input>
					{/if}
				</InputGroup.Root>
			{/if}
		{/snippet}
	</Form.Control>
	<Form.FieldErrors />
</Form.Field>
