<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { formFieldProxy, type SuperForm, type FormPathLeaves } from 'sveltekit-superforms';
	import Textarea from './Textarea.svelte';
	import type { ComponentProps } from 'svelte';
	import { getFrameContext } from './context';

	let {
		form,
		name,
		...props
	}: { form: SuperForm<T>; name: FormPathLeaves<T> } & Omit<
		ComponentProps<typeof Textarea>,
		'name' | 'form' | 'value'
	> = $props();

	const { value, errors, constraints } = formFieldProxy(form, name);

	const context = getFrameContext();

	$effect(() => {
		if ($errors) {
			context.errors.update((data) => ({
				...data,
				[name]: $errors
			}));
		} else {
			context.errors.update((data) => ({
				...data,
				[name]: []
			}));
		}
	});
</script>

<Textarea
	{name}
	aria-invalid={$errors ? 'true' : undefined}
	bind:value={$value as unknown as string | number | string[] | null | undefined}
	errors={$errors}
	{...$constraints}
	{...props}
/>
