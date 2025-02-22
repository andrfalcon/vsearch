/* global chrome */
import axios from "axios";

export async function upsertToPinecone(vectorId, vectorValues, metadata, apiKey, namespace, pineconeEndpoint) {
  const response = await axios.post(`${pineconeEndpoint}/vectors/upsert`, {
    "vectors": [
      {
        "id": vectorId,
        "values": vectorValues,
        "metadata": metadata,
      }
    ],
    "namespace": namespace
  }, {
    headers: {
      "Content-Type": "application/json",
      "Api-Key": apiKey,
    }
  });

  console.log(response.data);
}