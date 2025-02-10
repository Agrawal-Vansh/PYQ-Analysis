# 📝 Automated Question Extractor from PDFs (with OCR)

This project processes PDFs (both text-based and scanned images) to extract questions using **FastAPI**, **PyMuPDF**, and **Tesseract-OCR**.

## 🚀 Features
- Extracts text-based questions from PDFs.
- Uses **OCR** (Optical Character Recognition) to read text from images inside PDFs.
- Handles multiple PDFs simultaneously.
- Provides a FastAPI backend for easy integration.

---

## 🏗️ Project Structure
```
📁 project-root
 ┣ 📁 frontend             # React + Vite Frontend
 ┃ ┣ 📁 src
 ┃ ┃ ┣ 📜 App.jsx
 ┃ ┃ ┗ 📜 index.jsx
 ┃ ┣ 📜 package.json
 ┃ ┗ 📜 vite.config.js
 ┣ 📁 backend              # Node.js + Express Backend
 ┃ ┣ 📁 controllers
 ┃ ┃ ┗ 📜 fileUploadController.js
 ┃ ┣ 📁 routes
 ┃ ┃ ┗ 📜 fileRoutes.js
 ┃ ┣ 📜 server.js
 ┃ ┣ 📜 package.json
 ┗ 📁 nlp-service          # Python + FastAPI NLP Service
   ┣ 📁 venv               # Virtual Environment (Only for Python)
   ┣ 📜 main.py
   ┣ 📜 requirements.txt
   ┗ 📜 sentence_model.pkl  # Pretrained NLP Model  #Not implemented yet
```

# 📝 Installation and Setup

## Backend(Node js)

```
cd backend
npm i
npm run dev
```
## NLP-Service(Python)
```
cd nlp-service

# Create and activate a virtual environment
python -m venv venv #needed only initally

source venv/bin/activate  # On macOS/Linux

venv\Scripts\activate     # On Windows  

# Install dependencies 
pip install -r requirements.txt

# Run the FastAPI server
uvicorn main:app --reload

```

## Frontend(ReactJS)

```
cd frontend
npm i 
npm run dev
```



