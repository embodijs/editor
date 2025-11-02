<script lang="ts" generics="T extends { markdown: string }">
	import { Crepe } from '@milkdown/crepe';
	// Import base styles first
	import '@milkdown/crepe/theme/common/style.css';

	// Choose the theme you want to use
	import '@milkdown/crepe/theme/frame.css';
	import { getFileContext } from '$/lib/context/filemanager';
	import type { SuperForm } from 'sveltekit-superforms';

	type Props = {
		form: SuperForm<T>;
	};

	const { form }: Props = $props();
	const { form: formData } = form;

	const fileManager = getFileContext();

	function editor(dom: HTMLElement, options: { markdown: string }) {
		// Create editor instance
		const crepe = new Crepe({
			root: dom,
			defaultValue: options.markdown,
			featureConfigs: {
				[Crepe.Feature.ImageBlock]: {
					proxyDomURL: (path: string) => {
						if (path === '') return '';
						return fileManager?.getFile(path) ?? '';
					},

					onUpload: async (file) => {
						if (!fileManager) {
							return file.name;
						}
						return fileManager.set(file);
					}
				}
			}
		});

		crepe.on((listener) => {
			listener.markdownUpdated(() => {
				formData.update((data) => ({ ...data, markdown: crepe.getMarkdown() }));
			});
		});

		// Initialize the editor
		crepe.create();

		// Clean up when done
		return {
			destroy: () => crepe.destroy()
		};
	}
</script>

<div use:editor={{ markdown: $formData.markdown }}></div>

<style>
	div :global(.milkdown) {
		/* Background Colors */
		--crepe-color-background: var(--background); /* Main background color */
		--crepe-color-surface: var(--popover); /* Surface color for cards/panels */
		--crepe-color-surface-low: var(--popover); /* Lower surface color for depth */

		/* Text Colors */
		--crepe-color-on-background: var(--foreground); /* Text color on background */
		--crepe-color-on-surface: var(--popover-foreground); /* Text color on surface */
		--crepe-color-on-surface-variant: var(--popover-foreground); /* Secondary text color */

		/* Accent Colors */
		--crepe-color-primary: var(--primary); /* Primary brand color */
		--crepe-color-secondary: var(--secondary); /* Secondary accent color */
		--crepe-color-on-secondary: var(--secondary-foreground); /* Text color on secondary */

		/* UI Colors */
		--crepe-color-outline: var(--ring); /* Border/outline color */
		--crepe-color-inverse: var(--accent); /* Inverse color for contrast */
		--crepe-color-on-inverse: var(--accent-foreground); /* Text color on inverse */
		--crepe-color-inline-code: var(--destructive); /* Inline code color */
		--crepe-color-error: var(--destructive); /* Error state color */

		/* Interactive Colors */
		--crepe-color-hover: var(--muted); /* Hover state color */
		--crepe-color-selected: var(--ring); /* Selected state color */
		--crepe-color-inline-area: var(--accent); /* Inline editing area color */
	}
</style>
