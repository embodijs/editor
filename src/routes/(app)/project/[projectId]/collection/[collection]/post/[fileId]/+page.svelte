<script lang="ts">
	import MarkdownEditor from '$/lib/comp/collection/MarkdownEditor.svelte';
	import { SiteHeader } from '$/lib/comp/core';
	import { buttonVariants } from '$/lib/comp/ui/button';
	import * as Sheet from '$lib/comp/ui/sheet/index.js';
	import { superForm } from 'sveltekit-superforms';
	import type { PageProps } from './$types';
	import { MetaForm } from '$/lib/comp/collection';
	import { Button } from '$/lib/comp/ui/form';
	import { initFileContext } from '$/lib/context/filemanager';
	import type { FileUpload } from '$core/model/article';
	import { writable } from 'svelte/store';

	const { data }: PageProps = $props();

	const form = superForm(data.metaForm, {
		dataType: 'json'
	});
	const fileStore = writable<FileUpload[]>([]);
	const { form: formData, enhance } = form;
	$effect(() => {
		$formData.files = $fileStore;
	});
	initFileContext(data.article.path, fileStore);
	formData.subscribe((value) => {
		console.log(value);
	});
</script>

<Sheet.Root>
	<SiteHeader title="Article">
		{#snippet actions()}
			<Button variant="ghost" type="reset">Cancel</Button>
			<Button onclick={() => form.submit()}>Save</Button>
		{/snippet}
	</SiteHeader>
	<main class="relative">
		<header class="m-3 flex justify-end">
			<Sheet.Trigger class={buttonVariants({ variant: 'link' })}>Meta</Sheet.Trigger>
		</header>
		<MarkdownEditor markdown={data.article.content} />
		<form use:enhance method="POST">
			<Sheet.Content>
				<Sheet.Header>
					<Sheet.Title>Meta Data</Sheet.Title>
				</Sheet.Header>
				<div class="mx-3 space-y-5">
					<MetaForm fields={data.formFields} {form}></MetaForm>
				</div>
			</Sheet.Content>
		</form>
	</main>
</Sheet.Root>
