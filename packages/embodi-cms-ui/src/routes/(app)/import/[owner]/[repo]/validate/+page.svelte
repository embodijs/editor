<script lang="ts">
	import * as Empty from '$lib/comp/ui/empty/index.js';
	import { Spinner } from '$lib/comp/ui/spinner/index.js';
	import { Button } from '$lib/comp/ui/button/index.js';
	import type { PageProps } from './$types';
	import { page } from '$app/state';
	import { Github, RefreshCcw } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	const { data }: PageProps = $props();
	const redirectIfExists = () => {
		const next = new URL(`/import/${page.params.owner}/${page.params.repo}/config`, page.url);
		goto(next);
	};
	let isLoading = $state(false);
	const validateRepo = async () => {
		isLoading = true;
		const response = await fetch(window.location.href);
		if (response.ok) {
			redirectIfExists();
		} else {
			toast.error('Your configuration still not exists or is not valid');
		}
		isLoading = false;
	};
</script>

{#await data.hasValidConfig}
	<Empty.Root class="w-full">
		<Empty.Header>
			<Empty.Media variant="icon">
				<Spinner class="size-8" />
			</Empty.Media>
			<Empty.Title>Analyzing your repository</Empty.Title>
			<Empty.Description>
				Please wait while we process your date. Do not refresh the page.
			</Empty.Description>
		</Empty.Header>
		<Empty.Content>
			<Button variant="outline" size="sm" href="/import">Cancel</Button>
		</Empty.Content>
	</Empty.Root>
{:then hasValidConfig}
	{#if hasValidConfig}
		{redirectIfExists()}
	{:else}
		<Empty.Root class="w-full">
			<Empty.Header>
				<Empty.Media variant="icon">
					<Github class="size-8" />
				</Empty.Media>
				<Empty.Title>Your repository is not well configurate yet</Empty.Title>
				<Empty.Description>
					In the current Version of embodi cms we could not offer a automatic implementation for
					this. Please add
					<a
						href="https://www.npmjs.com/package/@embodi/vite-astro-cms"
						target="_blank"
						rel="noopener noreferrer"
					>
						<code>@embodi/vite-astro-cms</code>
					</a> to you project. It will generate the config from the collectons.
				</Empty.Description>
			</Empty.Header>
			<Empty.Content>
				<Button disabled={isLoading} size="sm" onclick={validateRepo}
					><RefreshCcw class={isLoading ? 'animate-spin' : ''} />Revalidate</Button
				>
				<Button variant="outline" size="sm" href="/import">Cancel</Button>
			</Empty.Content>
		</Empty.Root>
	{/if}
{/await}
