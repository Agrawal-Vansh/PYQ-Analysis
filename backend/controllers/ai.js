import { GoogleGenerativeAI } from "@google/generative-ai";

export const handleAiResponse = async (req, res) => {
  try {
    const { extractedText } = req.body; // Extracted text from the scanned PDF
    
    if (!extractedText) {
      return res.status(400).json({ error: "No extracted text provided" });
    }

    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create structured prompt
    const prompt = `

      Given the following extracted text from a scanned exam paper, your task is to analyze the text 
      and return  the questions.

      Ensure:
      1. The extracted questions should be clearly structured and free from unnecessary text.
      2. If a question is split across multiple lines, combine them properly.
      3. Ignore any non-question content such as instructions, numbers, or formatting artifacts.
      Here is the extracted text:
      ${extractedText}
      
    `;

    console.log("Sending prompt to Gemini...");

    const result = await model.generateContent(prompt);
    const responseText = result.response.text(); // Extract AI's response

    // console.log("Gemini Response:", responseText);
    console.log("Gemini Response Received");
    
    
    // Parse JSON response

    return res.status(200).json({ans:responseText});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
};
