<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type CustomProps = {
		children: Snippet;
		transparent?: boolean;
		inline?: boolean;
		error?: boolean;
		danger?: boolean;
	};

	type Props = CustomProps & HTMLButtonAttributes;

	const {
		children,
		transparent = false,
		inline = false,
		error = false,
		danger = false,
		disabled = false,
		...props
	}: Props = $props();
</script>

<button
	disabled={error === true || disabled === true}
	class:button={true}
	class:error
	class:danger
	class:transparent={transparent || inline}
	class:inline
	{...props}
>
	{@render children()}
</button>

<style src="./Button.css">
</style>
