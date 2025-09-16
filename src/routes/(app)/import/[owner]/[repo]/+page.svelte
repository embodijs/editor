<script lang="ts">
	import type { PageProps } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import * as Form from '$lib/comp/ui/form/index.js';
	import { Input } from '$lib/comp/ui/input/index.js';
	import { NewProject } from '$core/model/project';
	import { Textarea } from '$/lib/comp/ui/textarea/index.js';
	import * as Alert from '$lib/comp/ui/alert/index.js';

	let { data }: PageProps = $props();
	const form = superForm(data.form, {
		validators: valibotClient(NewProject),
		onUpdate: ({ form: f }) => {
			if (f.valid) {
				toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
			} else {
				toast.error('Please fix the errors in the form.');
			}
		}
	});
	const { form: formData, enhance } = form;
</script>

<div class="mx-auto flex w-92 flex-col gap-3">
	<h1>Setup Project</h1>
	{#if !data.hasPages}
		<Alert.Root variant="default">
			<Alert.Title>GitHub Pages is not activated</Alert.Title>
			<Alert.Description
				>To publish sites we recommand to activate GitHub Pages. If you implmenented an other
				publish feel free to ingnore this.</Alert.Description
			>
		</Alert.Root>
	{/if}

	<form method="POST" class="space-y-5" use:enhance>
		<Form.Field {form} name="name">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Project Name</Form.Label>
					<Input {...props} bind:value={$formData.name} />
				{/snippet}
			</Form.Control>

			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="description">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Project Description</Form.Label>
					<Textarea {...props} bind:value={$formData.description} />
				{/snippet}
			</Form.Control>

			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="url">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Website URL</Form.Label>
					<Input {...props} bind:value={$formData.url} />
				{/snippet}
			</Form.Control>

			<Form.FieldErrors />
		</Form.Field>
		<Form.Button>Submit</Form.Button>
	</form>
</div>
