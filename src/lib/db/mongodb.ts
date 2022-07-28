import { Collection, MongoClient } from "mongodb";

let uri = "mongodb://0.0.0.0:27017/";

if (process && process.env.DATABASE_URL) {
    const username = process.env.DB_USR;
    const password = process.env.DB_PWD;

    uri = process.env.DATABASE_URL;
}

const client = new MongoClient(uri);

export let parcelsCollection: Collection;
export let citiesCollection: Collection;

export async function establishConnection() {
    try {
        await client.connect();
        const db = client.db("value-per-acre");
        await db.command({ ping : 1});
        console.log(`Established connection to URI:${uri} DB:value-per-acre`);

        parcelsCollection = db.collection("parcels");
        citiesCollection = db.collection("cities");
    } catch(err) {
        console.error(`Caught error while trying to connect to URI:${uri} DB:value-per-acre`);
        console.error(err);

        client.close();
    }
}