<script lang="ts">
	import MarkdownEditor from '$/lib/comp/collection/MarkdownEditor.svelte';
	import { SiteHeader } from '$/lib/comp/core';
	import { buttonVariants } from '$/lib/comp/ui/button';
	import * as Sheet from '$lib/comp/ui/sheet/index.js';
	import { superForm } from 'sveltekit-superforms';
	import type { PageProps } from './$types';
	import { ObjectField } from '$/lib/comp/collection';
	import { Button } from '$/lib/comp/ui/form';
	import { initFileContext } from '$/lib/context/filemanager';
	import type { FileUpload } from '$core/model/article';
	import { writable } from 'svelte/store';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { generateArticleFormSchema } from '$core/logic/article';
	import type { GitRepo } from '$core/model/repo';
	import { page } from '$app/state';
	import { LoaderCircle } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	const { data }: PageProps = $props();

	const schema = generateArticleFormSchema(data.formFields);
	const form = superForm(data.metaForm, {
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
	const { form: formData, enhance, submitting } = form;
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
			<Button disabled={$submitting} onclick={() => form.submit()}>
				Save{#if $submitting}<LoaderCircle class="animate-spin" />{/if}
			</Button>
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
