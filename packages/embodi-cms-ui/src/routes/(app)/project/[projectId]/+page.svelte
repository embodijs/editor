<script lang="ts">
	import type { PageData } from './$types';
	import { Card, CardActions, CardTitle } from '$/lib/comp/core';
	import { enhance } from '$app/forms';

	type Props = { data: PageData };

	let { data }: Props = $props();
</script>

<main>
	<h1>Dashboard</h1>
</main>
