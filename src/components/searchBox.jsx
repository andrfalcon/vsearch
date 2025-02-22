/* global chrome */
import { useState, useEffect } from "react";
import { YoutubeTranscript } from 'youtube-transcript';
import { upsertToPinecone } from "../helpers/upsert";
import { getEmbedding } from "../helpers/getEmbedding";
import LoadingOverlay from "./LoadingOverlay";
import { searchPinecone } from "../helpers/searchPinecone";
const SearchBox = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [videoId, setVideoId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    // Get current tab URL when component mounts
    getCurrentTabUrl();
  }, []);

  const getCurrentTabUrl = async () => {
    // Query for the active tab in the current window
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]?.url) {
      const url = new URL(tabs[0].url);
      // Extract video ID from YouTube URL
      if (url.hostname.includes('youtube.com')) {
        const videoId = url.searchParams.get('v');
        setVideoId(videoId);
      }
    }
  };

  const handleSearch = async () => {
    if (!videoId) {
      console.error('No YouTube video ID found');
      return;
    }

    try {
      const transcript = await YoutubeTranscript.fetchTranscript(videoId);
      console.log(transcript);
      return transcript;
    } catch (error) {
      console.error('Error fetching transcript:', error);
    }
  };

  const handleProcess = async () => {
    setIsLoading(true);
    try {
      const transcript = await handleSearch();
      const openAiKey = localStorage.getItem('openAiKey');
      const pineconeKey = localStorage.getItem('pineconeKey');
      const pineconeEndpoint = localStorage.getItem('pineconeEndpoint');
      const namespace = videoId;
      
      // Compute embeddings of video and upsert to Pinecone
      for (const segment of transcript) {
        const vectorId = `${videoId}-${segment.offset}`;
        const text = segment.text;
        const offset = segment.offset;
        const duration = segment.duration;
        const embedding = await getEmbedding(text, openAiKey);
        await upsertToPinecone(vectorId, embedding, { "offset": offset, "duration": duration, "videoId": videoId }, pineconeKey, namespace, pineconeEndpoint);
      }

      // Compute embeddings of search query and search Pinecone
      const searchQuery = searchTerm;
      const searchEmbedding = await getEmbedding(searchQuery, openAiKey);
      const results = await searchPinecone(searchEmbedding, pineconeKey, namespace, pineconeEndpoint);
      
      // Store results
      const timestamps = [];

      results["matches"].forEach(match => {
        const timestamp = match.id.split("-")[1];
        timestamps.push(timestamp);
      });
      
      setSearchResults(timestamps);

    } catch (error) {
      console.error('Error processing video:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <div className="w-full max-w-md mx-auto p-4">
        <div className="border rounded-lg shadow-sm bg-white p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">Search Video</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-grow px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="px-6 py-2 text-white font-semibold rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transform transition-transform duration-200 hover:scale-105 active:scale-95"
              onClick={handleProcess}
            >
              Search
            </button>
          </div>

          {/* New Results Section */}
          {searchResults.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Results</h3>
              <div className="space-y-2">
                {searchResults.map((timestamp, index) => (
                  <div 
                    key={timestamp}
                    className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-medium">
                      {index + 1}
                    </div>
                    <span className="text-gray-700">
                      {Math.floor(timestamp / 60)}:{String(Math.floor(timestamp % 60)).padStart(2, '0')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchBox;

