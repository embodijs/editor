<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types.js';
	import { enhance } from '$app/forms';
	import { DropdownButton, Dropdown, Avatar, DropdownMenu, DropdownItem } from '$lib/comp/core';

	type Props = {
		data: LayoutData;
		children: Snippet;
	};

	let { data, children }: Props = $props();
</script>

<header class="navbar bg-base-100">
	<div class="flex-1 ps-4">
		<a class="text-lg font-bold">embodi.site</a>
	</div>
	<div class="flex-none">
		<Dropdown end>
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
</header>

{@render children()}
