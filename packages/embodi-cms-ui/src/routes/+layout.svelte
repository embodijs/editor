<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/comp/ui/sonner/index.js';
	let { children } = $props();
</script>

<Toaster position="top-center" expand={false} richColors />

{@render children()}
