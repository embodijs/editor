<script lang="ts">
	import * as Empty from '$lib/comp/ui/empty/index.js';
	import { page } from '$app/state';
</script>

<main class="flex h-screen flex-col items-center justify-center">
	<Empty.Root>
		<Empty.Header>
			<Empty.Title
				>{page.status} - {#if page.error?.type}
					{page.error.type}
				{:else}
					Unknown
				{/if}
			</Empty.Title>
			<Empty.Description>
				{#if page.error?.message}
					{page.error.message}
				{:else}
					The page you're looking for doesn't exist. Try searching for what you need below.
				{/if}
			</Empty.Description>
		</Empty.Header>
		<Empty.Content></Empty.Content>
	</Empty.Root>
</main>
