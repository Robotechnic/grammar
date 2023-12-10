<script lang="ts">
	import Symbol from "$lib/components/Symbol.svelte";

	import type { Rule, Variable } from "$lib/stores/grammar";
	import { grammar } from "$lib/stores/grammar";
	import { createEventDispatcher } from "svelte";

	export let rule: Rule = [];
	export let tabindex: number;
	export let node: HTMLDivElement | undefined = undefined;
	export let allowWrap: boolean = false;

	$: $grammar.start === "" ? (rule = []) : (rule = [{ letter: $grammar.start, index: 0 }]);
	let dispatcher = createEventDispatcher();
	function showPossibilities(symbol: Variable): undefined {
		dispatcher("nonterminal", symbol);
	}
</script>

<div class="rule_display" bind:this={node} class:wrap={allowWrap}>
	{#each rule as symbol}
		<Symbol {symbol} on:nonterminal={(e) => showPossibilities(e.detail)} {tabindex} />
	{/each}
</div>

<style lang="scss">
	.rule_display {
		display: flex;
		flex-direction: columns;
		align-items: center;
		flex-wrap: nowrap;
		&.wrap {
			flex-wrap: wrap;
		}
	}
</style>
