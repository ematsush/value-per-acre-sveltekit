<script type="ts">
	export let href: string;
</script>

<a href={href}>
	<slot>-</slot>
</a>

<style>
	a {
		color: #f06071;
		font-family: Helvetica, sans-serif;
		text-decoration: none;
	}

	a:hover {
		color: #cd3e4f;
		text-decoration: underline;
	}
</style>
