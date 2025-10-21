<script lang="ts">
	import MarkdownEditor from '$/lib/comp/collection/MarkdownEditor.svelte';
	import { SiteHeader } from '$/lib/comp/core';
	import { buttonVariants } from '$/lib/comp/ui/button';
	import * as Sheet from '$lib/comp/ui/sheet/index.js';
	import { superForm } from 'sveltekit-superforms';
	import type { PageProps } from './$types';
	import { Button } from '$/lib/comp/ui/form';
	import { initFileContext } from '$/lib/context/filemanager';
	import type { FileUpload } from '$core/model/article';
	import { writable } from 'svelte/store';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { generateArticleFormSchema } from '$core/logic/article';
	import { ObjectField } from '$/lib/comp/collection';
	import { page } from '$app/state';
	import type { GitRepo } from '$core/model/repo';

	const { data }: PageProps = $props();

	const schema = generateArticleFormSchema(data.formFields);
	const form = superForm(data.metaForm, {
		dataType: 'json',
		validators: valibotClient(schema)
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

<Sheet.Root>
	<SiteHeader title="Article">
		{#snippet actions()}
			<Button onclick={() => form.submit()}>Save</Button>
		{/snippet}
	</SiteHeader>
	<main class="relative">
		<header class="m-3 flex justify-end">
			<Sheet.Trigger class={buttonVariants({ variant: 'link' })}>Meta</Sheet.Trigger>
		</header>
		<MarkdownEditor {form} />
		<form use:enhance method="POST">
			<Sheet.Content>
				<div class="mx-3 space-y-5">
					<ObjectField
						fields={data.formFields}
						{form}
						objectPath={['meta']}
						label="Meta data"
						description="Additional information about the article"
					/>
				</div>
			</Sheet.Content>
		</form>
	</main>
</Sheet.Root>
