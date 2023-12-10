<script lang="ts">
	import { derivationTree } from "$lib/stores/derivationtree";
	import { tick } from "svelte";
	import RuleDisplay from "./RuleDisplay.svelte";

	function keypress(e: KeyboardEvent, i: number) {
		if (e.key == "Enter") 
			derivationTree.restore(i);
	}

	let contener: HTMLElement | null = null;

	$: {
		$derivationTree
		tick().then(() => {
			if (contener) {
				contener.scrollTo({ left: contener.scrollWidth, behavior: "smooth" });
			}
		});
	}
</script>

<nav class="derivationTree" bind:this={contener}>
	{#if $derivationTree.length == 0}
		<p>Click on a non terminal symbol to start</p>
	{:else}
		{#each $derivationTree as derivation, i }
			<div 
				class="derivationTree__derivation" 
				on:click={() => derivationTree.restore(i)}
				on:keypress={(e) => keypress(e, i)}
				role="button"
				tabindex="0"
			>
				<RuleDisplay rule={derivation} tabindex={-1}/>
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
	@use 'sass:color';
	.derivationTree {
		padding: 1rem 0 1rem 1rem;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		min-height: 3rem;
		overflow-y: hidden;
		overflow-x: scroll;
		max-width: 70vw;
		gap: .3rem;
		position: relative;
		
		&::before {
			$gradient-size: 5%;
			$gradient-shade: lighten($color: $primary-color, $amount: 75%);
			$gradient-color: color.adjust($gradient-shade, $alpha: -0.9);
			background: linear-gradient(
				to right,
				$gradient-shade 0%,
				$gradient-color $gradient-size,
				transparent $gradient-size,
				transparent calc(100% - #{$gradient-size}),
				$gradient-color calc(100% - #{$gradient-size}),
				$gradient-shade 100%
			);
			content: " ";
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			width: 100%;
			pointer-events: none;
		}

		&__derivation {
			cursor: pointer;
			user-select: none;
			&:focus,
			&:focus-visible {
				outline-style: auto;
			}
		}

		p {
			align-self: center;
			margin-left: auto;
			margin-right: auto;
		}
	}
</style>
