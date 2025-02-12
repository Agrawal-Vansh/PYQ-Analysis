import { useState } from "react";
import axios from "axios";

function UploadPYQ() {
  const [subject, setSubject] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [pyqFiles, setPyqFiles] = useState([]);
  const [syllabus, setSyllabus] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [loading, setLoading] = useState(false);

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
      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Store extracted text from the response
      setExtractedData(res.data);
      alert("Files uploaded successfully!");
    } catch (error) {
      alert("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
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

      {/* Render Extracted Text */}
      {extractedData && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
          <h2>📚 Extracted Syllabus</h2>
          <p>{extractedData.syllabus_text}</p>

          <h2>📝 Extracted PYQs</h2>
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
        </div>
      )}
    </div>
  );
}

export default UploadPYQ;
