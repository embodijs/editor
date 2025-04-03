<script lang="ts">
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
</script>

<ul>
	{#each data.files as file (file.path)}
		<li>{file.name}</li>
	{/each}
</ul>
