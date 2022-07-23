<script context="module" lang="ts">
	import { mapToCity, type City } from '$lib/models/city';
	export async function load({ fetch }: any) {
		const response = await fetch('/api/cities');

		if (!response.ok) {
			throw 'Could not fetch cities. Response was not ok';
		}

		const jsonCities: any[] = await response.json();

		return {
			props: {
				cities: jsonCities.map((el) => mapToCity(el))
			}
		};
	}
</script>

<script lang="ts">
	import Link from '$lib/components/Link.svelte';
	import background from '$lib/assets/home_background.png';

	export let cities: City[];
</script>

<div style="background-image: url({background})" id="background-div">
	<div id="city-picker">
		<ul>
			{#each cities as city}
				<Link href={`/map/${city.id}`}>{city.name}, {city.state}</Link>
			{/each}
		</ul>
	</div>
</div>

<style>
	#background-div {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}

	#city-picker {
		width: 15%;
		margin: 0;
		position: absolute;
		top: 30%;
		left: 50%;
		-ms-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		z-index: 99;
		background-color: #2c2f33;
		padding: 2rem;
		margin: 0;
		box-shadow: 7px 7px 5px rgba(0, 0, 0, 0.4);
	}

	ul {
		list-style: none;
		text-align: center;
		margin: 0;
		padding: 0;
	}
</style>
