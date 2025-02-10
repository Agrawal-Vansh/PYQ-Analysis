import axios from "axios";
import { TopicModel } from "../models/Topic.js";

export const processFiles = async (req, res) => {
    try {
        console.log("Processing files...");

        if (!req.files || !req.files["pyqs"] || !req.files["syllabus"]) {
            return res.status(400).json({ error: "Missing required files" });
        }

        const pyqBuffers = req.files["pyqs"].map(file => file.buffer.toString("base64")); // Convert to base64
        const syllabusBuffer = req.files["syllabus"][0].buffer.toString("base64");

        console.log("Sending files to Python API...");

        const response = await axios.post("http://localhost:8000/process_pdfs", {
            pyq_files: pyqBuffers,
            syllabus: syllabusBuffer
        });

        const { questions } = response.data;
        console.log("Questions extracted:", questions);
        
        // 🔹 Store extracted questions in MongoDB
        for (const question of questions) {
            await TopicModel.findOneAndUpdate(
                { topic: question },
                { $inc: { count: 1 } },
                { upsert: true }
            );
        }

        res.json({ message: "Processed Successfully!", questions });
    } catch (error) {
        console.error("Error processing files:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
