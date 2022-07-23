import { citiesCollection } from "$lib/db/mongodb";

export async function GET() {
    const cursor = citiesCollection.find({}).project({dataSetInfo: 0});

    return {
        status: 200,
        body: await cursor.toArray()
    };
}