import { useState, useEffect } from "react";
import axios from "axios";

function UploadPYQ() {
  const [subject, setSubject] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [pyqFiles, setPyqFiles] = useState([]);
  const [syllabus, setSyllabus] = useState(null);
  const [useExistingSyllabus, setUseExistingSyllabus] = useState(false);
  const [existingSyllabi, setExistingSyllabi] = useState([]);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    // fetchSubjects();
    // fetchExistingSyllabi();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/subjects");
      setSubjects(res.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const fetchExistingSyllabi = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/syllabi");
      setExistingSyllabi(res.data);
    } catch (error) {
      console.error("Error fetching syllabi:", error);
    }
  };

  const handleFileChange = (e, type) => {
    if (type === "pyq") {
      setPyqFiles([...e.target.files]);
    } else {
      setSyllabus(e.target.files[0]);
    }
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
    if (!useExistingSyllabus && !syllabus) {
      alert("Please upload a syllabus file or select an existing one.");
      return;
    }

    const formData = new FormData();
    pyqFiles.forEach((file) => formData.append("pyqs", file));
    if (!useExistingSyllabus) {
      formData.append("syllabus", syllabus);
    } else {
      formData.append("syllabus_id", syllabus);
    }
    formData.append("subject", newSubject || subject);

    try {
      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Files uploaded successfully!");
      console.log(res.data);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    }
  };

  return (
    <div>
      <h1>Upload PYQ Papers</h1>
      
      <label>Select Subject:</label>
      <select value={subject} onChange={(e) => setSubject(e.target.value)}>
        <option value="">-- Select Subject --</option>
        {subjects.map((sub, index) => (
          <option key={index} value={sub}>{sub}</option>
        ))}
      </select>
      
      <h3>Or Add New Subject:</h3>
      <input
        type="text"
        placeholder="Enter New Subject"
        value={newSubject}
        onChange={(e) => setNewSubject(e.target.value)}
      />

      <h3>Upload PYQ Papers:</h3>
      <input type="file" multiple onChange={(e) => handleFileChange(e, "pyq")} />

      {pyqFiles.length > 0 && (
        <div>
          <h3>Preview Uploaded PYQ Papers:</h3>
          <ul>
            {pyqFiles.map((file, index) => (
              <li key={index}>
                <a href={URL.createObjectURL(file)} target="_blank" rel="noopener noreferrer">{file.name}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <h3>Syllabus:</h3>
      <label>
        <input
          type="checkbox"
          checked={useExistingSyllabus}
          onChange={() => setUseExistingSyllabus(!useExistingSyllabus)}
        />
        Use Existing Syllabus
      </label>
      
      {useExistingSyllabus ? (
        <select value={syllabus} onChange={(e) => setSyllabus(e.target.value)}>
          <option value="">-- Select Existing Syllabus --</option>
          {existingSyllabi.map((s, index) => (
            <option key={index} value={s._id}>{s.name}</option>
          ))}
        </select>
      ) : (
        <input type="file" onChange={(e) => handleFileChange(e, "syllabus")} />
      )}

      <button onClick={uploadFiles}>Upload</button>
    </div>
  );
}

export default UploadPYQ;
