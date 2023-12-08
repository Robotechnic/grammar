<script lang="ts">
	import { derivationTree } from "$lib/stores/derivationtree";
	import RuleDisplay from "./RuleDisplay.svelte";

	function keypress(e: KeyboardEvent, i: number) {
		if (e.key == "Enter") 
			derivationTree.restore(i);
	}
</script>

<nav class="derivationTree">
	{#if $derivationTree.length == 0}
		<p>Click on a non terminal symbol to start</p>
	{:else}
		{#each $derivationTree as derivation, i}
			<div 
				class="derivationTree__derivation" 
				on:click={() => derivationTree.restore(i)}
				on:keypress={(e) => keypress(e, i)}
				role="button"
				tabindex="0"
			>
				<RuleDisplay rule={$derivationTree[i]} tabindex={-1}/>
			</div>
			{#if i != $derivationTree.length - 1}
				<div class="arrow">
					<svg width="30" height="30" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M0 25H50" stroke="black" stroke-width="2" />
						<path d="M40 15L50 25L40 35" stroke="black" stroke-width="2" />
					</svg>
				</div>
			{/if}
		{/each}
	{/if}
</nav>

<style lang="scss">
	.derivationTree {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 100%;
		min-height: 3rem;
		overflow-y: auto;
		gap: .3rem;

		&__derivation {
			cursor: pointer;
			user-select: none;
			&:focus,
			&:focus-visible {
				outline-style: auto;
			}
		}
	}
</style>
