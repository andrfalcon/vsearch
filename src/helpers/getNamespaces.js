import axios from "axios";

export async function getNamespaces(apiKey, pineconeEndpoint) {
    const response = await axios.get(`${pineconeEndpoint}/describe_index_stats`, {
      headers: {
        "Content-Type": "application/json",
        "Api-Key": apiKey,
      }
    });
  
    return Object.keys(response.data["namespaces"]);
}