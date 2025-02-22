import axios from "axios";

export async function searchPinecone(searchEmbedding, apiKey, namespace, pineconeEndpoint) {
  const response = await axios.post(`${pineconeEndpoint}/query`, {
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