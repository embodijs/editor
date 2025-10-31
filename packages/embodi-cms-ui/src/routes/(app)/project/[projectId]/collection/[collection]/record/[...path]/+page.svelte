<script lang="ts">
	import { SaveFormButton, SiteHeader } from '$/lib/comp/core';
	import { superForm } from 'sveltekit-superforms';
	import type { PageProps } from './$types';
	import { initFileContext } from '$/lib/context/filemanager';
	import type { FileUpload } from '$core/model/file';
	import { writable } from 'svelte/store';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { FormBuilder } from '$/lib/comp/collection';
	import { page } from '$app/state';
	import type { GitRepo } from '$core/model/repo';
	import { generateRecordFormSchema } from '$core/logic/file';
	import { toast } from 'svelte-sonner';

	const { data }: PageProps = $props();
	const schema = generateRecordFormSchema(data.formFields);

	const form = superForm(data.recordForm, {
		dataType: 'json',
		validators: valibotClient(schema),
		onError: ({ result }) => {
			toast.error(`Something went wrong: <br /> ${result.error.message}`);
		},
		onUpdate: ({ form }) => {
			if (!form.valid) {
				toast.error('Meta data is invalid.');
			} else {
				toast.success('Saved successfully.');
			}
		}
	});

	const fileStore = writable<FileUpload[]>([]);
	const { form: formData, enhance } = form;

	$effect(() => {
		$formData.files = $fileStore;
	});

	const repo: GitRepo = {
		owner: data.currentProject.owner,
		name: data.currentProject.repo
	};

	initFileContext(
		data.path,
		fileStore,
		repo,

		new URL(`/${repo.owner}/${repo.name}/file/${data.path}/`, page.url.origin)
	);
</script>

<SiteHeader title="Record">
	{#snippet actions()}
		<SaveFormButton {form} />
	{/snippet}
</SiteHeader>

<main class="relative">
	<form use:enhance method="POST" class="mx-auto max-w-3xl">
		<FormBuilder fields={data.formFields} {form} objectPath={['data']} />
	</form>
</main>
