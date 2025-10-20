<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/comp/ui/sonner/index.js';
	import { ModeWatcher } from 'mode-watcher';
	let { children } = $props();
</script>

<Toaster position="top-center" expand={false} richColors />
<ModeWatcher />
{@render children()}
