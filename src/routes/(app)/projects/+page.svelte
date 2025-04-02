<script lang="ts">
	import type { PageData } from './$types';
	import { Card, CardActions, CardTitle } from '$/lib/comp/core';

	type Props = { data: PageData };

	let { data }: Props = $props();
</script>

<h1>Projects</h1>
<a class="btn btn-primary" href="/projects/add">Add</a>
{#each data.projects as project (project.id)}
	<Card>
		<CardTitle>{project.name}</CardTitle>
		<p>{project.description}</p>
		<CardActions>
			<a class="btn btn-primary" href={`/${project.owner}/${project.repo}`}>Open</a>
		</CardActions>
	</Card>
{/each}
