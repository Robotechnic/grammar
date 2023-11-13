<script>
	import '../app.scss';
</script>

<header>
	<h1>Context-Free grammar manipulator</h1>
</header>

<section>
	<slot />
</section>

<style lang="scss">
	$header-height: 7rem;
	header {
		background-color: $primary-color;
		color: $primary-text-color;
		padding: 1rem;
		text-align: center;
		height: $header-height;
	}

	section {
		padding: 1rem;
		width: 100vw;
		box-sizing: border-box;
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.5em;
		height: calc(100vh - $header-height);
	}
</style>
