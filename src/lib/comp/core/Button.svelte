<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = {
		children: Snippet;
		small?: boolean;
		large?: boolean;
		ghost?: boolean;
		primary?: boolean;
		secondary?: boolean;
		accent?: boolean;
		neutral?: boolean;
		info?: boolean;
		success?: boolean;
		warning?: boolean;
		error?: boolean;
	} & HTMLAttributes<HTMLButtonElement>;

	let {
		children,
		small = false,
		large = false,
		neutral = false,
		primary = true,
		secondary = false,
		accent = false,
		info = false,
		success = false,
		warning = false,
		error = false,
		ghost = false,
		...props
	}: Props = $props();
</script>

<button
	class="btn"
	class:btn-sm={small}
	class:btn-lg={large}
	class:btn-ghost={ghost}
	class:btn-neutral={neutral}
	class:btn-primary={primary}
	class:btn-secondary={secondary}
	class:btn-accent={accent}
	class:btn-info={info}
	class:btn-success={success}
	class:btn-warning={warning}
	class:btn-error={error}
	{...props}
>
	{@render children()}</button
>
