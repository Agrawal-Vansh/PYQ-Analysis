import React, { useState } from 'react';
import axios from 'axios';
import pdfToText from 'react-pdftotext';
import Graph from '../../Components/BarGraph/BarGraph';

function Home() {
  const [pdfText, setPdfText] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  const extractText = (event) => {
    const file = event.target.files[0];

    if (!file) {
      console.error("No file selected.");
      return;
    }

    try {
      console.log("Starting to extract text from the PDF...");
      pdfToText(file)
        .then(text => {
          console.log("Text extracted successfully.");
          setPdfText(text);
          sendTextToAI(text);
        })
        .catch(error => {
          console.error("Error during text extraction:", error);
        });
    } catch (error) {
      console.error("An error occurred while processing the PDF file:", error);
    }
  };

  const sendTextToAI = async (extractedText) => {
    try {
      console.log("Sending extracted text to AI...");
      const response = await axios.post(`${import.meta.env.VITE_URL}/api/ai/extract`, { extractedText });
      if (response.data && response.data.ans) {
        console.log("AI Response:", response.data.ans);
        setAiResponse(response.data.ans);
      } else {
        console.error("No response from AI.");
      }
    } catch (error) {
      console.error("Error sending text to AI:", error);
    }
  };

  const renderTextLines = (text) => {
    const lines = text.split('\n');
    return lines.map((line, index) => (
      <p key={index} className="text-gray-300 mb-2">{line}</p>
    ));
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#1E1E2E] p-8">
      {/* Header */}
      <h1 className="text-4xl font-bold text-white px-8 py-3 rounded-lg shadow-lg 
                     bg-gradient-to-r from-[#3B82F6] to-[#9333EA]">
        PDF Text Extractor
      </h1>

      {/* Upload Section */}
      <div className="bg-[#2A2A3A] p-6 my-6 w-full max-w-lg shadow-lg rounded-xl border border-[#3B3B4F]">
        <h3 className="text-lg font-semibold text-gray-200">Upload PDF:</h3>
        <input 
          type="file" 
          accept="application/pdf" 
          onChange={extractText}
          className="w-full border p-2 rounded-md mt-2 bg-[#3B3B4F] text-gray-300 focus:ring-2 focus:ring-[#3B82F6] focus:outline-none"
        />
      </div>

      {/* Loading Message */}
      {pdfText && !aiResponse && (
        <div className="mt-6 w-full max-w-2xl bg-[#2A2A3A] p-6 shadow-lg rounded-xl border border-[#3B3B4F]">
          <h2 className="text-2xl font-bold text-center text-[#3B82F6]">Loading......</h2>
        </div>
      )}

      {/* AI Response Section */}
      {aiResponse && (
        <div className="mt-6 w-full max-w-2xl bg-[#2A2A3A] p-6 shadow-lg rounded-xl border border-[#3B3B4F]">
          <h2 className="text-2xl font-bold text-center text-[#3B82F6]">🧠 AI-Processed Response</h2>
          <div className="mt-2 text-gray-300 p-3 border rounded bg-[#3B3B4F]">
            {renderTextLines(aiResponse)}
          </div>
        </div>
      )}

      {/* Graph Component */}
      <Graph />
    </div>
  );
}

export default Home;
