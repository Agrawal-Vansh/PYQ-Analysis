import { useState } from "react";
import axios from "axios";
import Graph from "../../Components/BarGraph/BarGraph";

function Home() {
  const [subject, setSubject] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [pyqFiles, setPyqFiles] = useState([]);
  const [syllabus, setSyllabus] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e, type) => {
    if (type === "pyq") setPyqFiles([...e.target.files]);
    else setSyllabus(e.target.files[0]);
  };

  const uploadFiles = async () => {
    if (!subject && !newSubject) {
      alert("Please select or enter a subject before uploading.");
      return;
    }
    if (pyqFiles.length === 0) {
      alert("Please upload at least one PYQ file.");
      return;
    }

    const formData = new FormData();
    pyqFiles.forEach((file) => formData.append("pyqs", file));
    if (syllabus) formData.append("syllabus", syllabus);
    formData.append("subject", newSubject || subject);

    try {
      setLoading(true);
      setError(null);

      // Calls only `/api/upload` -> Node.js will call AI API internally
      const res = await axios.post("http://localhost:8000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Store extracted text and AI-generated questions from Node.js response
      setExtractedData(res.data);

      alert("Files uploaded and processed successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-white bg-red-500 px-6 py-2 rounded-lg shadow-md">
        Upload PYQ Papers
      </h1>

      <div className="bg-white p-6 my-6 w-full max-w-lg shadow-md rounded-lg">
        <label className="block text-lg font-semibold mb-2">Select Subject:</label>
        <input
          type="text"
          placeholder="Enter Subject"
          value={newSubject || subject}
          onChange={(e) => setNewSubject(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-red-300"
        />

        <h3 className="text-lg font-semibold mt-4">Upload PYQ Papers:</h3>
        <input
          type="file"
          multiple
          onChange={(e) => handleFileChange(e, "pyq")}
          className="w-full border p-2 rounded-md mt-2"
        />

        <h3 className="text-lg font-semibold mt-4">Upload Syllabus:</h3>
        <input
          type="file"
          onChange={(e) => handleFileChange(e, "syllabus")}
          className="w-full border p-2 rounded-md mt-2"
        />

        <button
          onClick={uploadFiles}
          disabled={loading}
          className="mt-4 w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        {error && <p className="text-red-600 text-center mt-2">{error}</p>}
      </div>
      <Graph />

      {/* Render Extracted Data */}
      {extractedData && (
        <div className="mt-6 w-full max-w-2xl bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-xl font-bold text-center text-red-500">📚 Extracted Syllabus</h2>
          <p className="mt-2 text-gray-700 p-2 border rounded">{extractedData.syllabus_text}</p>

          <h2 className="text-xl font-bold text-center text-red-500 mt-6">📝 Extracted PYQ Texts</h2>
          {extractedData.extracted_texts.length > 0 ? (
            extractedData.extracted_texts.map((text, index) => (
              <div key={index} className="mt-2 p-3 bg-gray-100 border rounded">
                <h3 className="font-semibold">📄 PYQ {index + 1}</h3>
                <p>{text}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No PYQ text extracted.</p>
          )}

          <h2 className="text-xl font-bold text-center text-red-500 mt-6">🧠 AI-Extracted Questions</h2>
          {extractedData.extracted_questions.length > 0 ? (
            <ul className="list-disc list-inside mt-2 text-gray-700">
              {extractedData.extracted_questions.map((question, index) => (
                <li key={index} className="mt-1">{question}</li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-600">No questions extracted by AI.</p>
          )}
        </div>
      )}
      
    </div>
  );
}

export default Home;
