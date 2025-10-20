<script lang="ts">
	import * as Avatar from '$lib/comp/ui/avatar/index.js';
	import * as DropdownMenu from '$lib/comp/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/comp/ui/sidebar/index.js';
	import { EllipsisVertical, LogOut } from '@lucide/svelte';
	import ModeSwitcher from './ModeSwitcher.svelte';
	import { Button } from '../core';
	let { user }: { user: { name: string; email: string; avatar?: string | null } } = $props();
	const sidebar = Sidebar.useSidebar();

	const logout = () => {
		console.log('logout');
	};

	const userInitials = (name: string) =>
		name
			.split(' ')
			.map((word) => word.charAt(0))
			.join('');

	let logoutFormRef: HTMLFormElement | null = null;
</script>

<form bind:this={logoutFormRef} method="POST" action="/logout"></form>

<Sidebar.Menu>
	<Sidebar.MenuItem class="flex items-center gap-3">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						{...props}
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					>
						<Avatar.Root class="size-8 rounded-lg grayscale">
							<Avatar.Image src={user.avatar} alt={user.name} />
							<Avatar.Fallback class="rounded-lg">{userInitials(user.name)}</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-medium">{user.name}</span>
							<span class="text-muted-foreground truncate text-xs">
								{user.email}
							</span>
						</div>
						<EllipsisVertical />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
				side={sidebar.isMobile ? 'bottom' : 'right'}
				align="end"
				sideOffset={4}
			>
				<DropdownMenu.Label class="p-0 font-normal">
					<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
						<Avatar.Root class="size-8 rounded-lg">
							<Avatar.Image src={user.avatar} alt={user.name} />
							<Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-medium">{user.name}</span>
							<span class="text-muted-foreground truncate text-xs">
								{user.email}
							</span>
						</div>
					</div>
				</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<!-- <DropdownMenu.Group>
					<DropdownMenu.Item>
						<UserCircleIcon />
						Account
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<CreditCardIcon />
						Billing
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator /> -->

				<DropdownMenu.Item onclick={() => logoutFormRef?.submit()}>
					<LogOut />
					Log out
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
		<ModeSwitcher />
	</Sidebar.MenuItem>
</Sidebar.Menu>
