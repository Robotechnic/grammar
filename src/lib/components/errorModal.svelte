<script lang="ts">
	import { createEventDispatcher } from "svelte";

	export let title: string;
	export let message: string;

	const dispatch = createEventDispatcher();

	let dialog: HTMLDialogElement;

	export function open() {
		dialog.showModal();
	}

	function close() {
		dispatch("ok");
	}

</script>

<dialog bind:this={dialog} on:close={close}>
	<form class="dialog" method="dialog" on:submit={close}>
		<h1>{title}</h1>
		<p>{message}</p>
		<button class="ok" value="default">Ok</button>
	</form>
</dialog>

<style lang="scss">
	dialog {
		border: 1px solid red;
		border-radius: 0.2rem;
		background-color: $primary-text-color;
		color: $primary-color;
		&::backdrop {
			background-color: rgba(0, 0, 0, 0.5);
		}
	}

	.dialog {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem;
	}

	h1 {
		margin: 0;
		color: red;
		font-weight: bold;
	}

	.ok {
		@include primary-button;
		margin-top: 1rem;
		width: 100%;
	}
</style>
