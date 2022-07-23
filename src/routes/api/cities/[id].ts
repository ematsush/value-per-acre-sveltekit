import { citiesCollection } from "$lib/db/mongodb";
import { ObjectId } from "mongodb";

export async function GET({ params }: any) {

    const cityId = new ObjectId(params.id);

    const cityData = await citiesCollection.findOne({_id: cityId});

    if (cityData != null) {
        return {
            status: 200,
            body: cityData
        };
    } else {
        return {
            status: 404,
            body: {
                message: `Could not find the cityId = ${params.id}`
            }
        };
    }
  }