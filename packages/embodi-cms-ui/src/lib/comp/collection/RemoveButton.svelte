<script lang="ts">
	import { Button } from '../core/index.js';

	const props = $props();
</script>

<Button
	variant="ghost"
	class="text-primary/40 hover:text-primary ml-auto text-xs"
	size="sm"
	{...props}
>
	Remove
</Button>
