<script lang="ts">
	import type { MetaInputField } from '$core/model/collection';
	import type { SuperForm } from 'sveltekit-superforms';
	import { Input } from '$lib/comp/ui/input/index.js';
	import * as Form from '$lib/comp/ui/form/index.js';
	import { DatePicker } from '../core';
	import { getLocale } from '$lib/paraglide/runtime.js';
	import { Checkbox } from '$lib/comp/ui/checkbox/index.js';

	type Props = {
		fields: MetaInputField[];
		form: SuperForm<Record<string, unknown>>;
	};

	const { fields, form }: Props = $props();
	const { form: formData } = form;
	formData.subscribe(console.log);
</script>

{#each fields as field (field.fieldName)}
	<Form.Field {form} name={field.fieldName}>
		<Form.Control>
			{#snippet children({ props })}
				{#if field.type === 'boolean'}
					<Checkbox
						checked={$formData[field.fieldName] as boolean}
						{...props}
						onCheckedChange={(v) => ($formData[field.fieldName] = v)}
					/>
					<Form.Label>{field.displayName ?? field.fieldName}</Form.Label>
				{:else}
					<Form.Label>{field.displayName ?? field.fieldName}</Form.Label>
					{#if field.type === 'date'}
						<DatePicker
							{...props}
							bind:value={$formData[field.fieldName] as string}
							local={getLocale()}
						/>
					{:else if field.type === 'image'}
						<Input {...props} bind:value={$formData[field.fieldName]}></Input>
					{:else}
						<Input {...props} bind:value={$formData[field.fieldName]}></Input>
					{/if}
				{/if}
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
{/each}
