<script lang="ts" generics="T extends { meta: Record<string, unknown>}">
	import type { MetaInputField } from '$core/model/collection';
	import type { SuperForm } from 'sveltekit-superforms';
	import { Input } from '$lib/comp/ui/input/index.js';
	import * as Form from '$lib/comp/ui/form/index.js';
	import { DatePicker } from '../core';
	import { getLocale } from '$lib/paraglide/runtime.js';
	import { Checkbox } from '$lib/comp/ui/checkbox/index.js';

	type Props = {
		fields: MetaInputField[];
		form: SuperForm<T>;
	};

	const { fields, form }: Props = $props();
	const { form: formData } = form;
</script>

{#each fields as field (field.fieldName)}
	{@const displayName = field.displayName ?? field.fieldName}
	<!-- @ts-expect-error - Dynamic meta field names not typed in SuperForm -->
	<Form.Field {form} name="meta.{field.fieldName}">
		<Form.Control>
			{#snippet children({ props })}
				{#if field.type === 'boolean'}
					<Checkbox
						checked={$formData.meta[field.fieldName] as boolean}
						{...props}
						onCheckedChange={(v) => ($formData.meta[field.fieldName] = v)}
					/>
					<Form.Label>{displayName}</Form.Label>
				{:else}
					<Form.Label>{displayName}</Form.Label>
					{#if field.type === 'date'}
						<DatePicker
							{...props}
							bind:value={$formData.meta[field.fieldName] as string}
							local={getLocale()}
						/>
					{:else if field.type === 'image'}
						<Input {...props} bind:value={$formData.meta[field.fieldName]}></Input>
					{:else}
						<Input {...props} bind:value={$formData.meta[field.fieldName]}></Input>
					{/if}
				{/if}
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
{/each}
