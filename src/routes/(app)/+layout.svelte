<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types.js';
	import { enhance } from '$app/forms';
	import { DropdownButton, Dropdown, Avatar, DropdownMenu, DropdownItem } from '$lib/comp/core';
	import { Ellipsis, Home, SquarePen } from 'lucide-svelte';
	import { Menu, MenuItem } from '$lib/comp/menu/index.js';

	type Props = {
		data: LayoutData;
		children: Snippet;
	};

	let { data, children }: Props = $props();
</script>

<div class="drawer lg:drawer-open">
	<input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content">
		<!-- Page content here -->
		{@render children()}
	</div>
	<div class="drawer-side">
		<label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label>
		<div class="grid h-full grid-rows-[auto_1fr_auto]">
			<div class="flex-1 ps-4">
				<a href="/" class="text-lg font-bold">embodi.site</a>
			</div>
			<div>
				<ul class="menu bg-base-100 rounded-box w-56">
					<li><a href="/projects">Switch Project</a></li>
					<li><a href="/"><Home />Dashboard</a></li>
					<li><a href="/pages"><SquarePen />Pages</a></li>
				</ul>
			</div>
			<div>
				<Dropdown top>
					<Avatar
						tabindex={0}
						src={data.user.avatar}
						class="btn btn-ghost btn-rounded"
						role="button"
						alt="User dropdown menu"
						name={data.user.name}
					/>
					<DropdownMenu>
						<DropdownItem>
							<form method="POST" class="contents" action="/?/signout" use:enhance>
								<button type="submit" class="w-full cursor-pointer">Sign out</button>
							</form>
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</div>
		</div>
	</div>
</div>
