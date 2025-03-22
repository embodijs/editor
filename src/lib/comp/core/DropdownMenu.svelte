<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = {
		children: Snippet;
	} & HTMLAttributes<HTMLUListElement>;

	let { children, end = false, ...props }: Props = $props();
</script>

<ul
	{...props}
	tabindex="0"
	class="menu dropdown-content bg-base-100 rounded-box z-1 mt-1 w-52 p-2 shadow {props.class}"
>
	{@render children()}
</ul>
