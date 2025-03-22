<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = {
		src?: string | null;
		name: string;
		alt?: string | null;
		small?: boolean;
		large?: boolean;
	} & HTMLAttributes<HTMLDivElement>;

	let { src, alt, name, small, large, ...props }: Props = $props();

	const defineAlt = (alt: string | undefined | null, name: string) => alt || `Avatar of ${name}`;
	const definePlaceholder = (name: string) => name.charAt(0).toUpperCase();
</script>

<div
	class="avatar"
	class:avatar-placeholder={src == null}
	class:w-8={small && !large}
	class:w-16={!small && !large}
	class:w-24={!small && large}
	{...props}
>
	<div
		class="bg-neutral text-neutral-content mask mask-hexagon"
		class:w-8={small && !large}
		class:w-16={!small && !large}
		class:w-24={!small && large}
	>
		{#if src}
			<img {src} alt={defineAlt(alt, name)} />
		{:else}
			<span class:text-xs={small} class:text-xl={large}>{definePlaceholder(name)}</span>
		{/if}
	</div>
</div>
