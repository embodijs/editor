<script lang="ts">
	import { Card, CardTitle } from '$lib/comp/core';
	import { Github } from 'lucide-svelte';
</script>

<main class="flex content-center items-center justify-center">
	<Card>
		<CardTitle h1>Sign in</CardTitle>
		<form method="GET" action="/auth/github">
			<button type="submit" class="btn border-black bg-black text-white"
				><Github /> Login with GitHub
			</button>
		</form>
	</Card>
</main>
