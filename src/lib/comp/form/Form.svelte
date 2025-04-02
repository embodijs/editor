<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import type { Snippet } from 'svelte';

	import type { HTMLFormAttributes } from 'svelte/elements';

	import { type SuperForm } from 'sveltekit-superforms';
	let {
		form,
		method = 'POST',
		children,
		...props
	}: { form: SuperForm<T>; children?: Snippet } & HTMLFormAttributes = $props();

	let { enhance } = form;
</script>

<form use:enhance {method} {...props}>
	{@render children?.()}
</form>
