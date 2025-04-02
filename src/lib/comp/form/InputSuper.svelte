<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { formFieldProxy, type SuperForm, type FormPathLeaves } from 'sveltekit-superforms';
	import Input from './Input.svelte';
	import type { ComponentProps } from 'svelte';
	import { getFrameContext } from './context';

	let {
		form,
		name,
		...props
	}: { form: SuperForm<T>; name: FormPathLeaves<T> } & Omit<ComponentProps<typeof Input>, 'name'> =
		$props();

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

<Input
	{name}
	aria-invalid={$errors ? 'true' : undefined}
	bind:value={$value}
	{...$constraints}
	{...props}
/>
