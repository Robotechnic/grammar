<script lang="ts">
	import { createEventDispatcher } from "svelte";

	export let title: string;
	export let message: string;
	export let match: RegExp | null = null;

	const dispatch = createEventDispatcher();

	let dialog : HTMLDialogElement;
	let text : string;
	let errored = false;
	
	export function open() {
		text = "";
		errored = false;
		dialog.showModal();
	}

	function close() {
		if (dialog.returnValue === "default") {
			if (text === undefined || text === "") {
				dispatch("cancel");
				return;
			}
			if (match !== null && !match.test(text)) {
				errored = true;
				dialog.showModal();
				return;
			}
			dispatch("ok", text);
		} else {
			dispatch("cancel");
		}
	}
</script>

<dialog bind:this={dialog} on:close={close}>
	<div class="dialog">
		<h1>{title}</h1>
		<p>{message}</p>
		<p class="errorMessage" class:show={errored}>Invalid input</p>
		<form method="dialog">
			<input class="input" class:errored={errored} type="text" bind:value={text} />
			<button class="ok" value="default">Ok</button>
			<button class="cancel" value="cancel">Cancel</button>
		</form>
	</div>
</dialog>

<style lang="scss">
	dialog {
		border: 1px solid $primary-color;
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
		gap: 0.2rem;
		padding: 1rem;
	}
	h1 {
		margin: 0;
	}

	p {
		margin: 0;

		&.errorMessage {
			color: red;
			font-size: 0.8rem;
			display: none;
		}

		&.show {
			display: block;
		}
	}

	form {
		display: grid;
		grid-template-areas: 
		"input input"
		"cancel ok";
		gap: 0.3rem;

		input {
			border: 1px solid $primary-color;
			border-radius: 0.2rem;
			padding: 0.5rem;
			grid-area: input;

			&.errored {
				border-color: red;
			}
		}

		button {
			@include primary-button;
			&.cancel {
				grid-area: cancel;
			}
			&.ok {
				grid-area: ok;
			}
		}
	}
</style>