<script lang="ts">
	import type { PageData } from './$types';

	type Props = { data: PageData };

	let { data }: Props = $props();
	console.log(data);
</script>

{#each data.reposByOwner as { owner, repos } (owner.id)}
	<h2>{owner.name}</h2>
	<ul>
		{#each repos as repo (repo.id)}
			<li>{repo.name}</li>
		{/each}
	</ul>
{/each}
