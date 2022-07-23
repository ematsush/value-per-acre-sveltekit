<script context="module" type="ts">
	export async function load({ params, fetch }: any) {
		const response = await fetch(`/api/cities/${params.cityId}`);

		if (!response.ok) {
			throw `Could not fetch city(id:${params.cityId}). Response was not ok`;
		}

		const jsonCity: any = await response.json();

		// mapToCity(jsonCity);
		return {
			props: {
				cityData: mapToCity(jsonCity)
			}
		};
	}
</script>

<script type="ts">
	import ButtonSmall from '$lib/components/ButtonSmall.svelte';
	import InfoPanel from '$lib/components/InfoPanel.svelte';
	import Map from '$lib/components/Map.svelte';
	import { mapToCity, type City } from '$lib/models/city';

	export let cityData: City;

	let map: Map;
</script>

<div class="info-panel">
	<InfoPanel {cityData} />
</div>
<div class="selection-bar">
	<ButtonSmall
		onClick={() => {
			map.enableSelectMode();
		}}>Select Parcels</ButtonSmall
	>
	<ButtonSmall onClick={() => (window.location.href = '/')}>Select another city</ButtonSmall>
</div>
<div class="map">
	<Map bind:this={map} {cityData} />
</div>

<style>
	.info-panel {
		width: 20%;
		z-index: 99;
		position: absolute;
		top: 10px;
		left: 10px;
	}

	.selection-bar {
		z-index: 99;
		position: absolute;
		top: 10px;
		right: 10px;
	}

	.map {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: -1;
	}
</style>
