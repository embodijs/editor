<script lang="ts">
	import { ProjectSwitch, User } from '$/lib/comp/sidebar/index';
	import { resolve } from '$app/paths';
	import type { Collection } from '$core/model/collection';
	import * as Sidebar from '$lib/comp/ui/sidebar/index.js';
	import type { LayoutProps } from './$types';
	import { LayoutDashboard } from '@lucide/svelte';

	const { data, children }: LayoutProps = $props();

	const { collections, records } = $derived(
		data.collections.reduce(
			(acc, collection) => {
				const { loader } = collection;
				if (loader.type === 'glob') {
					acc.collections.push(collection);
				} else if (loader.type === 'file') {
					acc.records.push(collection);
				}
				return acc;
			},
			{ collections: [], records: [] } as { collections: Collection[]; records: Collection[] }
		)
	);

	const staticMenu = [
		{ label: 'Dashboard', href: `/project/${data.currentProject.id}`, icon: LayoutDashboard }
		// { label: 'Settings', href: '/about', icon: SlidersHorizontal },
		// { label: 'Team', href: '/help', icon: UsersRound }
	] as const;
</script>

<Sidebar.Provider
	style="--sidebar-width: calc(var(--spacing) * 72); --header-height: calc(var(--spacing) * 12);"
>
	<Sidebar.Root variant="inset">
		<Sidebar.Header>
			<ProjectSwitch projects={data.projects} currentId={data.currentProject.id}></ProjectSwitch>
		</Sidebar.Header>
		<Sidebar.Content>
			<Sidebar.Group>
				<Sidebar.GroupLabel>Collections</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each collections as collection (collection.name)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton>
									{#snippet child({ props })}
										<a
											href={resolve(
												`/project/${data.currentProject.id}/collection/${collection.name}`
											)}
											{...props}
										>
											<span>{collection.displayName}</span>
										</a>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
			<Sidebar.Group>
				<Sidebar.GroupLabel>Records</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each records as dataRecord (dataRecord.name)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton>
									{#snippet child({ props })}
										<a
											href={resolve(
												`/project/${data.currentProject.id}/collection/${dataRecord.name}/open/${dataRecord.loader.path}`
											)}
											{...props}
										>
											<span>{dataRecord.displayName}</span>
										</a>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
			<Sidebar.Separator />
			<Sidebar.Group>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each staticMenu as item (item.label)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton>
									{#snippet child({ props })}
										<a href={resolve(item.href)} {...props}>
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
		<Sidebar.Footer>
			<User user={data.user} />
		</Sidebar.Footer>
	</Sidebar.Root>
	<Sidebar.Inset>
		{@render children()}
	</Sidebar.Inset>
</Sidebar.Provider>
