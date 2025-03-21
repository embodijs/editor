<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = {
		children: Snippet;
		image?: Snippet;
	} & HTMLAttributes<HTMLElement>;

	let { children, image, ...props }: Props = $props();
</script>

<div {...props} class:card={true} class:bg-base-100={true} class:shadow-sm={true}>
	{@render image?.()}
	<div class="card-body">
		{@render children()}
	</div>
</div>
