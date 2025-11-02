<script lang="ts" generics="T extends Record<string, unknown>">
	import type { SuperForm } from 'sveltekit-superforms';
	import { Button, Spinner } from '.';

	type Props = {
		form: SuperForm<T>;
	};

	const { form }: Props = $props();
	const { submitting } = form;
</script>

<Button
	onclick={async () => {
		form.submit();
	}}
	variant="ghost"
	type="submit"
	disabled={$submitting}
	class="ml-2"
>
	{#if $submitting}
		<Spinner /> Saving...
	{:else}
		Save
	{/if}
</Button>
