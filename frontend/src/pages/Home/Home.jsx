import { useState } from "react";
import axios from "axios";
import Graph from "../../Components/BarGraph/BarGraph";

function Home() {
  const [subject, setSubject] = useState("");
  const [pyqFiles, setPyqFiles] = useState([]);
  const [syllabus, setSyllabus] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    if (type === "pyq") setPyqFiles(files);
    else setSyllabus(files[0]);
  };

  const uploadFiles = async () => {
    if (!subject.trim()) {
      alert("Please enter a subject before uploading.");
      return;
    }
    if (pyqFiles.length === 0) {
      alert("Please upload at least one PYQ file.");
      return;
    }

    const formData = new FormData();
    pyqFiles.forEach((file) => formData.append("pyqs", file));
    if (syllabus) formData.append("syllabus", syllabus);
    formData.append("subject", subject);

    try {
      setLoading(true);
      setError(null);

      const res = await axios.post("http://localhost:8000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setExtractedData(res.data);
      alert("Files uploaded and processed successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      setError(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-center text-white bg-red-600 px-8 py-3 rounded-lg shadow-lg">
        Upload PYQ Papers
      </h1>

      <div className="bg-white p-6 my-6 w-full max-w-lg shadow-lg rounded-xl border border-gray-200">
        <label className="block text-lg font-semibold mb-2 text-gray-700">Select Subject:</label>
        <input
          type="text"
          placeholder="Enter Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-400 focus:outline-none"
        />

        <h3 className="text-lg font-semibold mt-4 text-gray-700">Upload PYQ Papers:</h3>
        <input
          type="file"
          multiple
          onChange={(e) => handleFileChange(e, "pyq")}
          className="w-full border p-2 rounded-md mt-2 bg-gray-50 focus:ring-2 focus:ring-red-300 focus:outline-none"
        />

        <h3 className="text-lg font-semibold mt-4 text-gray-700">Upload Syllabus:</h3>
        <input
          type="file"
          onChange={(e) => handleFileChange(e, "syllabus")}
          className="w-full border p-2 rounded-md mt-2 bg-gray-50 focus:ring-2 focus:ring-red-300 focus:outline-none"
        />

        <button
          onClick={uploadFiles}
          disabled={loading}
          className="mt-4 w-full bg-red-600 text-white py-3 rounded-md font-semibold hover:bg-red-700 transition-all duration-300 shadow-md disabled:bg-gray-400"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        {error && <p className="text-red-600 text-center mt-3">{error}</p>}
      </div>

      <Graph />

      {extractedData && (
        <div className="mt-6 w-full max-w-2xl bg-white p-6 shadow-lg rounded-xl border border-gray-200">
          <h2 className="text-2xl font-bold text-center text-red-600">📚 Extracted Syllabus</h2>
          <p className="mt-2 text-gray-700 p-3 border rounded bg-gray-50">{extractedData.syllabus_text}</p>

          <h2 className="text-2xl font-bold text-center text-red-600 mt-6">📝 Extracted PYQ Texts</h2>
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

          <h2 className="text-2xl font-bold text-center text-red-600 mt-6">🧠 AI-Extracted Questions</h2>
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
