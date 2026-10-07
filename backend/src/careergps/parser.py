from io import BytesIO
from pypdf import PdfReader
from fastapi import HTTPException

MAX_PDF_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB maximum

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    if len(pdf_bytes) > MAX_PDF_SIZE_BYTES:
        raise HTTPException(
            status_code=400,
            detail=f"PDF file size exceeds maximum allowed limit of {MAX_PDF_SIZE_BYTES // (1024 * 1024)}MB."
        )

    if not pdf_bytes or len(pdf_bytes) < 10:
        return ""

    try:
        reader = PdfReader(BytesIO(pdf_bytes))
        if len(reader.pages) == 0:
            return ""

        extracted_text = []
        # Guard against deeply nested or runaway PDF bombs
        for i, page in enumerate(reader.pages[:20]):
            text = page.extract_text()
            if text:
                extracted_text.append(text)
        return "\n".join(extracted_text)
    except Exception as e:
        # Fallback without crashing server
        return ""
