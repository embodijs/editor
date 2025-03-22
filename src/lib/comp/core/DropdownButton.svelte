<script lang="ts">
	import type { Snippet, SvelteComponent } from 'svelte';
	import Button from './Button.svelte';

	type Props = {
		children: Snippet;
	} & SvelteComponent<typeof Button>;

	let { children, ...props }: Props = $props();
</script>

<Button tabindex={0} {...props}>
	{@render children()}
</Button>
