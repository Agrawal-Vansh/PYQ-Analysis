import React, { useState } from 'react';
import axios from 'axios';
import pdfToText from 'react-pdftotext';
import { CiBookmark } from "react-icons/ci";  // Import unbookmarked icon
import { FaBookmark } from "react-icons/fa";  // Import bookmarked icon
import Graph from '../../Components/BarGraph/BarGraph';

// Question Component to render each individual question
function Question({ question, onBookmarkToggle, isBookmarked }) {
  return (
    <div className="mt-4 w-full max-w-2xl bg-[#2A2A3A] p-6 shadow-lg rounded-xl border border-[#3B3B4F]">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-[#3B82F6]">{question}</h3>
        <button onClick={onBookmarkToggle}>
          {isBookmarked ? (
            <FaBookmark className="text-yellow-500" size={24} />
          ) : (
            <CiBookmark className="text-gray-300" size={24} />
          )}
        </button>
      </div>
    </div>
  );
}

function Home() {
  const [pdfText, setPdfText] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState(new Set()); // Track bookmarked questions

  const extractText = async (event) => {
    const files = event.target.files;
    if (!files.length) {
      console.error("No files selected.");
      return;
    }

    setLoading(true); // Set loading to true while extracting
    const textPromises = [];

    // Loop through all selected files
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Make sure to process each file and extract its text
      const textPromise = pdfToText(file)
        .then(text => {
          console.log(`Text extracted successfully from file: ${file.name}`);
          return { fileName: file.name, text };
        })
        .catch(error => {
          console.error(`Error during text extraction for ${file.name}:`, error);
          return { fileName: file.name, text: 'Error extracting text' };
        });

      textPromises.push(textPromise);
    }

    try {
      const texts = await Promise.all(textPromises); // Await all promises to resolve
      const combinedText = texts.map(item => `File: ${item.fileName}\n${item.text}`).join("\n\n");
      setPdfText(combinedText);
      await sendTextToAI(combinedText); // Await the sendTextToAI call to ensure it completes before finishing
    } catch (error) {
      console.error("Error processing files:", error);
    } finally {
      setLoading(false); // Stop loading after processing is done, whether successful or not
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
    } finally {
      setLoading(false); // Stop loading after AI response
    }
  };

  // Toggle Bookmark function
  const toggleBookmark = (questionIndex) => {
    setBookmarkedQuestions(prevState => {
      const newState = new Set(prevState);
      if (newState.has(questionIndex)) {
        newState.delete(questionIndex); // Remove bookmark
      } else {
        newState.add(questionIndex); // Add bookmark
      }
      return newState;
    });
  };

  // Function to render each question in its own div
  const renderQuestions = (text) => {
    const questions = text.split('\n'); // Split the text by line

    // Iterate over each line/question and render it separately
    return questions.map((question, index) => (
      // Check if the question is not an empty string
      question.trim() !== "" && (
        <Question
          key={index}
          question={question}
          isBookmarked={bookmarkedQuestions.has(index)} // Check if this question is bookmarked
          onBookmarkToggle={() => toggleBookmark(index)} // Toggle bookmark state
        />
      )
    ));
  };

  const handleFileUpload = (event) => {
    setFileList([...event.target.files]);
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
        <h3 className="text-lg font-semibold text-gray-200">Upload PDF Files:</h3>
        <input 
          type="file" 
          accept="application/pdf" 
          multiple // Allow multiple file uploads
          onChange={handleFileUpload}
          className="w-full border p-2 rounded-md mt-2 bg-[#3B3B4F] text-gray-300 focus:ring-2 focus:ring-[#3B82F6] focus:outline-none"
        />
      </div>

      <button 
        onClick={() => extractText({ target: { files: fileList } })} 
        className="px-4 py-2 bg-[#3B82F6] text-white rounded-md shadow-md mt-4 hover:bg-[#2563EB]">
        Upload and Extract Text
      </button>

      {/* Loading Message */}
      {loading && (
        <div className="mt-6 w-full max-w-2xl bg-[#2A2A3A] p-6 shadow-lg rounded-xl border border-[#3B3B4F]">
          <h2 className="text-2xl font-bold text-center text-[#70a7ff]">Loading......</h2>
        </div>
      )}

      {/* Render the extracted questions */}
      <div className="mt-6 w-full max-w-2xl">
        {aiResponse && renderQuestions(aiResponse)} {/* Render each question in its own div */}
      </div>

      {/* checking to reduce API Load  */}
      {/* <div className="mt-6 w-full max-w-2xl">
        Render each question in its own div
        {renderQuestions(pdfText)} 
      </div> */}

      {/* Graph Component */}
      {aiResponse &&     <Graph />}
   
    </div>
  );
}

export default Home;
