export async function getEmbedding(text, openAiKey) {
    const url = "https://api.openai.com/v1/embeddings";
    
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${openAiKey}`
        },
        body: JSON.stringify({
            input: text,
            model: "text-embedding-ada-002"
        })
    });
    
    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data[0].embedding;
}
