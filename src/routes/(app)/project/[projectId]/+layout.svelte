<script lang="ts">
	import { ProjectSwitch } from '$/lib/comp/sidebar/index';
	import * as Sidebar from '$lib/comp/ui/sidebar/index.js';
	import type { LayoutProps } from './$types';
	import { LayoutDashboard, SlidersHorizontal, CircleGauge, UsersRound } from '@lucide/svelte';

	const { data, children }: LayoutProps = $props();

	const staticMenu = [
		{ label: 'Dashboard', href: '/', icon: LayoutDashboard },
		{ label: 'Settings', href: '/about', icon: SlidersHorizontal },
		{ label: 'Analytics', href: '/contact', icon: CircleGauge },
		{ label: 'Team', href: '/help', icon: UsersRound }
	] as const;
</script>

<Sidebar.Provider>
	<Sidebar.Root variant="inset">
		<Sidebar.Header>
			<ProjectSwitch projects={data.projects} currentId={data.currentProjectId}></ProjectSwitch>
			<!-- <Sidebar.Menu>
				<Sidebar.MenuItem>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								<Sidebar.MenuButton {...props}>
									Select Workspace
									<ChevronDown class="ml-auto" />
								</Sidebar.MenuButton>
							{/snippet}
						</DropdownMenu.Trigger>
						<DropdownMenu.Content class="w-(--bits-dropdown-menu-anchor-width)">
							<DropdownMenu.Item>
								<span>Acme Inc</span>
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<span>Acme Corp.</span>
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</Sidebar.MenuItem>
			</Sidebar.Menu> -->
		</Sidebar.Header>
		<Sidebar.Content>
			<Sidebar.Group>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each staticMenu as item (item.label)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton>
									{#snippet child({ props })}
										<a href={item.href} {...props}>
											<item.icon />
											<span>{item.label}</span>
										</a>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		</Sidebar.Content>
		<Sidebar.Footer />
	</Sidebar.Root>
	<Sidebar.Inset>
		<main>
			<Sidebar.Trigger />
			{@render children()}
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>
