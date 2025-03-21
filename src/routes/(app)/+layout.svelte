<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from '../$types.js';
	import { enhance } from '$app/forms';

	type Props = {
		data: LayoutData;
		children: Snippet;
	};

	let { data, children }: Props = $props();
</script>

<form method="POST" action="/?signout" use:enhance>
	<button>Sign out</button>
</form>

{@render children()}
