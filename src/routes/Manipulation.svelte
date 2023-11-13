<script lang="ts">
	import RuleDisplay from './RuleDisplay.svelte';
	import ClickOutside from '$lib/components/clickOutside.svelte';
	import Symbol from '$lib/components/Symbol.svelte';

	import type { Rule, Variable } from '$lib/grammar';
	import { grammar } from '$lib/grammar';

	let state: Rule = [];
	type State = { index: number; rule: Rule };
	let possibilities: State[] = [];
	let ruleDisplay: HTMLDivElement;

	function start() {
		state = [{ letter: $grammar.start, index: 0 }];
	}

	$: $grammar.start === '' ? (state = []) : start();

	let displayPossibilities = false;
	function showPossibilities(symbol: Variable) {
		displayPossibilities = true;
		possibilities = ($grammar.productions.get(symbol.letter) as Rule[]).map((rule) => {
			return {
				index: symbol.index,
				rule: rule
			};
		});
	}

	function possibiliy_keydown(event: KeyboardEvent, possibility: State) {
		if (event.repeat) return;
		if (event.key == 'Enter') {
			put_state(possibility);
		}
	}

	function put_state(possibility: State) {
		let start = state.slice(0, possibility.index);
		start = start.concat(
			possibility.rule.map((symbol) => {
				if (symbol && typeof symbol != 'string') {
					return { letter: symbol.letter, index: symbol.index + possibility.index };
				} else {
					return symbol;
				}
			})
		);
		state = start.concat(
			state.slice(possibility.index + 1).map((symbol) => {
				if (symbol && typeof symbol != 'string') {
					return { letter: symbol.letter, index: symbol.index + possibility.rule.length - 1 };
				} else {
					return symbol;
				}
			})
		);
		displayPossibilities = false;
	}

	function hidePossibilities(element: HTMLElement) {
		if (ruleDisplay && ruleDisplay.contains(element)) return;
		displayPossibilities = false;
	}
</script>

<div class="manipulator_contener">
	<div class="derivationTree" />
	<div class="manipulator">
		{#if $grammar.start === ''}
			No start symbol
		{:else}
			<ClickOutside on:clickOutside={(event) => hidePossibilities(event.detail)}>
				{#if displayPossibilities}
					<div class="possibilities">
						{#each possibilities as possibility}
							<div
								class="possibility"
								on:click={() => put_state(possibility)}
								on:keypress={(event) => possibiliy_keydown(event, possibility)}
								tabindex="0"
							>
								{#each possibility.rule as symbol}
									<Symbol {symbol} />
								{/each}
							</div>
						{/each}
					</div>
				{/if}
			</ClickOutside>
			<RuleDisplay bind:node={ruleDisplay} on:nonterminal={(event) => showPossibilities(event.detail)} {state} />
		{/if}
	</div>
	<nav class="floating_nav">
		<button on:click={() => start()}>Reset</button>
	</nav>
</div>

<style lang="scss">
	.manipulator_contener {
		background-color: lighten($color: $primary-color, $amount: 75%);
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.manipulator {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		justify-content: center;
		align-items: center;
		height: 100%;
		font-size: 5rem;

		.possibilities {
			position: relative;
			display: flex;
			gap: 2rem;
			flex-wrap: wrap;

			.possibility {
				cursor: pointer;
				font-size: 2rem;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: .2rem 1rem;
				border-radius: 1rem;
				background-color: lighten($color: $primary-color, $amount: 50%);
				transition: background-color 0.2s ease-in-out;

				user-select: none;

				&:hover {
					background-color: lighten($color: $primary-color, $amount: 25%);
				}

				&:focus, &:focus-visible {
					outline-style: auto;
				}
			}
		}
	}

	.floating_nav{
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		top: 0;
		right: 0;
		
		button {
			@include primary-button;
		}
	}
</style>
