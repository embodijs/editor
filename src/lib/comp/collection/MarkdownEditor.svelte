<script lang="ts" module>
	import { SvelteMap } from 'svelte/reactivity';

	const imageStorage = new SvelteMap<string, string>();
</script>

<script lang="ts">
	import { Crepe } from '@milkdown/crepe';
	import '@milkdown/crepe/theme/common/style.css';
	import '@milkdown/crepe/theme/frame.css';
	import { getFileContext } from '$/lib/context/filemanager';

	type Props = {
		markdown: string;
	};

	const { markdown }: Props = $props();
	const fileManager = getFileContext();

	function editor(dom: HTMLElement, options: { markdown: string }) {
		// Create editor instance
		const crepe = new Crepe({
			root: dom,
			defaultValue: options.markdown,
			featureConfigs: {
				[Crepe.Feature.ImageBlock]: {
					proxyDomURL: fileManager
						? (url: string) => {
								return fileManager.getFile(url) ?? '';
							}
						: undefined,
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
				console.log('Markdown changed:', crepe.getMarkdown());
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

<div use:editor={{ markdown }}></div>
