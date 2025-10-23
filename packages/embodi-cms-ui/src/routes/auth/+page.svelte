<script lang="ts">
	import { Button } from '$lib/comp/ui/button/index.js';
	import { Github, GalleryVerticalEnd } from '@lucide/svelte';

	import LoginCard from './LoginCard.svelte';
</script>

<main class="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
	<div class="flex w-full max-w-sm flex-col gap-6">
		<a href="##" class="flex items-center gap-2 self-center font-medium">
			<div
				class="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md"
			>
				<GalleryVerticalEnd class="size-4" />
			</div>
			Embodi
		</a>
		<LoginCard
			privacyPolicyLink="/legal/privacy-policy"
			termsOfServiceLink="/legal/terms-of-service"
		>
			<form method="GET" action="/auth/github">
				<Button variant="outline" type="submit" class="w-full">
					<Github />
					Login with Github
				</Button>
			</form>
		</LoginCard>
	</div>
</main>
