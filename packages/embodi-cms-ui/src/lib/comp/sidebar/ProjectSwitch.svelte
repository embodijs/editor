<script lang="ts">
	import { goto } from '$app/navigation';
	import * as DropdownMenu from '$lib/comp/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/comp/ui/sidebar/index.js';
	import { useSidebar } from '$lib/comp/ui/sidebar/index.js';
	import { resolve } from '$app/paths';

	import { ChevronsUpDown, Plus } from '@lucide/svelte';

	type Props = {
		projects: { id: string; name: string; description: string | null | undefined; url: string }[];
		currentId: string;
	};

	let { projects, currentId }: Props = $props();
	const sidebar = useSidebar();
	let activeProject = $state(projects.find((project) => project.id === currentId)!);

	const getFaviconUrl = (url: string | URL) => {
		const { hostname } = new URL(url);
		return `https://icons.duckduckgo.com/ip3/${hostname}.ico`;
	};
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						{...props}
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					>
						<div
							class="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
						>
							{#if activeProject.url}
								<img src={getFaviconUrl(activeProject.url)} alt="Favicon" class="w-full" />
							{/if}
						</div>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-medium">
								{activeProject.name}
							</span>
							<span class="truncate text-xs">{activeProject.description ?? ''}</span>
						</div>
						<ChevronsUpDown class="ml-auto" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
				align="start"
				side={sidebar.isMobile ? 'bottom' : 'right'}
				sideOffset={4}
			>
				<DropdownMenu.Label class="text-muted-foreground text-xs">Teams</DropdownMenu.Label>
				{#each projects as project (project.id)}
					<DropdownMenu.Item onSelect={() => (activeProject = project)} class="gap-2 p-2">
						<div class="flex size-6 items-center justify-center rounded-md border">
							{#if activeProject.url}
								<img src={getFaviconUrl(project.url)} alt="Favicon" class="w-full" />
							{:else}
								<div class="bg-muted size-3.5 shrink-0 rounded-full"></div>
							{/if}
						</div>
						{project.name}
						<!-- <DropdownMenu.Shortcut>⌘{index + 1}</DropdownMenu.Shortcut> -->
					</DropdownMenu.Item>
				{/each}
				<DropdownMenu.Separator />
				<DropdownMenu.Item class="gap-2 p-2" onSelect={() => goto(resolve('/import'))}>
					<div class="flex size-6 items-center justify-center rounded-md border bg-transparent">
						<Plus class="size-4" />
					</div>
					<div class="text-muted-foreground font-medium">Add project</div>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
