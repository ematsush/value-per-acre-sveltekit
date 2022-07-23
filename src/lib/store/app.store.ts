import { writable } from "svelte/store";
import type { City } from "$lib/models/city";
import type { GeoJSON } from "$lib/models/geojson";

function createCityStore() {
    const startCity: City = {
        id: "",
        name: "",
        state: "",
        longitude: 0,
        latitude: 0
    };

    const { subscribe, set } = writable<City>(startCity);

    return {
        subscribe,
        setCity: (city: City) => set(city)
    }
}

function createParcelStore() {
    const { subscribe, set } = writable<GeoJSON[]>([]);

    function setParcels(parcels: GeoJSON[]) {
        if (parcels == null) {
            throw "cannot set null parcels to store";
        }
        set(parcels);
    }

    return {
        subscribe,
        setParcels,
        resetParcels: () => set([])
    }
}

export const cityStore = createCityStore();
export const parcelsStore = createParcelStore();