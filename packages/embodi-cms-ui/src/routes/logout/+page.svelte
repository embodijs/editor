<script lang="ts">
	import * as Empty from '$lib/comp/ui/empty/index.js';
	import { Button } from '$lib/comp/ui/button/index.js';
	import * as Avatar from '$lib/comp/ui/avatar/index.js';
	import { DoorClosed } from '@lucide/svelte';

	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		invalidateAll();
	});
</script>

<main class="flex h-screen flex-col items-center justify-center">
	<Empty.Root>
		<Empty.Header>
			<Empty.Media variant="default">
				<Avatar.Root class="size-12">
					<DoorClosed />
				</Avatar.Root>
			</Empty.Media>
			<Empty.Title>Goodbye, your are logged out</Empty.Title>
			<Empty.Description>Have a great day! See you soon!</Empty.Description>
		</Empty.Header>
		<Empty.Content>
			<Button size="sm" href="/auth">Back to login</Button>
		</Empty.Content>
	</Empty.Root>
</main>
