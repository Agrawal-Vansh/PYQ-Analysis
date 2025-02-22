import { useState } from "react";
import axios from "axios";

function UploadPYQ() {
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
      const res = await axios.post(`${import.meta.env.VITE_URL}/api/upload`, formData, {
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
    <div  className="bg-red-400">
      <h1>Upload PYQ Papers</h1>

      <label>Select Subject:</label>
      <input
        type="text"
        placeholder="Enter Subject"
        value={newSubject || subject}
        onChange={(e) => setNewSubject(e.target.value)}
      />

      <h3>Upload PYQ Papers:</h3>
      <input type="file" multiple onChange={(e) => handleFileChange(e, "pyq")} />

      <h3>Upload Syllabus:</h3>
      <input type="file" onChange={(e) => handleFileChange(e, "syllabus")} />

      <button onClick={uploadFiles} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Render Extracted Data */}
      {extractedData && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
          <h2>📚 Extracted Syllabus</h2>
          <p>{extractedData.syllabus_text}</p>

          <h2>📝 Extracted PYQ Texts</h2>
          {extractedData.extracted_texts.length > 0 ? (
            extractedData.extracted_texts.map((text, index) => (
              <div key={index} style={{ marginBottom: "10px", padding: "10px", border: "1px solid #ccc" }}>
                <h3>📄 PYQ {index + 1}</h3>
                <p>{text}</p>
              </div>
            ))
          ) : (
            <p>No PYQ text extracted.</p>
          )}

          <h2>🧠 AI-Extracted Questions</h2>
          {extractedData.extracted_questions.length > 0 ? (
            <ul>
              {extractedData.extracted_questions.map((question, index) => (
                <li key={index}>{question}</li>
              ))}
            </ul>
          ) : (
            <p>No questions extracted by AI.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default UploadPYQ;
