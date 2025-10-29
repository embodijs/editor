<script>
	import { Plus } from '@lucide/svelte';
	import { Button } from '../core';

	const { children, ...props } = $props();
</script>

<Button variant="ghost" {...props}>
	<Plus />
	{@render children?.()}
</Button>
