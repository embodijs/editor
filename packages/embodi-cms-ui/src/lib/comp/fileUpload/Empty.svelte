<script>
	import { UploadIcon } from '@lucide/svelte';
</script>

<div class="flex flex-col place-items-center justify-center gap-2">
	<div
		class="border-border text-muted-foreground flex size-14 place-items-center justify-center rounded-full border border-dashed"
	>
		<UploadIcon class="size-7" />
	</div>
	<div class="flex flex-col gap-0.5 text-center">
		<span class="text-muted-foreground font-medium">
			Drag 'n' drop files here, or click to select files
		</span>
	</div>
</div>
