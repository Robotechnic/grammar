<script lang="ts">
	import type { Terminal, Variable } from "$lib/stores/grammar";
	import { createEventDispatcher } from "svelte";

	export let symbol: Variable | Terminal | null = null;

	let dispatcher = createEventDispatcher();
	function showPossibilities(symbol: Variable): undefined {
		dispatcher("nonterminal", symbol);
	}

	function keyPossibilities(e: KeyboardEvent, symbol: Variable | Terminal): undefined {
		if (e.key === "Enter") {
			dispatcher("nonterminal", symbol as Variable);
		}
	}
</script>

{#if symbol === null}
	<span class="terminal">ε</span>
{:else if typeof symbol === "string"}
	<span class="terminal">{symbol}</span>
{:else}
	<span
		class="nonterminal"
		on:keypress={(e) => keyPossibilities(e, symbol)}
		on:click={showPossibilities(symbol)}
		tabindex="-1"
		role="button"
	>
		{symbol.letter}
	</span>
{/if}

<style lang="scss">
	.nonterminal {
		background-color: lightblue;
		border-radius: 25%;
		padding: 0.5rem;
		margin: 0.5rem;
		cursor: pointer;
	}
</style>
