<script lang="ts" generics="T extends { markdown: string }">
	import { Crepe } from '@milkdown/crepe';
	import '@milkdown/crepe/theme/common/style.css';
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
