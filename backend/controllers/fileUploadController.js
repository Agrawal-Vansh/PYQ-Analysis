import axios from "axios";
import { TopicModel } from "../models/Topic.js";

export const processFiles = async (req, res) => {
    try {
        console.log("Processing files...");

        if (!req.files || !req.files["pyqs"] || !req.files["syllabus"]) {
            return res.status(400).json({ error: "Missing required files" });
        }

        // Convert files to base64
        const pyqBuffers = req.files["pyqs"].map(file => file.buffer.toString("base64"));
        const syllabusBuffer = req.files["syllabus"][0].buffer.toString("base64");

        console.log("Sending files to Python API...");

        const response = await axios.post("http://localhost:8000/process_pdfs", {
            pyq_files: pyqBuffers,
            syllabus: syllabusBuffer
        });

        const { syllabus_text, extracted_texts } = response.data;
        console.log("Extracted Syllabus Text:", syllabus_text);
        console.log("Extracted PYQ Texts:", extracted_texts);

        // 🔹 Store extracted text in MongoDB
        for (const extractedText of extracted_texts) {
            await TopicModel.create({ content: extractedText });
        }

        res.json({ message: "Processed Successfully!", syllabus_text, extracted_texts });
    } catch (error) {
        console.error("Error processing files:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
