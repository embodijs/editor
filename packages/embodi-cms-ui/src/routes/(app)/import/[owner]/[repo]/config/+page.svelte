<script lang="ts">
	import type { PageProps } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import * as Form from '$lib/comp/ui/form/index.js';
	import { NewProject } from '$core/model/project';
	import * as Alert from '$lib/comp/ui/alert/index.js';
	import { Button, Label, Input, Textarea } from '$/lib/comp/core';

	let { data }: PageProps = $props();
	const form = superForm(data.form, {
		validators: valibotClient(NewProject),
		onError: ({ result }) => {
			toast.error(`Something went wrong: <br /> ${result.error.message}`);
		},
		onResult: ({ result }) => {
			if (result.type === 'success') {
				toast.success(`Project created successfully`);
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
		<Input type="hidden" name="owner" value={$formData.owner} />
		<Input type="hidden" name="repo" value={$formData.repo} />
		<div class="flex flex-col gap-1.5">
			<Label for="repo_full">Repo</Label>
			<Input id="repo_full" value="{$formData.owner} / {$formData.repo}" disabled />
		</div>
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
		<div class="flex justify-between">
			<Form.Button>Submit</Form.Button>
			<Button variant="secondary" href="/import">Back</Button>
		</div>
	</form>
</div>
