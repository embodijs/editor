<script lang="ts" generics="T extends { meta: Record<string, unknown>}">
	import { getFileContext } from '$/lib/context/filemanager';
	import type { ImageField } from '$core/model/collection';
	import * as Upload from '$lib/comp/fileUpload/index.js';
	import type { FormPath, SuperForm } from 'sveltekit-superforms';
	import * as Form from '$lib/comp/ui/form/index.js';
	import { getPathValue, setPathValue } from './helpers.svelte.js';

	const fileManager = getFileContext();

	type Props = {
		field: ImageField;
		form: SuperForm<T>;
		objectPath: (string | number)[];
	};

	const { field, form, objectPath }: Props = $props();
	const { form: formData } = form;
	let fieldState: string | undefined = $state(getPathValue($formData, objectPath) as string);
	const name = `${objectPath.join('.')}` as FormPath<T>;

	$effect(() => {
		formData.update((data) => setPathValue(data, objectPath, fieldState));
	});

	const handleOnRemove = async () => {
		if (fieldState) {
			fileManager?.remove(fieldState);
			fieldState = undefined;
		}
	};

	const handleUpload = async (file: File) => {
		fieldState = await fileManager?.set(file);
	};
</script>

<Form.Field {form} {name}>
	<Upload.FileUpload
		onupload={handleUpload}
		value={fieldState}
		optional={field.optional}
		onremove={handleOnRemove}
		accept="image/*"
	>
		{@const image = fieldState ? fileManager?.getFile(fieldState) : undefined}
		{#if image}
			<Upload.ImageReplace>
				{#await image then image}<img src={image} alt="Uploaded" />{/await}
			</Upload.ImageReplace>
		{:else}
			<Upload.Empty />
		{/if}
	</Upload.FileUpload>
</Form.Field>
