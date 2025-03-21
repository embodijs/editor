<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		small?: boolean;
		large?: boolean;
		primary?: boolean;
		secondary?: boolean;
		accent?: boolean;
		neutral?: boolean;
		info?: boolean;
		success?: boolean;
		warning?: boolean;
		error?: boolean;
	};

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
		error = false
	}: Props = $props();
</script>

<button
	class="btn"
	class:btn-sm={small}
	class:btn-lg={large}
	class:btn-neutral={neutral}
	class:btn-primary={primary}
	class:btn-secondary={secondary}
	class:btn-accent={accent}
	class:btn-info={info}
	class:btn-success={success}
	class:btn-warning={warning}
	class:btn-error={error}
>
	{@render children()}</button
>
