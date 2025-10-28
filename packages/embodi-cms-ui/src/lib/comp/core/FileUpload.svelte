<script lang="ts">
	import UploadIcon from '@lucide/svelte/icons/upload';
	import { useId } from 'bits-ui';
	import type { WithChildren } from 'bits-ui';
	import type { HTMLInputAttributes } from 'svelte/elements';

	type FileRejectedReason =
		| 'Maximum file size exceeded'
		| 'File type not allowed'
		| 'Maximum files uploaded';

	type FileDropZonePropsWithoutHTML = WithChildren<{
		ref?: HTMLInputElement | null;
		onupload: (file: File) => Promise<void> | void;
		/** Called when a file does not meet the upload criteria (size, or type) */
		onFileRejected?: (opts: { reason: FileRejectedReason; file: File }) => void;

		// just for extra documentation
		/** Takes a comma separated list of one or more file types.
		 *
		 *  [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept)
		 *
		 * ### Usage
		 * ```svelte
		 * <FileDropZone
		 * 		accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
		 * />
		 * ```
		 *
		 * ### Common Values
		 * ```svelte
		 * <FileDropZone accept="audio/*"/>
		 * <FileDropZone accept="image/*"/>
		 * <FileDropZone accept="video/*"/>
		 * ```
		 */
		accept?: string;
	}>;

	type FileDropZoneProps = FileDropZonePropsWithoutHTML &
		Omit<HTMLInputAttributes, 'multiple' | 'files'>;

	let {
		id = useId(),
		children,
		disabled = false,
		onupload: onUpload,
		onFileRejected,
		accept,
		...rest
	}: FileDropZoneProps = $props();

	let uploading = $state(false);

	const drop = async (
		e: DragEvent & {
			currentTarget: EventTarget & HTMLLabelElement;
		}
	) => {
		if (disabled) return;

		e.preventDefault();

		const droppedFiles = Array.from(e.dataTransfer?.files ?? []);

		await upload(droppedFiles[0]);
	};

	const change = async (
		e: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) => {
		if (disabled) return;

		const selectedFiles = e.currentTarget.files;

		if (!selectedFiles) return;

		await upload(selectedFiles[0]);

		// this if a file fails and we upload the same file again we still get feedback
		(e.target as HTMLInputElement).value = '';
	};

	const shouldAcceptFile = (file: File): FileRejectedReason | undefined => {
		if (!accept) return undefined;

		const acceptedTypes = accept.split(',').map((a) => a.trim().toLowerCase());
		const fileType = file.type.toLowerCase();
		const fileName = file.name.toLowerCase();

		const isAcceptable = acceptedTypes.some((pattern) => {
			// check extension like .mp4
			if (fileType.startsWith('.')) {
				return fileName.endsWith(pattern);
			}

			// if pattern has wild card like video/*
			if (pattern.endsWith('/*')) {
				const baseType = pattern.slice(0, pattern.indexOf('/*'));
				return fileType.startsWith(baseType + '/');
			}

			// otherwise it must be a specific type like video/mp4
			return fileType === pattern;
		});

		if (!isAcceptable) return 'File type not allowed';

		return undefined;
	};

	const upload = async (file: File) => {
		uploading = true;

		const rejectedReason = shouldAcceptFile(file);

		if (rejectedReason) {
			onFileRejected?.({ file, reason: rejectedReason });
		}

		await onUpload(file);

		uploading = false;
	};
</script>

<label
	ondragover={(e) => e.preventDefault()}
	ondrop={drop}
	for={id}
	aria-disabled={uploading}
	class="border-border hover:bg-accent/25 flex h-48 w-full place-items-center justify-center rounded-lg border-2 border-dashed p-6 transition-all hover:cursor-pointer aria-disabled:opacity-50 aria-disabled:hover:cursor-not-allowed"
>
	{#if children}
		{@render children()}
	{:else}
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
	{/if}
	<input
		{...rest}
		disabled={uploading}
		{id}
		{accept}
		type="file"
		onchange={change}
		class="hidden"
	/>
</label>
