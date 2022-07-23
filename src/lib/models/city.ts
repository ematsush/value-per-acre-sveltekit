export type City = {
    id: string;
    name: string;
    state: string;
    longitude: number;
    latitude: number;
    dataSetInfo?: CityDataSetInfo;
}

export type CityDataSetInfo = {
    max: number;
    min: number;
    median: number;
    percentiles: number[];
    numParcels: number;
    description: string;
}

export function mapToCity(json: any): City {
    json.id = json._id;
    return json;
}