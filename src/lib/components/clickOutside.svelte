<script lang="ts">
	import { createEventDispatcher } from "svelte";

	let element: HTMLElement | null = null;

	let dispatcher = createEventDispatcher();

	function handleClick(event: MouseEvent): void {
		if (element && !element.contains(event.target as Node)) {
			dispatcher("clickOutside", event.target);
		}
	}
</script>

<svelte:document on:click={handleClick} />
<div bind:this={element}>
	<slot />
</div>
