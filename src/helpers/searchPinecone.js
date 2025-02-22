import axios from "axios";

export async function searchPinecone(searchEmbedding, apiKey, namespace) {
  const response = await axios.post("https://vsearch-7000tc0.svc.aped-4627-b74a.pinecone.io/query", {
    "vector": searchEmbedding,
    "top_k": 5,
    "namespace": namespace
  }, {
    headers: {
      "Content-Type": "application/json",
      "Api-Key": apiKey,
    }
  });

  return response.data;
}