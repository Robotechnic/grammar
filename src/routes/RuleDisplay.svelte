<script lang="ts">
	import Symbol from "$lib/components/Symbol.svelte";

	import type { Rule, Variable } from "$lib/grammar";
	import { grammar } from "$lib/grammar";
	import { createEventDispatcher } from "svelte";

	export let state: Rule = [];
	export let node: HTMLDivElement;

	$: $grammar.start === "" ? (state = []) : (state = [{ letter: $grammar.start, index: 0 }]);
	let dispatcher = createEventDispatcher();
	function showPossibilities(symbol: Variable): undefined {
		dispatcher("nonterminal", symbol);
	}
</script>

<div class="rule_display" bind:this={node}>
	{#each state as symbol}
		<Symbol {symbol} on:nonterminal={(e) => showPossibilities(e.detail)} />
	{/each}
</div>
