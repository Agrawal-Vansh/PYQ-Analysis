import React, { useState } from 'react';
import axios from 'axios';
import pdfToText from 'react-pdftotext';

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
          setPdfText(text); // Store extracted text in state
          sendTextToAI(text); // Send text to the AI model
        })
        .catch(error => {
          console.error("Error during text extraction:", error);
        });
    } catch (error) {
      console.error("An error occurred while processing the PDF file:", error);
    }
  };

  // Function to send extracted text to the server
  const sendTextToAI = async (extractedText) => {
    try {
      console.log("Sending extracted text to AI...");

      const response = await axios.post(`${import.meta.env.VITE_URL}/api/ai/extract`, { extractedText });
      
      // Handle the response from the AI model
      if (response.data && response.data.ans) {
        console.log("AI Response:", response.data.ans);
        setAiResponse(response.data.ans); // Update state with AI's response
      } else {
        console.error("No response from AI.");
      }
    } catch (error) {
      console.error("Error sending text to AI:", error);
    }
  };

  // Function to split the text by newlines and display each line separately
  const renderTextLines = (text) => {
    const lines = text.split('\n');
    return lines.map((line, index) => (
      <p key={index} className="text-gray-700 mb-2">{line}</p>
    ));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-3xl font-semibold text-center text-gray-700 mb-6">PDF Text Extractor</h1>
        
        <div className="mb-6">
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={extractText}
            className="block w-full text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {pdfText && (
          <div className="bg-gray-50 p-4 rounded-lg mt-6">
            <h2 className="text-2xl font-medium text-gray-800 mb-4">Extracted Text:</h2>
            <div>
              {renderTextLines(pdfText)} {/* Render each line of the extracted text */}
            </div>
          </div>
        )}

        {aiResponse && (
          <div className="bg-gray-50 p-4 rounded-lg mt-6">
            <h2 className="text-2xl font-medium text-gray-800 mb-4">AI Processed Response:</h2>
            <div>
              {renderTextLines(aiResponse)} {/* Render AI response */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
