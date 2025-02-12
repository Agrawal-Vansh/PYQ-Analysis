from fastapi import FastAPI
from pydantic import BaseModel
import fitz  # PyMuPDF
import base64
import io
import pytesseract
from PIL import Image

app = FastAPI()

class PDFData(BaseModel):
    pyq_files: list[str]  # List of base64-encoded PDFs
    syllabus: str         # Base64-encoded syllabus PDF

def extract_text_from_pdf(pdf_bytes):
    """
    Extracts text from a PDF using PyMuPDF for selectable text and Tesseract OCR for images.
    """
    print("[DEBUG] Extracting text from PDF...")
    try:
        doc = fitz.open(stream=io.BytesIO(pdf_bytes), filetype="pdf")
        text_content = []

        for page_num, page in enumerate(doc):
            print(f"[DEBUG] Processing page {page_num + 1}/{len(doc)}")
            
            # Extract selectable text
            text = page.get_text("text").strip()
            text_content.append(text)
            
            # Extract images and apply OCR
            for img_index, img in enumerate(page.get_images(full=True)):
                xref = img[0]
                base_image = doc.extract_image(xref)
                image_bytes = base_image["image"]

                # Convert to PIL image and apply OCR
                image = Image.open(io.BytesIO(image_bytes)).convert("L")  # Convert to grayscale
                ocr_text = pytesseract.image_to_string(image, config="--psm 6")  # OCR processing

                print(f"[DEBUG] Extracted OCR text from image {img_index + 1} on page {page_num + 1}")
                text_content.append(ocr_text)

        full_text = "\n".join(text_content)
        print(f"[DEBUG] Extracted text length: {len(full_text)} characters")
        return full_text
    except Exception as e:
        print(f"[ERROR] Failed to extract text from PDF: {str(e)}")
        return ""

@app.get("/")
async def root():
    """
    Root endpoint to check if the API is running.
    """
    print("[DEBUG] Root endpoint hit")
    return {"message": "Python NLP service running"}

@app.post("/process_pdfs")
async def process_pdfs(data: PDFData):
    """
    Processes the provided PDFs, extracts text, and returns the full text.
    """
    try:
        print("[DEBUG] Received PDF processing request")
        
        print("[DEBUG] Decoding syllabus PDF...")
        syllabus_text = extract_text_from_pdf(base64.b64decode(data.syllabus))
        print(f"[DEBUG] Extracted syllabus text length: {len(syllabus_text)} characters")

        extracted_texts = []
        for index, pdf_base64 in enumerate(data.pyq_files):
            print(f"[DEBUG] Processing PDF {index + 1}/{len(data.pyq_files)}...")
            pdf_bytes = base64.b64decode(pdf_base64)
            text = extract_text_from_pdf(pdf_bytes)
            extracted_texts.append(text)

        return {"syllabus_text": syllabus_text, "extracted_texts": extracted_texts}

    except Exception as e:
        print(f"[ERROR] Failed to process PDFs: {str(e)}")
        return {"error": f"Failed to process PDFs: {str(e)}"}
