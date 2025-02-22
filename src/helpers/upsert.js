/* global chrome */
import axios from "axios";

export async function upsertToPinecone(vectorId, vectorValues, metadata, apiKey, namespace) {
  const response = await axios.post("https://vsearch-7000tc0.svc.aped-4627-b74a.pinecone.io/vectors/upsert", {
    "vectors": [
      {
        "id": vectorId,
        "values": vectorValues,
        "metadata": metadata,
        "namespace": namespace
      }
    ]
  }, {
    headers: {
      "Content-Type": "application/json",
      "Api-Key": apiKey,
    }
  });

  console.log(response.data);
}