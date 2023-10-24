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
	header {
		background-color: $primary-color;
		color: $primary-text-color;
		padding: 1rem;
		text-align: center;
		height: 5rem;
	}

	section {
		padding: 1rem;
		width: 100vw;
		box-sizing: border-box;
	}

</style>
