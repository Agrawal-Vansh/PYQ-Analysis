import { useState } from "react";
import axios from "axios";

function UploadPYQ() {
  const [subject, setSubject] = useState("");
  const [pyqFiles, setPyqFiles] = useState([]);
  const [syllabus, setSyllabus] = useState(null);
  const [topics, setTopics] = useState([]);

  const handleFileChange = (e, type) => {
    if (type === "pyq") setPyqFiles([...e.target.files]);
    else setSyllabus(e.target.files[0]);
  };

  const fetchTopics = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/upload/most-asked-topics");
      setTopics(res.data);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  const uploadFiles = async () => {
    if (!subject || pyqFiles.length === 0 || !syllabus) {
      alert("Please select a subject, PYQ files, and a syllabus before uploading.");
      return;
    }

    const formData = new FormData();
    pyqFiles.forEach((file) => formData.append("pyqs", file));
    formData.append("syllabus", syllabus);
    formData.append("subject", subject);
    console.log("Uploading files...");
    

    try {
      await axios.post("http://localhost:5000/api/upload", formData);
      alert("Files uploaded successfully!");
      console.log("Files uploaded successfully!");
      console.log("Fetching topics...");
      fetchTopics(); // ✅ Fetch topics only after successful upload
    } catch (error) {
      alert("Upload failed. Please try again.");
    }
  };

  return (
    <div>
      <h1>Upload PYQ Papers</h1>
      <input type="text" placeholder="Enter Subject" onChange={(e) => setSubject(e.target.value)} />
      <input type="file" multiple onChange={(e) => handleFileChange(e, "pyq")} />
      <input type="file" onChange={(e) => handleFileChange(e, "syllabus")} />
      <button onClick={uploadFiles}>Upload</button>

      {topics.length > 0 && (
        <>
          <h2>Most Asked Topics</h2>
          <ul>
            {topics.map((t, index) => (
              <li key={index}>
                {t.topic} ({t.count} times)
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default UploadPYQ;
