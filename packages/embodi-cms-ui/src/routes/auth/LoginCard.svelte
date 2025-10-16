<script lang="ts">
	import * as Card from '$lib/comp/ui/card/index.js';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/comp/ui/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	let {
		class: className,
		children,
		privacyPolicyLink,
		termsOfServiceLink,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & {
		children: Snippet;
		privacyPolicyLink: string;
		termsOfServiceLink: string;
	} = $props();
</script>

<div class={cn('flex flex-col gap-6', className)} {...restProps}>
	<Card.Root>
		<Card.Header class="text-center">
			<Card.Title class="text-xl">Welcome back</Card.Title>
			<Card.Description
				>Login in with on of the Git Compatible Service. We will use them to manage your data.</Card.Description
			>
		</Card.Header>
		<Card.Content>
			<div class="grid gap-6">
				<div class="flex flex-col gap-4">
					{@render children()}
				</div>
			</div>
		</Card.Content>
	</Card.Root>
	<div
		class="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4"
	>
		By clicking continue, you agree to our <a href={termsOfServiceLink}>Terms of Service</a>
		and <a href={privacyPolicyLink}>Privacy Policy</a>.
	</div>
</div>
