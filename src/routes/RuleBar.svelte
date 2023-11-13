<script lang="ts">
	import Modal from '$lib/components/modal.svelte';
	import Rule from '$lib/components/rule.svelte';
	import { grammar, ruleToString } from '$lib/grammar';

	let dialog: Modal;
</script>

<nav class="productionRules">
	<h2>Production rules</h2>
	<div class="productionRules__container">
		{#each $grammar.productions as [name, _]}
			<Rule
				{name}
				rules={$grammar.productions.get(name)?.map(ruleToString)}
				on:input={(e) => grammar.setProduction(name, e.detail)}
				on:startChange={(e) => grammar.setStart(e.detail)}
			/>
		{/each}
	</div>
	<button class="productionRules__addButton" on:click={() => dialog.open()}
		>Add production rule</button
	>
	<Modal
		title="Add production rule"
		message="Enter the name of the new production rule"
		match={/^[a-zA-Z]$/}
		bind:this={dialog}
		on:ok={(e) => grammar.setProduction(e.detail, [''])}
	/>
</nav>

<style lang="scss">
	.productionRules {
		&__container {
			display: flex;
			flex-direction: column;
			gap: 1rem;
		}

		&__addButton {
			@include primary-button;
			margin-top: 1rem;
		}
	}
</style>
