<script type="ts">
	import type { City, CityDataSetInfo } from '$lib/models/city';
	import type { GeoJSON } from '$lib/models/geojson';
	import { parcelsStore } from '$lib/store/app.store';
	import { addCommas, addSuffix } from '$lib/utils/numbers';
	import { onDestroy } from 'svelte';
	import ButtonSmall from './ButtonSmall.svelte';
	import { median } from 'd3-array';

	export let cityData: City;

	let dataSetInfo: CityDataSetInfo = {
		max: 0,
		min: 0,
		median: 0,
		numParcels: 0,
		percentiles: [0, 0, 0, 0, 0, 0],
		description: ''
	};

	if (cityData.dataSetInfo) {
		dataSetInfo = cityData.dataSetInfo;
	}

	let selectedMin: number | null;
	let selectedMax: number | null;
	let selectedMedian: number | null;
	let selectedParcels: GeoJSON[];

	let showDatasetDescription = false;

	const parcelUnsub = parcelsStore.subscribe((parcels) => {
		if (parcels.length > 0) {
			let min = Number.MAX_VALUE;
			let max = -1;
			const values: number[] = [];
			parcels.forEach((parcel) => {
				values.push(parcel.properties.valuePerAcre);
				min = Math.min(min, parcel.properties.valuePerAcre);
				max = Math.max(max, parcel.properties.valuePerAcre);
			});
			selectedMax = max;
			selectedMin = min;
			selectedMedian = median(values);
			selectedParcels = parcels;
		} else {
			selectedMax = null;
			selectedMin = null;
			selectedMedian = null;
			selectedParcels = [];
		}
	});

	function formatNumbers(x: number | null) {
		return x == null ? 'n/a' : addCommas(Math.floor(x * 1000) / 1000);
	}

	onDestroy(parcelUnsub);
</script>

<div class="info-box">
	{#if showDatasetDescription}
		<p>{dataSetInfo.description}</p>
		<ButtonSmall onClick={() => (showDatasetDescription = !showDatasetDescription)}>
			Back
		</ButtonSmall>
	{:else}
		<h1>{cityData.name}, {cityData.state}</h1>

		<h2>City Statistics:</h2>
		<p>Number of parcels: {formatNumbers(dataSetInfo.numParcels)}</p>
		<p>Median: {formatNumbers(dataSetInfo.median)} ($/acre)</p>
		<p>Max: {formatNumbers(dataSetInfo.max)} ($/acre)</p>
		<p>Min: {formatNumbers(dataSetInfo.min)} ($/acre)</p>

		<h2>Selected Parcels:</h2>
		<p>Number of parcels: {formatNumbers(selectedParcels.length)}</p>
		<p>Median: {formatNumbers(selectedMedian)} ($/acre)</p>
		<p>Max: {formatNumbers(selectedMax)} ($/acre)</p>
		<p>Min: {formatNumbers(selectedMin)} ($/acre)</p>

		<div class="percentile">
			<svg width="100%" height="50px">
				<svg x="5%" y="5%" width="90%" height="50%">
					<rect x="0" y="0" width="16.6%" height="100%" fill="#5A1846" />
					<rect x="16.6%" y="0" width="16.6%" height="100%" fill="#923250" />
					<rect x="33.2%" y="0" width="16.6%" height="100%" fill="#C35852" />
					<rect x="49.8%" y="0" width="16.6%" height="100%" fill="#E68850" />
					<rect x="66.4%" y="0" width="16.6%" height="100%" fill="#F9BE56" />
					<rect x="82.4%" y="0" width="16.6%" height="100%" fill="#F9F871" />
				</svg>
				<svg x="5%" y="100%" width="90%" overflow="visible">
					<text x="0%" fill="#6E695E" font-size="0.75rem" text-anchor="middle"
						>{addSuffix(dataSetInfo.min)}</text
					>
					{#each dataSetInfo.percentiles as percentile, i}
						<text
							x={((i + 1) * 16.6).toString() + '%'}
							fill="#6E695E"
							font-size="0.75rem"
							text-anchor="middle">{addSuffix(percentile)}</text
						>
					{/each}
				</svg>
			</svg>
		</div>

		<br />

		<ButtonSmall onClick={() => (showDatasetDescription = !showDatasetDescription)}>
			About the dataset
		</ButtonSmall>
	{/if}
</div>

<style>
	.info-box {
		background-color: #2c2f33;
		padding: 1rem;
		box-shadow: 7px 7px 5px rgba(0, 0, 0, 0.4);
	}

	h1 {
		color: #82a4a3;
	}

	h2 {
		color: #8da799;
		margin-bottom: 0;
	}

	p {
		margin: 0.1rem;
		color: #818776;
	}

	* {
		font-family: Helvetica, sans-serif;
	}

	.percentile {
		height: 5%;
		width: 100%;
	}
</style>
