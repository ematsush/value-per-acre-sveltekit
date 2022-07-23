import { parcelsCollection } from "$lib/db/mongodb";

export async function POST({ request }: any) {
  const selection = await request.json();

  const selectionQuery = {
    boundary: {
      $geoWithin: {
        $geometry: selection
      }
    }
  };

  const cursor = parcelsCollection.find(selectionQuery);

  return {
    status: 200,
    body: await cursor.toArray()
  };
}