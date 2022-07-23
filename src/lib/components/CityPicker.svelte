<script type="ts">
	import type { City } from '$lib/models/city';
	import { getCities } from '$lib/services/cities-service';
	import Button from './Button.svelte';

	export let onCityClick: (c: City) => void = () => {};

	const citiesPromise: Promise<City[]> = getCities();
</script>

<div>
    <ul>
        {#await citiesPromise}
            <p>Loading...</p> <!-- TODO Put a spinner here-->
        {:then cities}
            {#each cities as city}
                <li>
                    <Button onClick={() => onCityClick(city)}>
                        {city.name}, {city.state}
                    </Button>
                </li>
            {/each}
        {/await}
    </ul>
</div>

<style>
    div {
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
