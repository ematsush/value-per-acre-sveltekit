<script type="ts">
	import maplibregl from 'maplibre-gl';
	import { onDestroy, onMount } from 'svelte';
	import { Deck, type RGBAColor } from '@deck.gl/core';
	import { GeoJsonLayer } from '@deck.gl/layers';
	import { getParcels } from '$lib/services/parcels-service';
	import type { GeoJSON } from '$lib/models/geojson';
	import { DrawPolygonMode } from '@nebula.gl/edit-modes';
	import { EditableGeoJsonLayer } from '@nebula.gl/layers';
	import { createLinearizedHeighFunc, createColorFunc } from '$lib/utils/scale';
	import { BAR_COLORS } from '$lib/utils/constants';
	import { parcelsStore } from '$lib/store/app.store';
	import type { City, CityDataSetInfo } from '$lib/models/city';
	import { fly } from 'svelte/transition';

	export let afterLoad: () => void = () => {};

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

	let maplibre: maplibregl.Map;
	let deckgl: Deck;

	// Component state
	let hasLoaded = false;
	let inSelectMode = false;
	let loadingParcels = false;
	let currentLayers: any[] = [];

	// Render functions
	let colorFunc = <(x: number) => RGBAColor>createColorFunc(dataSetInfo.percentiles, BAR_COLORS);
	let heightFunc = createLinearizedHeighFunc(dataSetInfo.max, 1000);

	const parcelsUnsub = parcelsStore.subscribe(p => {
		loadingParcels = false;
		if (hasLoaded) {
			updateParcels(p, heightFunc, colorFunc);
		}
	});

	onDestroy(parcelsUnsub);

	onMount(() => {
		maplibre = new maplibregl.Map({
			container: 'map-libre-container',
			style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
			interactive: false,
			center: [cityData.longitude, cityData.latitude],
			zoom: 13,
			bearing: -13,
			pitch: 60
		});

		deckgl = new Deck({
			canvas: 'deck-gl-canvas',
			width: '100%',
			height: '100%',
			initialViewState: {
				longitude: cityData.longitude,
				latitude: cityData.latitude,
				zoom: 13,
				bearing: -13,
				pitch: 60
			},
			controller: {
				doubleClickZoom: false
			},
			onViewStateChange: ({ viewState }: any) => {
				maplibre.jumpTo({
					center: [viewState.longitude, viewState.latitude],
					zoom: viewState.zoom,
					bearing: viewState.bearing,
					pitch: viewState.pitch
				});
			},
			getCursor: ({ isDragging }: any) => {
				if (inSelectMode) {
					return 'crosshair';
				} else {
					return isDragging ? 'grabbing' : 'grab';
				}
			}
		});

		hasLoaded = true;

		afterLoad();
	});

	export function enableSelectMode() {
		if (!inSelectMode) {
			currentLayers.push(
				new EditableGeoJsonLayer({
					id: 'newDataSelection',
					data: {
						type: 'FeatureCollection',
						features: []
					},
					mode: DrawPolygonMode,
					selectedFeatureIndexes: [],
					filled: true,
					pointRadiusMinPixels: 2,
					pointRadiusScale: 2000,
					getFillColor: [200, 0, 80, 180],
					pickable: true,
					autoHighlight: true,
					onEdit: ({ updatedData, editType }) => {
						if ('addFeature' === editType) {
							disableSelectMode();
							loadingParcels = true;
							getParcels(updatedData.features[0].geometry).then((parcels) => {
								parcelsStore.setParcels(parcels);
							});
						}
					}
				})
			);
			deckgl.setProps({ layers: [...currentLayers] });
			inSelectMode = !inSelectMode;
		}
	}

	function disableSelectMode() {
		if (inSelectMode) {
			currentLayers = currentLayers.filter((el) => el.id !== 'newDataSelection');
			deckgl.setProps({ layers: [...currentLayers] });
			inSelectMode = !inSelectMode;
		}
	}

	function updateParcels(
		parcels: GeoJSON[],
		heightFunc: (x: number) => number,
		colorFunc: (x: number) => RGBAColor
	) {
		const dataLayer = new GeoJsonLayer({
			id: 'geojson',
			data: parcels,
			opacity: 1,
			stroked: false,
			filled: true,
			extruded: true,
			getElevation: (el: any) => heightFunc(el.properties.valuePerAcre),
			getFillColor: (el: any) => colorFunc(el.properties.valuePerAcre),
			pickable: true
		});
		currentLayers = [dataLayer];
		deckgl.setProps({ layers: [...currentLayers] });
	}
</script>

{#if loadingParcels}
<div id="loading-message" transition:fly="{{ y: -100, duration: 500 }}">
	<h2>Loading parcels...</h2>
</div>
{/if}
<div id="map-container">
	<div id="map-libre-container" />
	<canvas id="deck-gl-canvas" />
</div>

<style>
	#loading-message {
		width: 15%;
		height: 2rem;
		margin: 0;
		position: absolute;
		top: 10%;
		left: 50%;
		-ms-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		z-index: 99;
		background-color: #2c2f33;
		padding: 1rem;
		margin: 0;
		box-shadow: 7px 7px 5px rgba(0, 0, 0, 0.4);
		text-align: center;
	}

	h2 {
		color: #8da799;
		margin: 0;
		font-family: Helvetica, sans-serif;
	}

	#map-container {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #101010;
	}

	#map-libre-container,
	#deck-gl-canvas {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
</style>
