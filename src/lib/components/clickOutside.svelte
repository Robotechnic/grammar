<script lang="ts">
	let element : HTMLElement | null = null

	function handleClick(event : MouseEvent) : void {
		if (element && !element.contains(event.target as Node)) {
			console.log("click outside")
		}
	}
</script>

<svelte:document on:click={handleClick} />
<div bind:this={element}>
	<slot/>
</div>
