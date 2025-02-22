/* global chrome */
import { useState, useEffect } from "react";
import { YoutubeTranscript } from 'youtube-transcript';
import { upsertToPinecone } from "../helpers/upsert";
import { getEmbedding } from "../helpers/getEmbedding";
import LoadingOverlay from "./LoadingOverlay";

const SearchBox = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [videoId, setVideoId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      
      for (const segment of transcript) {
        const vectorId = `${videoId}-${segment.offset}`;
        const text = segment.text;
        const offset = segment.offset;
        const duration = segment.duration;
        const namespace = videoId;
        const embedding = await getEmbedding(text, openAiKey);
        await upsertToPinecone(vectorId, embedding, { "offset": offset, "duration": duration, "videoId": videoId }, pineconeKey, namespace);
      }
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
        </div>
      </div>
    </>
  );
};

export default SearchBox;

