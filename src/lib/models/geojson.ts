export enum GeoJSONType {
    Polygon = "Polygon",
    MultiPloygon = "MultiPolygon",
    Feature = "Feature"
}

export class GeoJSON {
    type: GeoJSONType;
    coordinates?: number[][][];
    properties?: any;
    geometry?: GeoJSON;

    constructor(type: GeoJSONType) {
        this.type = type;
    }
}

export function mapToGeoJSON(json: any): GeoJSON {
    // if (!(json instanceof Object)) {
    //     throw "json is not an object";
    // }
    // if (json.type == undefined) {
    //     throw "json is missing \"type\" field";
    // }
    // if (json.type !instanceof String) {
    //     throw "json.type is not a String";
    // }
    // if (!json.coordinates) {
    //     throw "json is missing \"coordinates"
    // }
    const result = new GeoJSON(json.type);
    result.coordinates = json.coordinates;
    return result;
}