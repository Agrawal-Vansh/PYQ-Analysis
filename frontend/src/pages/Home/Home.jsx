import React, { useState, useEffect } from 'react';
import axios from 'axios';
import pdfToText from 'react-pdftotext';
import Question from '../../Components/QuestionBox/Question';
import Graph from '../../Components/BarGraph/BarGraph';
import ErrorPopUp from '../../Components/Error/Error';

function Home() {
  const [selectedSubject, setSelectedSubject] = useState("CN");
  const [pdfText, setPdfText] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [potentialQuestions, setPotentialQuestions] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState(new Set());
  const [showError, setShowError] = useState(false);

  const extractText = async (event) => {
    const files = event.target.files;
    if (!files.length) {
      console.error("No files selected.");
      return;
    }

    setLoading(true);
    const textPromises = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

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
      const texts = await Promise.all(textPromises);
      const combinedText = texts.map(item => `File: ${item.fileName}\n${item.text}`).join("\n\n");
      setPdfText(combinedText);
      await sendTextToAI(combinedText);
    } catch (error) {
      console.error("Error processing files:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendTextToAI = async (extractedText) => {
    try {
      console.log("Sending extracted text to AI...");
      const response = await axios.post(`${import.meta.env.VITE_URL}/api/ai/extract`, { extractedText, subject: selectedSubject });
      if (response.data && response.data.ans) {
        console.log("AI Response:", response.data.ans);
        setAiResponse(response.data.ans);
      } else {
        console.error("No response from AI.");
      }
    } catch (error) {
      console.error("Error sending text to AI:", error);
    } finally {
      setLoading(false);
    }
  };

  const generatePotentialQuestions = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Sending request for potential questions...");
      const response = await axios.post(`${import.meta.env.VITE_URL}/api/ai/potentialQuestions`, {
        subject: selectedSubject,
        "questions": [
          "What is the operating system?",
          "How does virtual memory work?",
          "What is the difference between a process and a thread?"
        ]
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.ans) {
        console.log("Potential Questions Response:", response.data.ans);
        setPotentialQuestions(response.data.ans);
      } else {
        console.error("No response from AI for potential questions.");
      }
    } catch (error) {
      console.error("Error generating potential questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = (questionIndex) => {
    setBookmarkedQuestions(prevState => {
      const newState = new Set(prevState);
      if (newState.has(questionIndex)) {
        newState.delete(questionIndex);
      } else {
        newState.add(questionIndex);
      }
      return newState;
    });
  };

  const renderQuestions = (text) => {
    const questions = text.split('\n');

    return questions.map((question, index) => (
      question.trim() !== "" && (
        <Question
          key={index}
          question={question}
          isBookmarked={bookmarkedQuestions.has(index)}
          onBookmarkToggle={() => toggleBookmark(index)}
        />
      )
    ));
  };

  const handleFileUpload = (event) => {
    setFileList([...event.target.files]);
  };

  const [dots, setDots] = useState("");
  console.log(bookmarkedQuestions);

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);

    return () => clearInterval(interval);
  }, [loading]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#1E1E2E] p-8">
      <h1 className="text-4xl font-bold text-white px-8 py-3 rounded-lg shadow-lg 
                     bg-gradient-to-r from-[#3B82F6] to-[#9333EA]">
        PDF Text Extractor
      </h1>

      {/* Subject Dropdown */}
      <div className="bg-[#2A2A3A] p-6 my-4 w-full max-w-lg shadow-lg rounded-xl border border-[#3B3B4F]">
        <h3 className="text-lg font-semibold text-gray-200">Select Subject:</h3>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="w-full border p-2 rounded-md mt-2 bg-[#3B3B4F] text-gray-300 focus:ring-2 focus:ring-[#3B82F6] focus:outline-none"
        >
          <option value="CN">Computer Networks</option>
          <option value="OS">Operating Systems</option>
          <option value="DBMS">Database Management Systems</option>
        </select>
      </div>

      {/* File Upload Section */}
      <div className="bg-[#2A2A3A] p-6 my-4 w-full max-w-lg shadow-lg rounded-xl border border-[#3B3B4F]">
        <h3 className="text-lg font-semibold text-gray-200">Upload PDF Files:</h3>
        <input
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleFileUpload}
          className="w-full border p-2 rounded-md mt-2 bg-[#3B3B4F] text-gray-300 focus:ring-2 focus:ring-[#3B82F6] focus:outline-none"
        />
      </div>

      <button
        onClick={() => extractText({ target: { files: fileList } })}
        className="px-4 py-2 bg-[#3B82F6] text-white rounded-md shadow-md mt-4 hover:bg-[#2563EB]">
        Upload and Extract Text
      </button>

      {loading && (
        <div className="mt-6 w-full max-w-2xl p-6 transition-all duration-300">
          <h2 className="text-5xl font-bold text-center text-[#70a7ff] animate-pulse">
            Loading{dots}
          </h2>
        </div>
      )}

      <div className="mt-6 w-full max-w-2xl">
        {aiResponse && renderQuestions(aiResponse)}
      </div>

      {aiResponse && (
        <button
          onClick={() => {
            if (!localStorage.getItem("loggedInUser")) {
              setShowError(true);
            } else {
              generatePotentialQuestions();
            }
          }}
          className="px-4 py-2 bg-[#9333EA] text-white rounded-md shadow-md mt-4 hover:bg-[#7E22CE]"
        >
          Generate Potential Questions
        </button>
      )}

      {potentialQuestions.length > 0 && (
        <div className="mt-6 w-full max-w-2xl">
          <h2 className="text-xl font-bold text-white">Generated Potential Questions:</h2>
          {potentialQuestions.map((question, index) => (
            <Question
              key={index}
              question={question.replace("* ", "")}
              isBookmarked={bookmarkedQuestions.has(index)}
              onBookmarkToggle={() => toggleBookmark(index)}
            />
          ))}
        </div>
      )}

      {aiResponse && <Graph />}
      {showError && <ErrorPopUp onClose={() => setShowError(false)} />}
    </div>
  );
}

export default Home;
