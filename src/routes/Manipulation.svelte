<script lang="ts">
	import RuleDisplay from "./RuleDisplay.svelte";
	import ClickOutside from "$lib/components/clickOutside.svelte";
	import Symbol from "$lib/components/Symbol.svelte";

	import type { Rule, Variable } from "$lib/stores/grammar";
	import { grammar } from "$lib/stores/grammar";
	import { derivationTree } from "$lib/stores/derivationtree";
	import ErrorModal from "$lib/components/errorModal.svelte";
	import InputModal from "$lib/components/inputModal.svelte";
	import DerivationTree from "./DerivationTree.svelte";
	import { currentManipulationState } from "$lib/stores/manipulationState";

	type State = { index: number; rule: Rule };
	let possibilities: State[] = [];
	let ruleDisplay: HTMLDivElement;
	let errorMessage = "";
	let errorDialog: ErrorModal;
	let inputDialog: InputModal;

	function reset() {
		$currentManipulationState = [{ letter: $grammar.start, index: 0 }];
		derivationTree.reset();
		derivationTree.addRule($currentManipulationState);
	}

	$: $grammar.start === "" ? ($currentManipulationState = []) : reset();

	let displayPossibilities = false;
	/**
	 * Show the possibilities for the given non terminal
	 * @param symbol the non terminal
	 */
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
		if (event.key == "Enter") {
			put_state(possibility);
		}
	}

	/**
	 * Replace the symbol at the given index by the given rule
	 * @param possibility the non terminal to replace
	 */
	function put_state(possibility: State) {
		let state = $currentManipulationState;
		let start = state.slice(0, possibility.index);
		start = start.concat(
			possibility.rule.map((symbol) => {
				if (symbol && typeof symbol != "string") {
					return { letter: symbol.letter, index: symbol.index + possibility.index };
				} else {
					return symbol;
				}
			})
		);
		state = start.concat(
			state.slice(possibility.index + 1).map((symbol) => {
				if (symbol && typeof symbol != "string") {
					return { letter: symbol.letter, index: symbol.index + possibility.rule.length - 1 };
				} else {
					return symbol;
				}
			})
		);
		$currentManipulationState = state;
		derivationTree.addRule(state);
		displayPossibilities = false;
	}

	function hidePossibilities(element: HTMLElement) {
		if (ruleDisplay && ruleDisplay.contains(element)) return;
		displayPossibilities = false;
	}

	function saveRules(name: string) {
		let json = grammar.toJSON();
		let blob = new Blob([JSON.stringify(json)], { type: "application/json" });
		let url = URL.createObjectURL(blob);
		let a = document.createElement("a");
		a.href = url;
		a.download = `${name}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}

	function loadRules() {
		let input = document.createElement("input");
		input.type = "file";
		input.accept = "application/json";
		input.onchange = (event) => {
			let file = (event.target as HTMLInputElement).files?.[0];
			if (!file) return;
			let reader = new FileReader();
			reader.onload = (event) => {
				let json = JSON.parse(event.target?.result as string);
				try {
					grammar.fromJSON(json);
				} catch (error) {
					let e = error as Error;
					errorMessage = e.message;
					errorDialog.open();
				}
			};
			reader.readAsText(file);
		};
		input.click();
	}

	function manageKeyPress(event: KeyboardEvent) {
		if (event.key == "z" && event.ctrlKey) {
			derivationTree.removeRule();
			event.stopPropagation();
			event.preventDefault();
			return false;
		}
		if (event.key == "s" && event.ctrlKey) {
			inputDialog.open();
			event.stopPropagation();
			event.preventDefault();
			return false;
		}

		if (event.key == "l" && event.ctrlKey) {
			loadRules();
			event.stopPropagation();
			event.preventDefault();
			return false;
		}
	}
</script>

<svelte:body on:keydown={manageKeyPress} />
<div class="manipulator_contener">
	<DerivationTree />
	<div class="manipulator">
		{#if $grammar.start === ""}
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
								role="button"
							>
								{#each possibility.rule as symbol}
									<Symbol {symbol} />
								{/each}
							</div>
						{/each}
					</div>
				{/if}
			</ClickOutside>
			<RuleDisplay
				bind:node={ruleDisplay}
				on:nonterminal={(event) => showPossibilities(event.detail)}
				rule={$currentManipulationState}
				tabindex={0}
				allowWrap={true}
			/>
		{/if}
	</div>
	<nav class="floating_nav">
		<button on:click={() => reset()}>Reset</button>
		<button on:click={() => inputDialog.open()}>Save</button>
		<button on:click={() => loadRules()}>Load</button>
	</nav>
</div>

<ErrorModal
	title="Import Error"
	message={errorMessage}
	on:ok={() => (errorMessage = "")}
	bind:this={errorDialog}
/>

<InputModal
	title="Grammar Name"
	message="Enter the name of the grammar"
	on:ok={(event) => saveRules(event.detail)}
	bind:this={inputDialog}
/>

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
			padding: 2rem;

			.possibility {
				cursor: pointer;
				font-size: 2rem;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 0.2rem 1rem;
				border-radius: 1rem;
				background-color: lighten($color: $primary-color, $amount: 50%);
				transition: background-color 0.2s ease-in-out;

				user-select: none;

				&:hover {
					background-color: lighten($color: $primary-color, $amount: 25%);
				}

				&:focus,
				&:focus-visible {
					outline-style: auto;
				}
			}
		}
	}

	.floating_nav {
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
