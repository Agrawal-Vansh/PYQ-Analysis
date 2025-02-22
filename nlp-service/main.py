from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import fitz  # PyMuPDF
import re
import base64
import io
import pytesseract
from PIL import Image

app = FastAPI()

class PDFData(BaseModel):
    pyq_files: List[str]  # List of base64-encoded PDFs
    syllabus: str         # Base64-encoded syllabus PDF

def extract_text_from_pdf(pdf_bytes):
    print("[DEBUG] Extracting text from PDF...")
    try:
        doc = fitz.open(stream=io.BytesIO(pdf_bytes), filetype="pdf")
        text_content = []

        for page_num, page in enumerate(doc):
            print(f"[DEBUG] Processing page {page_num + 1}/{len(doc)}")
            
            # Extract text from the page
            text = page.get_text("text")
            text_content.append(text)
            
            # Extract images and apply OCR
            for img_index, img in enumerate(page.get_images(full=True)):
                xref = img[0]
                base_image = doc.extract_image(xref)
                image_bytes = base_image["image"]

                # Convert to PIL image and apply OCR
                image = Image.open(io.BytesIO(image_bytes))
                ocr_text = pytesseract.image_to_string(image)

                print(f"[DEBUG] Extracted OCR text from image {img_index + 1} on page {page_num + 1}")
                text_content.append(ocr_text)

        full_text = "\n".join(text_content)
        print(f"[DEBUG] Extracted text length: {len(full_text)} characters")
        return full_text
    except Exception as e:
        print(f"[ERROR] Failed to extract text from PDF: {str(e)}")
        return ""

def extract_questions(text):
    print("[DEBUG] Extracting questions from text...")
    try:
        sentences = re.split(r"\n|\.", text)
        questions = [s.strip() for s in sentences if "?" in s or "explain" in s.lower()]
        print(f"[DEBUG] Extracted {len(questions)} questions")
        return questions
    except Exception as e:
        print(f"[ERROR] Failed to extract questions: {str(e)}")
        return []

@app.get("/")
async def root():
    print("[DEBUG] Root endpoint hit")
    return {"message": "Python NLP service running"}

@app.post("/process_pdfs")
async def process_pdfs(data: PDFData):
    try:
        print("[DEBUG] Received PDF processing request")
        
        print("[DEBUG] Decoding syllabus PDF...")
        syllabus_text = extract_text_from_pdf(base64.b64decode(data.syllabus))
        syllabus_topics = syllabus_text.split("\n")
        print(f"[DEBUG] Extracted {len(syllabus_topics)} syllabus topics")

        all_questions = []
        for index, pdf_base64 in enumerate(data.pyq_files):
            print(f"[DEBUG] Processing PDF {index + 1}/{len(data.pyq_files)}...")
            pdf_bytes = base64.b64decode(pdf_base64)
            text = extract_text_from_pdf(pdf_bytes)
            questions = extract_questions(text)
            all_questions.extend(questions)

        print(f"[DEBUG] Total questions extracted: {len(all_questions)}")
        return {"questions": all_questions}

    except Exception as e:
        print(f"[ERROR] Failed to process PDFs: {str(e)}")
        return {"error": f"Failed to process PDFs: {str(e)}"}
