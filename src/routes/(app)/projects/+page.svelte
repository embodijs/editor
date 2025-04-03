<script lang="ts">
	import type { PageData } from './$types';
	import { Card, CardActions, CardTitle } from '$/lib/comp/core';
	import { enhance } from '$app/forms';

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
			<form action="?/open" method="POST" use:enhance>
				<input type="hidden" name="owner" value={project.owner} />
				<input type="hidden" name="repo" value={project.repo} />
				<button class="btn btn-primary">Open</button>
			</form></CardActions
		>
	</Card>
{/each}
