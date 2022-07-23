import { GeoJSON, GeoJSONType } from "$lib/models/geojson";

export async function getParcels(boundary: GeoJSON): Promise<GeoJSON[]> {
    const headers = new Headers({
        'Content-type': 'application/json',

    });

    const response = await fetch('/api/parcels/getParcels', {
        method: 'POST',
        body: JSON.stringify(boundary),
        headers: headers
    });


    if (!response.ok) {
        throw "Response was not okay";
    }

    const jsonResult: any[] = await response.json()

    if (!(jsonResult instanceof Array)) {
        throw "json is malformed. It was not an array";
    }

    return jsonResult.map(el => {
        const innerMultiPolygon = new GeoJSON(el.boundary.type);
        innerMultiPolygon.coordinates = el.boundary.coordinates;

        const outerFeature = new GeoJSON(GeoJSONType.Feature);
        outerFeature.geometry = innerMultiPolygon;
        outerFeature.properties = {
            valuePerAcre: el.value_per_acre,
            orig_parcel_num: el.orig_parcel_num
        };

        return outerFeature;
    });
}