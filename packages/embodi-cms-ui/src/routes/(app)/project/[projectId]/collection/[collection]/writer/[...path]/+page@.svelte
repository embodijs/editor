<script lang="ts">
	import MarkdownEditor from '$/lib/comp/collection/MarkdownEditor.svelte';
	import { superForm } from 'sveltekit-superforms';
	import type { PageProps } from './$types';
	import { ObjectField } from '$/lib/comp/collection';
	import { initFileContext } from '$/lib/context/filemanager';
	import type { FileUpload } from '$core/model/article';
	import { writable } from 'svelte/store';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { generateArticleFormSchema } from '$core/logic/article';
	import type { GitRepo } from '$core/model/repo';
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';
	import * as Sidebar from '$lib/comp/ui/sidebar/index.js';
	import { Button, Spinner } from '$/lib/comp/core';
	import { ChevronLeft } from '@lucide/svelte';
	import { resolve } from '$app/paths';

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

	$effect(() => {
		$formData.files = $fileStore;
	});
</script>

<main class="relative">
	<Sidebar.Provider style="--sidebar-width: 27rem; --sidebar-width-mobile: 20rem;">
		<Sidebar.Inset>
			<header class="flex items-center justify-between px-2 py-1">
				<div>
					<Button
						variant="ghost"
						href={resolve('/(app)/project/[projectId]/collection/[collection]', {
							projectId: data.currentProject.id,
							collection: data.collection.name
						})}
					>
						<ChevronLeft />{data.collection.displayName}
					</Button>
				</div>
				<div class="flex items-center">
					<Button
						onclick={async () => {
							form.submit();
						}}
						variant="ghost"
						type="submit"
						disabled={$submitting}
						class="ml-2"
						>{#if $submitting}<Spinner /> Saving...
						{:else}Save{/if}</Button
					>
					<Sidebar.Trigger />
				</div>
			</header>

			<MarkdownEditor {form} />
		</Sidebar.Inset>

		<Sidebar.Root side="right">
			<Sidebar.Content class="mx-3 my-5 space-y-5">
				<form use:enhance method="POST">
					<ObjectField
						fields={data.formFields}
						{form}
						objectPath={['meta']}
						label="Meta data"
						description="Additional information about the article"
						noSeparator
					/>
				</form>
			</Sidebar.Content>
		</Sidebar.Root>
	</Sidebar.Provider>
</main>
