<script lang="ts">
	import { Crepe } from '@milkdown/crepe';
	import '@milkdown/crepe/theme/common/style.css';
	import '@milkdown/crepe/theme/frame.css';

	type Props = {
		markdown: string;
	};

	const { markdown }: Props = $props();

	function editor(dom: HTMLElement, options: { markdown: string }) {
		// Create editor instance
		const crepe = new Crepe({
			root: dom,
			defaultValue: options.markdown
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
