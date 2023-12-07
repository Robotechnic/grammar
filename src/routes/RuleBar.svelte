<script lang="ts">
	import Modal from "$lib/components/inputModal.svelte";
	import Rule from "$lib/components/rule.svelte";
	import { grammar, ruleToString } from "$lib/stores/grammar";

	let dialog: Modal;
</script>

<nav class="productionRules">
	<div class="productionRules__top">
		<h2>Production rules</h2>
	</div>
	<div class="productionRules__container">
		{#each $grammar.productions as [name, _]}
			<Rule
				{name}
				rules={$grammar.productions.get(name)?.map(ruleToString)}
				on:input={(e) => grammar.setProduction(name, e.detail)}
				bind:group={$grammar.start}
			/>
		{/each}
	</div>
	<div class="productionRules__bottom">
		<button class="productionRules__bottom__addButton" on:click={() => dialog.open()}>
			Add production rule</button
		>
	</div>

	<Modal
		title="Add production rule"
		message="Enter the name of the new production rule"
		match={/^[a-zA-Z]$/}
		bind:this={dialog}
		on:ok={(e) => grammar.setProduction(e.detail, [""])}
	/>
</nav>

<style lang="scss">
	.productionRules {
		overflow-x: scroll;
		&__top {
			display: flex;
			justify-content: center;
			align-items: center;
			position: sticky;
			top: 0;
			background: linear-gradient(180deg, rgba(255, 255, 255, 1) 40%, rgba(255, 255, 255, 0) 100%);
		}

		&__container {
			display: flex;
			flex-direction: column;
			gap: 1rem;
		}

		&__bottom {
			position: sticky;
			bottom: 0;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 80%);

			&__addButton {
				@include primary-button;
				margin-top: 1rem;
			}
		}
	}
</style>
