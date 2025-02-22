"use client"

import { useState, useEffect } from "react"

export default function ApiInput() {
  const [openAiKey, setOpenAiKey] = useState(() => {
    // Initialize state with value from localStorage if it exists
    return localStorage.getItem('openAiKey') || ""
  })
  const [pineconeKey, setPineconeKey] = useState(() => {
    return localStorage.getItem('pineconeKey') || ""
  })
  const [pineconeEndpoint, setPineconeEndpoint] = useState(() => {
    return localStorage.getItem('pineconeEndpoint') || ""
  })
  const [isOpen, setIsOpen] = useState(false)

  // Save to localStorage whenever keys change
  useEffect(() => {
    localStorage.setItem('openAiKey', openAiKey)
    localStorage.setItem('pineconeKey', pineconeKey)
    localStorage.setItem('pineconeEndpoint', pineconeEndpoint)
  }, [openAiKey, pineconeKey, pineconeEndpoint])

  const handleOpenAiChange = (e) => {
    setOpenAiKey(e.target.value)
  }

  const handlePineconeChange = (e) => {
    setPineconeKey(e.target.value)
  }

  const handlePineconeEndpointChange = (e) => {
    setPineconeEndpoint(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Explicitly save to localStorage when form is submitted
    localStorage.setItem('openAiKey', openAiKey)
    localStorage.setItem('pineconeKey', pineconeKey)
    localStorage.setItem('pineconeEndpoint', pineconeEndpoint)
    setIsOpen(false)
  }

  const allFieldsPresent = openAiKey && pineconeKey && pineconeEndpoint

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="border rounded-lg shadow-sm bg-white">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">API Keys</span>
            {allFieldsPresent ? (
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <button
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close API key input" : "Open API key input"}
          >
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="m18 15-6-6-6 6" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            )}
          </button>
        </div>
        {isOpen && (
          <form onSubmit={handleSubmit} className="p-4 border-t space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">OpenAI API Key</label>
              <input
                type="password"
                placeholder="Enter your OpenAI API Key"
                value={openAiKey}
                onChange={handleOpenAiChange}
                className="w-full px-3 py-2 border rounded-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Pinecone API Key</label>
              <input
                type="password"
                placeholder="Enter your Pinecone API Key"
                value={pineconeKey}
                onChange={handlePineconeChange}
                className="w-full px-3 py-2 border rounded-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Pinecone Endpoint</label>
              <input
                type="text"
                placeholder="Enter your Pinecone Endpoint"
                value={pineconeEndpoint}
                onChange={handlePineconeEndpointChange}
                className="w-full px-3 py-2 border rounded-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-semibold rounded-md hover:from-purple-600 hover:via-pink-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Save
            </button>
          </form>
        )}
      </div>
    </div>
  )
}